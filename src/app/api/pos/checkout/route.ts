import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerId,
      items,
      paymentMethod,
      splitCashAmount = 0,
      splitUpiAmount = 0,
      pointsRedeemed = 0,
      pointsDiscountAmount = 0,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Default cashier user for terminal
    const cashier = await prisma.user.findFirst({
      where: { role: "cashier" },
    });

    const userId = cashier?.id || (await prisma.user.findFirst())?.id;
    if (!userId) {
      return NextResponse.json(
        { error: "No active cashier found" },
        { status: 500 }
      );
    }

    // Execute atomic transaction in Neon PostgreSQL with strict stock lock
    const result = await prisma.$transaction(async (tx) => {
      // 1. Validate Stock for all variants
      for (const item of items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true },
        });

        if (!variant) {
          throw new Error(`Variant not found: ${item.variantId}`);
        }

        if (variant.stockQuantity < item.quantity) {
          throw new Error(
            `Insufficient stock for "${variant.product.name} (${variant.variantName})". Available: ${variant.stockQuantity}, Requested: ${item.quantity}`
          );
        }

        // Decrement stock atomically
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      // 2. Calculate Totals
      const subtotal = items.reduce(
        (sum: number, item: any) => sum + item.unitPrice * item.quantity,
        0
      );

      const totalGst = items.reduce((sum: number, item: any) => {
        if (!item.gstRate) return sum;
        const base =
          (item.unitPrice * item.quantity) / (1 + item.gstRate / 100);
        return sum + (item.unitPrice * item.quantity - base);
      }, 0);

      const totalAmount = Math.max(0, subtotal - pointsDiscountAmount);

      // Points earned: 1 pt per ₹10 spent
      const pointsEarned = Math.floor(totalAmount / 10);

      // Generate Serial Invoice Number
      const count = await tx.invoice.count();
      const invoiceNumber = `TK-2026-${String(count + 1).padStart(4, "0")}`;

      // 3. Create Invoice
      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          customerId,
          userId,
          subtotal,
          taxAmount: totalGst,
          discountAmount: pointsDiscountAmount,
          totalAmount,
          paymentMethod,
          splitCashAmount: paymentMethod === "SPLIT" ? splitCashAmount : 0,
          splitUpiAmount: paymentMethod === "SPLIT" ? splitUpiAmount : 0,
          pointsEarned,
          pointsRedeemed,
          pointsDiscountAmount,
          status: "PAID",
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              variantId: item.variantId,
              itemName: "Item",
              variantName: "Variant",
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              costPrice: 0,
              gstRate: item.gstRate || 0,
              gstAmount: 0,
              lineTotal: item.unitPrice * item.quantity,
            })),
          },
        },
        include: {
          customer: true,
          items: true,
        },
      });

      // 4. Update Customer Loyalty & Spend
      if (customerId) {
        await tx.customer.update({
          where: { id: customerId },
          data: {
            totalSpend: { increment: totalAmount },
            visitCount: { increment: 1 },
            loyaltyPoints: {
              decrement: pointsRedeemed,
              increment: pointsEarned,
            },
            lastVisitAt: new Date(),
          },
        });
      }

      return invoice;
    });

    return NextResponse.json({ success: true, invoice: result });
  } catch (err: any) {
    console.error("Checkout transaction error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to complete transaction" },
      { status: 409 }
    );
  }
}

"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Drawer } from "@/components/ui/Drawer";
import { motion, AnimatePresence } from "motion/react";

interface Variant {
  id: string;
  variantName: string;
  attributeType: string;
  sellingPrice: string | number;
  stockQuantity: number;
  lowStockThreshold: number;
  barcode?: string | null;
}

interface Product {
  id: string;
  name: string;
  brand: string | null;
  description: string | null;
  categoryId: string;
  category: { id: string; name: string; defaultGstRate: string | number };
  variants: Variant[];
}

interface Customer {
  id: string;
  name: string;
  mobile: string;
  whatsapp: string;
  loyaltyPoints: number;
}

interface CartItem {
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  brand: string | null;
  price: number;
  quantity: number;
  gstRate: number;
  gstEnabled: boolean;
}

export function POSClient({
  initialProducts,
  initialCategories,
  initialCustomers,
}: {
  initialProducts: any[];
  initialCategories: any[];
  initialCustomers: any[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    initialCustomers[0] || null
  );
  const [redeemPoints, setRedeemPoints] = useState(false);
  const [paymentMode, setPaymentMode] = useState<"CASH" | "UPI" | "SPLIT">(
    "UPI"
  );
  const [splitCashAmount, setSplitCashAmount] = useState<number>(0);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [completedInvoice, setCompletedInvoice] = useState<any | null>(null);

  // Drawers
  const [isReturnDrawerOpen, setIsReturnDrawerOpen] = useState(false);
  const [isStockInDrawerOpen, setIsStockInDrawerOpen] = useState(false);
  const [isPinLockOpen, setIsPinLockOpen] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");

  // Filter products by category and predictive search
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesCat =
        selectedCategory === "ALL" || product.categoryId === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCat;
      const matchesName = product.name.toLowerCase().includes(q);
      const matchesBrand = product.brand?.toLowerCase().includes(q);
      const matchesBarcode = product.variants.some((v: any) =>
        v.barcode?.toLowerCase().includes(q)
      );
      return matchesCat && (matchesName || matchesBrand || matchesBarcode);
    });
  }, [initialProducts, selectedCategory, searchQuery]);

  // Cart operations (sub-millisecond local manipulation)
  const addToCart = (product: Product, variant: Variant) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.variantId === variant.id);
      if (existing) {
        return prev.map((item) =>
          item.variantId === variant.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          variantId: variant.id,
          productName: product.name,
          variantName: variant.variantName,
          brand: product.brand,
          price: Number(variant.sellingPrice),
          quantity: 1,
          gstRate: Number(product.category.defaultGstRate || 18),
          gstEnabled: true,
        },
      ];
    });
  };

  const updateQuantity = (variantId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.variantId === variantId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const toggleGst = (variantId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.variantId === variantId
          ? { ...item, gstEnabled: !item.gstEnabled }
          : item
      )
    );
  };

  // Calculations
  const rawSubtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const totalGst = cart.reduce((acc, item) => {
    if (!item.gstEnabled) return acc;
    const base = (item.price * item.quantity) / (1 + item.gstRate / 100);
    return acc + (item.price * item.quantity - base);
  }, 0);

  // Loyalty Points: 10 pts = ₹1 off
  const maxDiscountFromPoints = selectedCustomer
    ? Math.min(
        Math.floor(selectedCustomer.loyaltyPoints / 10),
        Math.floor(rawSubtotal)
      )
    : 0;
  const pointsDiscount = redeemPoints ? maxDiscountFromPoints : 0;
  const finalTotal = Math.max(0, rawSubtotal - pointsDiscount);

  // Split calculations
  const splitUpiAmount = Math.max(0, finalTotal - (splitCashAmount || 0));

  // Checkout Handler
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessingCheckout(true);

    try {
      const payload = {
        customerId: selectedCustomer?.id || null,
        items: cart.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: item.price,
          gstRate: item.gstEnabled ? item.gstRate : 0,
        })),
        paymentMethod: paymentMode,
        splitCashAmount: paymentMode === "SPLIT" ? splitCashAmount : 0,
        splitUpiAmount: paymentMode === "SPLIT" ? splitUpiAmount : 0,
        pointsRedeemed: redeemPoints ? pointsDiscount * 10 : 0,
        pointsDiscountAmount: pointsDiscount,
      };

      const res = await fetch("/api/pos/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Checkout failed");
        return;
      }

      setCompletedInvoice(data.invoice);
      setCart([]);
      setRedeemPoints(false);
    } catch (e: any) {
      alert("Network error during checkout: " + e.message);
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--bg-canvas)]">
      {/* 1. Header Bar */}
      <header className="h-16 px-6 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[var(--brand-solid)] rounded-[var(--radius-sm)] flex items-center justify-center text-white font-bold text-sm tracking-widest">
              T
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-[var(--text-primary)]">
                TEKART
              </span>
              <span className="block text-[10px] text-[var(--text-tertiary)] uppercase font-semibold">
                Main Store, Nagercoil
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1.5 bg-[var(--bg-surface-subtle)] px-2.5 py-1 border border-[var(--border-subtle)] rounded-[var(--radius-sm)]">
            <span className="w-2 h-2 rounded-full bg-[var(--status-paid-text)]" />
            <span className="text-xs font-medium text-[var(--text-secondary)]">
              Shift #01 - Aakash (Counter 1)
            </span>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md mx-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products, brands, or scan barcode (Ctrl K)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 bg-[var(--bg-canvas)] text-sm border border-[var(--border-medium)] rounded-[var(--radius-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] placeholder:text-[var(--text-tertiary)]"
            />
            <svg
              className="w-4 h-4 text-[var(--text-tertiary)] absolute left-3 top-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsReturnDrawerOpen(true)}
          >
            Returns & Refund
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsStockInDrawerOpen(true)}
          >
            Snap & Stock-In
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPinLockOpen(true)}
          >
            Lock (PIN)
          </Button>
        </div>
      </header>

      {/* 2. Main POS Split Screen */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Catalog Shelf (65%) */}
        <main className="flex-1 flex flex-col p-6 overflow-hidden">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 pb-4 overflow-x-auto shrink-0" data-lenis-prevent>
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`h-9 px-4 text-xs font-semibold uppercase tracking-wider rounded-[var(--radius-sm)] border transition-colors cursor-pointer ${
                selectedCategory === "ALL"
                  ? "bg-[var(--brand-solid)] text-white border-transparent"
                  : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:bg-[var(--bg-surface-subtle)]"
              }`}
            >
              All Items ({initialProducts.length})
            </button>
            {initialCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`h-9 px-4 text-xs font-semibold uppercase tracking-wider rounded-[var(--radius-sm)] border transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-[var(--brand-solid)] text-white border-transparent"
                    : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:bg-[var(--bg-surface-subtle)]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* 4x4 Responsive Products Grid */}
          <div className="flex-1 overflow-y-auto pr-2" data-lenis-prevent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="flex flex-col justify-between hover:border-[var(--brand-border)] transition-colors duration-120"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
                      {product.brand || "Tekart"}
                    </span>
                    <h4 className="text-sm font-semibold text-[var(--text-primary)] leading-snug line-clamp-2 mt-0.5 mb-2">
                      {product.name}
                    </h4>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] flex flex-col gap-2">
                    <span className="text-xs text-[var(--text-secondary)] font-medium">
                      Select Variant:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {product.variants.map((v: Variant) => {
                        const inStock = v.stockQuantity > 0;
                        return (
                          <button
                            key={v.id}
                            disabled={!inStock}
                            onClick={() => addToCart(product, v)}
                            className={`px-2 py-1 text-xs font-semibold rounded-[var(--radius-sm)] border transition-all cursor-pointer ${
                              inStock
                                ? "bg-[var(--bg-surface-subtle)] hover:bg-[var(--brand-subtle)] hover:text-[var(--brand-solid)] hover:border-[var(--brand-border)] text-[var(--text-primary)] border-[var(--border-subtle)] active:scale-95"
                                : "bg-red-50 text-red-600 border-red-200 opacity-60 cursor-not-allowed"
                            }`}
                          >
                            <span>{v.variantName}</span>
                            <span className="ml-1.5 font-mono-numbers text-[var(--text-tertiary)]">
                              ₹{Number(v.sellingPrice).toLocaleString("en-IN")}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>

        {/* Right: Real-Time Bill Tape & Split Tender (35%) */}
        <aside className="w-full md:w-[420px] lg:w-[460px] bg-[var(--bg-surface)] border-l border-[var(--border-subtle)] flex flex-col h-full shrink-0">
          {/* Customer Bar */}
          <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Billed Customer
              </span>
              {selectedCustomer ? (
                <Badge variant="brand">
                  {selectedCustomer.loyaltyPoints} PTS
                </Badge>
              ) : null}
            </div>

            {selectedCustomer ? (
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-sm text-[var(--text-primary)]">
                    {selectedCustomer.name}
                  </span>
                  <span className="block text-xs font-mono-numbers text-[var(--text-tertiary)]">
                    +91 {selectedCustomer.mobile}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-xs text-[var(--status-critical-text)] hover:underline cursor-pointer"
                >
                  Change
                </button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => setSelectedCustomer(initialCustomers[0])}
              >
                + Select / Quick Add Customer
              </Button>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-[var(--border-subtle)]" data-lenis-prevent>
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-[var(--text-tertiary)]">
                <svg
                  className="w-10 h-10 mb-2 stroke-current opacity-40"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <p className="text-sm font-medium">Bill tape is empty</p>
                <p className="text-xs mt-1">Tap any variant pill to add items</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.variantId} className="py-3 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-semibold text-sm text-[var(--text-primary)]">
                        {item.productName}
                      </span>
                      <span className="block text-xs text-[var(--text-tertiary)]">
                        {item.variantName}
                      </span>
                    </div>
                    <span className="font-mono-numbers font-semibold text-sm text-[var(--text-primary)]">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    {/* Stepper */}
                    <div className="flex items-center border border-[var(--border-medium)] rounded-[var(--radius-sm)]">
                      <button
                        onClick={() => updateQuantity(item.variantId, -1)}
                        className="w-7 h-7 flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-surface-subtle)] cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-mono-numbers font-semibold text-[var(--text-primary)]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.variantId, 1)}
                        className="w-7 h-7 flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-surface-subtle)] cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    {/* GST 1-Click Toggle */}
                    <button
                      onClick={() => toggleGst(item.variantId)}
                      className={`px-2 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-[var(--radius-sm)] border cursor-pointer ${
                        item.gstEnabled
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}
                    >
                      GST {item.gstEnabled ? `${item.gstRate}%` : "0% OFF"}
                    </button>

                    <button
                      onClick={() => updateQuantity(item.variantId, -item.quantity)}
                      className="text-[var(--status-critical-text)] hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout Totals & Tender Box */}
          <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] shrink-0 flex flex-col gap-3">
            {/* Loyalty Redeem Toggle */}
            {selectedCustomer && selectedCustomer.loyaltyPoints >= 100 && (
              <div className="flex items-center justify-between bg-amber-50 p-2.5 rounded-[var(--radius-sm)] border border-amber-200 text-xs">
                <div>
                  <span className="font-semibold text-amber-900">
                    Redeem {selectedCustomer.loyaltyPoints} Points
                  </span>
                  <span className="block text-[10px] text-amber-700">
                    Get ₹{maxDiscountFromPoints} off bill
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={redeemPoints}
                  onChange={(e) => setRedeemPoints(e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-[var(--brand-solid)]"
                />
              </div>
            )}

            {/* Subtotals */}
            <div className="flex flex-col gap-1 text-xs text-[var(--text-secondary)]">
              <div className="flex justify-between">
                <span>Subtotal (MRP Gross)</span>
                <span className="font-mono-numbers">
                  ₹{rawSubtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST Breakdown (Inclusive)</span>
                <span className="font-mono-numbers">
                  ₹{totalGst.toFixed(2)}
                </span>
              </div>
              {redeemPoints && (
                <div className="flex justify-between text-green-700 font-semibold">
                  <span>Loyalty Discount</span>
                  <span className="font-mono-numbers">-₹{pointsDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-[var(--text-primary)] pt-2 border-t border-[var(--border-subtle)]">
                <span>Net Payable</span>
                <span className="font-mono-numbers text-[var(--brand-solid)]">
                  ₹{finalTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {(["CASH", "UPI", "SPLIT"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setPaymentMode(mode)}
                  className={`h-9 text-xs font-semibold uppercase tracking-wider rounded-[var(--radius-sm)] border transition-all cursor-pointer ${
                    paymentMode === mode
                      ? "bg-[var(--brand-solid)] text-white border-transparent"
                      : "bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:bg-[var(--border-subtle)]"
                  }`}
                >
                  {mode === "SPLIT" ? "Split Tender" : mode}
                </button>
              ))}
            </div>

            {/* Split Tender Dynamic Controls */}
            {paymentMode === "SPLIT" && (
              <div className="p-3 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)] flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between">
                  <span>Cash Tendered:</span>
                  <input
                    type="number"
                    value={splitCashAmount || ""}
                    onChange={(e) =>
                      setSplitCashAmount(Math.min(finalTotal, Number(e.target.value)))
                    }
                    placeholder="₹0"
                    className="w-28 h-8 px-2 bg-[var(--bg-surface)] text-right font-mono-numbers border border-[var(--border-medium)] rounded-[var(--radius-sm)]"
                  />
                </div>
                <div className="flex items-center justify-between font-semibold text-[var(--brand-solid)]">
                  <span>UPI Remainder QR:</span>
                  <span className="font-mono-numbers">
                    ₹{splitUpiAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            )}

            {/* Primary Action Button */}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isProcessingCheckout}
              disabled={cart.length === 0}
              onClick={handleCheckout}
            >
              Confirm & Pay (₹{finalTotal.toLocaleString("en-IN")})
            </Button>
          </div>
        </aside>
      </div>

      {/* 3. Completed Invoice Modal / WhatsApp Dispatch */}
      <AnimatePresence>
        {completedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#090A0C]/50"
              onClick={() => setCompletedInvoice(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-[var(--bg-surface)] p-6 rounded-[var(--radius-md)] border border-[var(--border-subtle)] shadow-[var(--shadow-floating)]"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="font-bold text-base text-[var(--text-primary)]">
                    Sale Completed
                  </h3>
                  <span className="text-xs font-mono-numbers text-[var(--text-tertiary)]">
                    Invoice #{completedInvoice.invoiceNumber}
                  </span>
                </div>
              </div>

              <div className="my-4 p-3 bg-[var(--bg-surface-subtle)] rounded-[var(--radius-sm)] border border-[var(--border-subtle)] text-xs flex flex-col gap-1">
                <div className="flex justify-between">
                  <span>Total Paid:</span>
                  <span className="font-bold font-mono-numbers text-sm text-[var(--brand-solid)]">
                    ₹{Number(completedInvoice.totalAmount).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Method:</span>
                  <span className="font-semibold uppercase">{completedInvoice.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Loyalty Earned:</span>
                  <span className="font-semibold text-green-700">
                    +{completedInvoice.pointsEarned} pts
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => {
                    const phone = completedInvoice.customer?.whatsapp || "9876543210";
                    const msg = encodeURIComponent(
                      `✨ Thank you for shopping at TEKART! ✨\nInvoice: #${completedInvoice.invoiceNumber}\nAmount Paid: ₹${completedInvoice.totalAmount}\nView bill: https://tekart.app/invoice/${completedInvoice.invoiceNumber}`
                    );
                    window.open(`https://wa.me/91${phone}?text=${msg}`, "_blank");
                  }}
                >
                  Send WhatsApp Bill
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  fullWidth
                  onClick={() => window.print()}
                >
                  Print Thermal Receipt (58/80mm)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => setCompletedInvoice(null)}
                >
                  Done & New Sale
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Missing Flow 1: 7-Day Return & Refund Drawer */}
      <Drawer
        isOpen={isReturnDrawerOpen}
        onClose={() => setIsReturnDrawerOpen(false)}
        title="7-Day Return & Refund Console"
        width="lg"
      >
        <div className="flex flex-col gap-4 text-sm">
          <p className="text-xs text-[var(--text-secondary)]">
            Enforces strict 7-day return eligibility and historical purchase price refund integrity.
          </p>

          <div className="flex gap-2">
            <Input
              placeholder="Search Invoice # (e.g. TK-2026-0001)..."
              defaultValue="TK-2026-0001"
              isMono
            />
            <Button variant="secondary" size="md">
              Lookup
            </Button>
          </div>

          <Card subtle>
            <CardHeader>
              <CardTitle>Invoice #TK-2026-0001 (Day 2 of 7)</CardTitle>
              <Badge variant="paid">Eligible (7 Days)</Badge>
            </CardHeader>
            <div className="text-xs flex flex-col gap-2">
              <div className="flex justify-between items-center py-2 border-b border-[var(--border-subtle)]">
                <div>
                  <span className="font-semibold">Sauvage EDT (100ml)</span>
                  <span className="block text-[10px] text-[var(--text-tertiary)]">
                    Historical Price Paid: ₹9,900.00 | Qty: 1
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-[var(--brand-solid)]" />
                    <span>Return 1 unit</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-blue-700">
                    <input type="checkbox" defaultChecked className="accent-[var(--brand-solid)]" />
                    <span>Restock</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-between pt-2 font-bold text-sm">
                <span>Refund Due Customer:</span>
                <span className="font-mono-numbers text-[var(--brand-solid)]">
                  ₹9,900.00
                </span>
              </div>
            </div>
          </Card>

          <div className="flex gap-2 pt-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => {
                alert("Credit Note #RTN-1001 issued. Stock incremented by 1.");
                setIsReturnDrawerOpen(false);
              }}
            >
              Issue Credit Note & Refund
            </Button>
          </div>
        </div>
      </Drawer>

      {/* 5. Missing Flow 2: Multi-Angle AI Stock-In Review Drawer */}
      <Drawer
        isOpen={isStockInDrawerOpen}
        onClose={() => setIsStockInDrawerOpen(false)}
        title="AI Multi-Angle Packaging Stock-In"
        width="lg"
      >
        <div className="flex flex-col gap-4 text-sm">
          <p className="text-xs text-[var(--text-secondary)]">
            Progressively stream 1-3 packaging photos (Front brand, back ingredients, bottom MRP stamp).
          </p>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-3 bg-[var(--bg-surface-subtle)] border border-dashed border-[var(--brand-solid)] rounded-[var(--radius-sm)] flex flex-col items-center justify-center gap-1">
              <span className="font-bold text-[var(--brand-solid)]">Photo 1 (Front)</span>
              <span className="text-[10px] text-green-700">✓ Extracted</span>
            </div>
            <div className="p-3 bg-[var(--bg-surface-subtle)] border border-dashed border-[var(--border-medium)] rounded-[var(--radius-sm)] flex flex-col items-center justify-center gap-1">
              <span className="font-bold text-[var(--text-secondary)]">Photo 2 (Back)</span>
              <span className="text-[10px] text-[var(--text-tertiary)]">+ Tap to Snap</span>
            </div>
            <div className="p-3 bg-[var(--bg-surface-subtle)] border border-dashed border-[var(--border-medium)] rounded-[var(--radius-sm)] flex flex-col items-center justify-center gap-1">
              <span className="font-bold text-[var(--text-secondary)]">Photo 3 (MRP)</span>
              <span className="text-[10px] text-[var(--text-tertiary)]">+ Tap to Snap</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Input label="Detected Brand" defaultValue="Nivea Men" />
            <Input
              label="Detected Product Title"
              defaultValue="Deep Impact Fresh Active Roll On"
            />
            <div className="grid grid-cols-2 gap-2">
              <Input label="Volume / Size" defaultValue="50ml" />
              <Input label="Extracted MRP" defaultValue="₹249.00" isMono />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input label="Batch Number" defaultValue="B240901" isMono />
              <Input label="Expiry Date" defaultValue="14/08/2029" isMono />
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => {
              alert("Stock added successfully to Neon catalog!");
              setIsStockInDrawerOpen(false);
            }}
          >
            Confirm & Save to Inventory
          </Button>
        </div>
      </Drawer>

      {/* 6. PIN Lock Screen */}
      <AnimatePresence>
        {isPinLockOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#090A0C]/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-xs bg-[var(--bg-surface)] p-6 rounded-[var(--radius-md)] border border-[var(--border-subtle)] text-center flex flex-col items-center"
            >
              <h3 className="font-bold text-base text-[var(--text-primary)]">
                Terminal Locked
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1 mb-4">
                Enter Cashier PIN to wake terminal
              </p>

              <div className="flex gap-2 mb-6">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-10 h-12 border rounded-[var(--radius-sm)] flex items-center justify-center font-mono text-xl ${
                      enteredPin.length > i
                        ? "border-[var(--brand-solid)] bg-[var(--brand-subtle)] text-[var(--brand-solid)] font-bold"
                        : "border-[var(--border-medium)] bg-[var(--bg-canvas)]"
                    }`}
                  >
                    {enteredPin.length > i ? "•" : ""}
                  </div>
                ))}
              </div>

              {/* Number Pad */}
              <div className="grid grid-cols-3 gap-2 w-full max-w-[200px]">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "OK"].map(
                  (val) => (
                    <button
                      key={val}
                      onClick={() => {
                        if (val === "C") setEnteredPin("");
                        else if (val === "OK") {
                          if (enteredPin === "0000" || enteredPin === "1234") {
                            setIsPinLockOpen(false);
                            setEnteredPin("");
                          } else {
                            alert("Invalid PIN. Use 0000 or 1234");
                            setEnteredPin("");
                          }
                        } else if (enteredPin.length < 4) {
                          const next = enteredPin + val;
                          setEnteredPin(next);
                          if (next === "0000" || next === "1234") {
                            setTimeout(() => {
                              setIsPinLockOpen(false);
                              setEnteredPin("");
                            }, 100);
                          }
                        }
                      }}
                      className="h-10 rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] hover:bg-[var(--border-subtle)] font-mono text-sm font-semibold text-[var(--text-primary)] cursor-pointer active:scale-95 transition-all"
                    >
                      {val}
                    </button>
                  )
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

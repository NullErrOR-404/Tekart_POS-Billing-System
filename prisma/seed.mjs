import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Tekart POS database...");

  // 1. Seed Users (with 4-digit quick wake PINs)
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      name: "Store Owner",
      username: "admin",
      passwordHash: "owner_secure_hash_2026",
      pinHash: "1234",
      role: "owner",
    },
  });

  const cashier = await prisma.user.upsert({
    where: { username: "cashier" },
    update: {},
    create: {
      name: "Aakash (Counter 1)",
      username: "cashier",
      passwordHash: "cashier_secure_hash_2026",
      pinHash: "0000",
      role: "cashier",
    },
  });

  console.log("Users created:", admin.username, cashier.username);

  // 2. Seed Categories
  const catPerfumes = await prisma.category.upsert({
    where: { name: "Perfumes & Deodorants" },
    update: {},
    create: {
      name: "Perfumes & Deodorants",
      defaultGstRate: 18.0,
    },
  });

  const catCosmetics = await prisma.category.upsert({
    where: { name: "Cosmetics & Skincare" },
    update: {},
    create: {
      name: "Cosmetics & Skincare",
      defaultGstRate: 18.0,
    },
  });

  const catElectronics = await prisma.category.upsert({
    where: { name: "Electronics & Audio" },
    update: {},
    create: {
      name: "Electronics & Audio",
      defaultGstRate: 18.0,
    },
  });

  const catAccessories = await prisma.category.upsert({
    where: { name: "Fashion Accessories" },
    update: {},
    create: {
      name: "Fashion Accessories",
      defaultGstRate: 12.0,
    },
  });

  console.log("Categories seeded.");

  // 3. Seed Products and Variants
  // Product 1: Dior Sauvage
  const p1 = await prisma.product.create({
    data: {
      categoryId: catPerfumes.id,
      name: "Sauvage Eau De Toilette",
      brand: "Dior",
      description: "Radically fresh masculine fragrance with raw bergamot and spicy ambroxan.",
      hasVariants: true,
      variants: {
        create: [
          {
            variantName: "60ml",
            attributeType: "volume",
            costPrice: 5200.0,
            sellingPrice: 6800.0,
            stockQuantity: 14,
            lowStockThreshold: 4,
            barcode: "3348901250146",
          },
          {
            variantName: "100ml",
            attributeType: "volume",
            costPrice: 7600.0,
            sellingPrice: 9900.0,
            stockQuantity: 9,
            lowStockThreshold: 3,
            barcode: "3348901250153",
          },
        ],
      },
    },
  });

  // Product 2: Nivea Roll On
  const p2 = await prisma.product.create({
    data: {
      categoryId: catPerfumes.id,
      name: "Deep Impact Fresh Active Roll On",
      brand: "Nivea Men",
      description: "Long lasting 48h antiperspirant deodorant roll-on.",
      hasVariants: true,
      variants: {
        create: [
          {
            variantName: "50ml",
            attributeType: "volume",
            costPrice: 175.0,
            sellingPrice: 249.0,
            stockQuantity: 36,
            lowStockThreshold: 8,
            barcode: "4005900543210",
          },
        ],
      },
    },
  });

  // Product 3: Matte Liquid Lipstick
  const p3 = await prisma.product.create({
    data: {
      categoryId: catCosmetics.id,
      name: "Matte Velvet Liquid Lipstick",
      brand: "Huda Beauty",
      description: "Non-drying, transfer-proof matte liquid lipstick.",
      hasVariants: true,
      variants: {
        create: [
          {
            variantName: "Shade 01 Red",
            attributeType: "color",
            costPrice: 950.0,
            sellingPrice: 1499.0,
            stockQuantity: 18,
            lowStockThreshold: 5,
            barcode: "6291106030018",
          },
          {
            variantName: "Shade 04 Rose Nude",
            attributeType: "color",
            costPrice: 950.0,
            sellingPrice: 1499.0,
            stockQuantity: 22,
            lowStockThreshold: 5,
            barcode: "6291106030049",
          },
        ],
      },
    },
  });

  // Product 4: Apple 20W Power Adapter
  const p4 = await prisma.product.create({
    data: {
      categoryId: catElectronics.id,
      name: "20W USB-C Power Adapter",
      brand: "Apple",
      description: "Fast, efficient charging adapter for iPhone & iPad.",
      hasVariants: false,
      variants: {
        create: [
          {
            variantName: "Standard White",
            attributeType: "standard",
            costPrice: 1400.0,
            sellingPrice: 1900.0,
            stockQuantity: 28,
            lowStockThreshold: 6,
            barcode: "194252157008",
          },
        ],
      },
    },
  });

  // Product 5: Fast Charge Braided Cable
  const p5 = await prisma.product.create({
    data: {
      categoryId: catElectronics.id,
      name: "Braided Type-C to Type-C 60W Cable",
      brand: "Tekart Essentials",
      description: "Durable nylon braided high-speed sync and charge cable.",
      hasVariants: true,
      variants: {
        create: [
          {
            variantName: "1.2m Black",
            attributeType: "size",
            costPrice: 180.0,
            sellingPrice: 449.0,
            stockQuantity: 45,
            lowStockThreshold: 10,
            barcode: "8901234567890",
          },
          {
            variantName: "2.0m Black",
            attributeType: "size",
            costPrice: 220.0,
            sellingPrice: 599.0,
            stockQuantity: 20,
            lowStockThreshold: 5,
            barcode: "8901234567891",
          },
        ],
      },
    },
  });

  // Product 6: Minimalist Watch
  const p6 = await prisma.product.create({
    data: {
      categoryId: catAccessories.id,
      name: "Contemporary Minimalist Watch",
      brand: "Titan",
      description: "Ultra-slim stainless steel quartz watch.",
      hasVariants: true,
      variants: {
        create: [
          {
            variantName: "Black Leather",
            attributeType: "standard",
            costPrice: 2400.0,
            sellingPrice: 3495.0,
            stockQuantity: 8,
            lowStockThreshold: 2,
            barcode: "8905140102030",
          },
        ],
      },
    },
  });

  console.log("Products and variants created.");

  // 4. Seed Test Customer with Loyalty Points
  const customer = await prisma.customer.upsert({
    where: { mobile: "9876543210" },
    update: {},
    create: {
      name: "Ayesha Siddiqua",
      mobile: "9876543210",
      whatsapp: "9876543210",
      loyaltyPoints: 340, // Worth ₹34 discount (10 pts = ₹1)
      totalSpend: 3400.0,
      visitCount: 3,
      lastVisitAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
  });

  console.log("Customer seeded:", customer.name, "Points:", customer.loyaltyPoints);
  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

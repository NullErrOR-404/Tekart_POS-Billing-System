import { prisma } from "@/lib/prisma";
import { UnifiedAppShell } from "@/components/dashboard/DashboardView";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, categories, customers] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
        variants: {
          orderBy: { sellingPrice: "asc" },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.customer.findMany({
      orderBy: { visitCount: "desc" },
      take: 10,
    }),
  ]);

  // Serialize Decimals for Client Component
  const serializedProducts = products.map((p) => ({
    ...p,
    category: {
      ...p.category,
      defaultGstRate: Number(p.category.defaultGstRate),
    },
    variants: p.variants.map((v) => ({
      ...v,
      costPrice: Number(v.costPrice),
      sellingPrice: Number(v.sellingPrice),
    })),
  }));

  const serializedCategories = categories.map((c) => ({
    ...c,
    defaultGstRate: Number(c.defaultGstRate),
  }));

  const serializedCustomers = customers.map((c) => ({
    ...c,
    totalSpend: Number(c.totalSpend),
  }));

  return (
    <UnifiedAppShell
      initialProducts={serializedProducts}
      initialCategories={serializedCategories}
      initialCustomers={serializedCustomers}
    />
  );
}

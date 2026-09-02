import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-utils";

export async function GET() {
  try {
    await requireAdmin();

    const [
      orders,
      customers,
      products,
      activeOffers,
      recentOrders,
      lowStockProducts,
      lowStockCount,
    ] = await Promise.all([
      prisma.order.aggregate({ _count: true, _sum: { total: true } }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.product.count(),
      prisma.liveOffer.count({
        where: {
          enabled: true,
          startAt: { lte: new Date() },
          endAt: { gt: new Date() },
        },
      }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } } },
      }),
      prisma.product.findMany({
        where: { stock: { lte: 5 } },
        take: 10,
        orderBy: { stock: "asc" },
        select: { id: true, name: true, sku: true, stock: true, lowStockThreshold: true },
      }),
      prisma.product.count({ where: { stock: { lte: 5 } } }),
    ]);

    return NextResponse.json({
      stats: {
        totalSales: orders._sum.total ?? 0,
        orders: orders._count,
        customers,
        products,
        lowStock: lowStockCount,
        activeOffers,
      },
      recentOrders,
      lowStockProducts,
      charts: await getChartData(),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

async function getChartData() {
  const now = new Date();
  const days = 7;
  const salesByDay: { label: string; value: number }[] = [];
  const ordersByDay: { label: string; value: number }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const dayStart = new Date(now);
    dayStart.setDate(dayStart.getDate() - i);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);

    const label = dayStart.toLocaleDateString("en-GB", { weekday: "short" });

    const dayOrders = await prisma.order.findMany({
      where: { createdAt: { gte: dayStart, lte: dayEnd } },
      select: { total: true },
    });

    salesByDay.push({
      label,
      value: dayOrders.reduce((s, o) => s + o.total, 0),
    });
    ordersByDay.push({ label, value: dayOrders.length });
  }

  const topProducts = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
  });

  const productIds = topProducts.map((p) => p.productId);
  const productNames = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true },
  });
  const nameMap = new Map(productNames.map((p) => [p.id, p.name]));

  const topProductsChart = topProducts.map((p) => ({
    label: nameMap.get(p.productId) ?? "Unknown",
    value: p._sum.quantity ?? 0,
  }));

  const recentCustomers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, name: true, email: true, createdAt: true },
  });

  const activeOffersList = await prisma.liveOffer.findMany({
    where: {
      enabled: true,
      startAt: { lte: now },
      endAt: { gt: now },
    },
    include: { product: { select: { name: true } } },
    orderBy: { priority: "desc" },
    take: 5,
  });

  return {
    salesByDay,
    ordersByDay,
    topProducts: topProductsChart,
    recentCustomers,
    activeOffers: activeOffersList,
  };
}

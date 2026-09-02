import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = request.nextUrl;
    const filter = searchParams.get("filter");

    const products = await prisma.product.findMany({
      where: {
        ...(filter === "low" && { stock: { lte: 5 } }),
        ...(filter === "out" && { stock: { lte: 0 } }),
      },
      select: {
        id: true,
        name: true,
        sku: true,
        stock: true,
        lowStockThreshold: true,
        status: true,
        thumbnail: true,
        category: { select: { name: true } },
      },
      orderBy: { stock: "asc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id: body.id },
      data: {
        stock: parseInt(body.stock, 10),
        lowStockThreshold: body.lowStockThreshold !== undefined
          ? parseInt(body.lowStockThreshold, 10)
          : undefined,
        status: body.status,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();

    if (!body.updates || !Array.isArray(body.updates)) {
      return NextResponse.json({ error: "Updates array required" }, { status: 400 });
    }

    const results = await Promise.all(
      body.updates.map((update: { id: string; stock: number }) =>
        prisma.product.update({
          where: { id: update.id },
          data: { stock: update.stock },
        })
      )
    );

    return NextResponse.json(results);
  } catch (error) {
    return handleApiError(error);
  }
}

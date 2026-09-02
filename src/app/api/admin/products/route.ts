import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-utils";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = request.nextUrl;
    const search = searchParams.get("search") ?? "";
    const status = searchParams.get("status");
    const categoryId = searchParams.get("categoryId");

    const products = await prisma.product.findMany({
      where: {
        ...(search && {
          OR: [
            { name: { contains: search } },
            { sku: { contains: search } },
            { slug: { contains: search } },
          ],
        }),
        ...(status && { status: status as "DRAFT" | "ACTIVE" | "OUT_OF_STOCK" | "ARCHIVED" }),
        ...(categoryId && { categoryId }),
      },
      include: {
        category: { select: { id: true, name: true } },
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        _count: { select: { liveOffers: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();

    const slug = body.slug || slugify(body.name);
    const sku = body.sku || `SKU-${Date.now()}`;

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug,
        sku,
        brand: body.brand,
        categoryId: body.categoryId || null,
        description: body.description,
        shortDescription: body.shortDescription,
        price: parseFloat(body.price),
        compareAtPrice: body.compareAtPrice ? parseFloat(body.compareAtPrice) : null,
        salePrice: body.salePrice ? parseFloat(body.salePrice) : null,
        thumbnail: body.thumbnail,
        stock: parseInt(body.stock ?? "0", 10),
        lowStockThreshold: parseInt(body.lowStockThreshold ?? "5", 10),
        status: body.status ?? "DRAFT",
        isLimited: body.isLimited ?? false,
        isRare: body.isRare ?? false,
        isFeatured: body.isFeatured ?? false,
        isNew: body.isNew ?? false,
        tags: body.tags ? JSON.stringify(body.tags) : null,
        specifications: body.specifications ? JSON.stringify(body.specifications) : null,
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
        images: body.images?.length
          ? {
              create: body.images.map((img: { url: string; alt?: string }, i: number) => ({
                url: img.url,
                alt: img.alt,
                sortOrder: i,
              })),
            }
          : undefined,
        variants: body.variants?.length
          ? {
              create: body.variants.map((v: { name: string; sku: string; price?: number; stock?: number }) => ({
                name: v.name,
                sku: v.sku,
                price: v.price ?? null,
                stock: v.stock ?? 0,
              })),
            }
          : undefined,
      },
      include: { category: true, images: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

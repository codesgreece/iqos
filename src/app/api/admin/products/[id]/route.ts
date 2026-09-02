import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-utils";
import { slugify } from "@/lib/utils";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
        liveOffers: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const body = await request.json();

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug || slugify(body.name),
        sku: body.sku,
        brand: body.brand,
        categoryId: body.categoryId || null,
        description: body.description,
        shortDescription: body.shortDescription,
        price: body.price !== undefined ? parseFloat(body.price) : undefined,
        compareAtPrice: body.compareAtPrice !== undefined
          ? body.compareAtPrice ? parseFloat(body.compareAtPrice) : null
          : undefined,
        salePrice: body.salePrice !== undefined
          ? body.salePrice ? parseFloat(body.salePrice) : null
          : undefined,
        thumbnail: body.thumbnail,
        stock: body.stock !== undefined ? parseInt(body.stock, 10) : undefined,
        lowStockThreshold: body.lowStockThreshold !== undefined
          ? parseInt(body.lowStockThreshold, 10)
          : undefined,
        status: body.status,
        isLimited: body.isLimited,
        isRare: body.isRare,
        isFeatured: body.isFeatured,
        isNew: body.isNew,
        tags: body.tags !== undefined ? JSON.stringify(body.tags) : undefined,
        specifications: body.specifications !== undefined
          ? JSON.stringify(body.specifications)
          : undefined,
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
      },
      include: { category: true, images: true },
    });

    if (body.images) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      if (body.images.length > 0) {
        await prisma.productImage.createMany({
          data: body.images.map((img: { url: string; alt?: string }, i: number) => ({
            productId: id,
            url: img.url,
            alt: img.alt,
            sortOrder: i,
          })),
        });
      }
    }

    if (body.variants) {
      await prisma.productVariant.deleteMany({ where: { productId: id } });
      if (body.variants.length > 0) {
        await prisma.productVariant.createMany({
          data: body.variants.map((v: { name: string; sku: string; price?: number; stock?: number; options?: string }) => ({
            productId: id,
            name: v.name,
            sku: v.sku,
            price: v.price ?? null,
            stock: v.stock ?? 0,
            options: v.options ?? null,
          })),
        });
      }
    }

    return NextResponse.json(product);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}

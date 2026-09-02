import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuthUserId } from "@/lib/cart-session";
import { handleApiError, jsonError, jsonSuccess } from "@/lib/api-utils";

const toggleSchema = z.object({
  productId: z.string().min(1),
});

const removeSchema = z.object({
  productId: z.string().min(1),
});

async function getOrCreateWishlist(userId: string) {
  const existing = await prisma.wishlist.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              thumbnail: true,
              price: true,
              salePrice: true,
              stock: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (existing) return existing;

  return prisma.wishlist.create({
    data: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              thumbnail: true,
              price: true,
              salePrice: true,
              stock: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function GET() {
  try {
    const userId = await requireAuthUserId();
    const wishlist = await getOrCreateWishlist(userId);

    return jsonSuccess({
      id: wishlist.id,
      items: wishlist.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        createdAt: item.createdAt,
        product: item.product,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuthUserId();
    const { productId } = toggleSchema.parse(await request.json());

    const product = await prisma.product.findFirst({
      where: { id: productId, status: "ACTIVE" },
    });

    if (!product) {
      return jsonError("Product not found", 404);
    }

    const wishlist = await getOrCreateWishlist(userId);
    const existing = wishlist.items.find((item) => item.productId === productId);

    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      return jsonSuccess({ action: "removed", productId });
    }

    await prisma.wishlistItem.create({
      data: { wishlistId: wishlist.id, productId },
    });

    return jsonSuccess({ action: "added", productId }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await requireAuthUserId();
    const { productId } = removeSchema.parse(await request.json());

    const wishlist = await prisma.wishlist.findUnique({ where: { userId } });
    if (!wishlist) {
      return jsonSuccess({ action: "removed", productId });
    }

    await prisma.wishlistItem.deleteMany({
      where: { wishlistId: wishlist.id, productId },
    });

    return jsonSuccess({ action: "removed", productId });
  } catch (error) {
    return handleApiError(error);
  }
}

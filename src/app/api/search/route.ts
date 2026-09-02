import { NextRequest } from "next/server";
import { z } from "zod";
import { searchProductSuggestions } from "@/lib/services/products";
import { prisma } from "@/lib/prisma";
import { handleApiError, jsonSuccess } from "@/lib/api-utils";

const querySchema = z.object({
  q: z.string().min(1).max(100),
  limit: z.coerce.number().int().min(1).max(20).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const { q, limit } = querySchema.parse(params);

    const [products, categories, brands] = await Promise.all([
      searchProductSuggestions(q, limit ?? 8),
      prisma.category.findMany({
        where: {
          isActive: true,
          OR: [{ name: { contains: q } }, { slug: { contains: q } }],
        },
        select: { id: true, name: true, slug: true },
        take: 5,
      }),
      prisma.product.findMany({
        where: {
          status: "ACTIVE",
          brand: { contains: q },
        },
        select: { brand: true },
        distinct: ["brand"],
        take: 5,
      }),
    ]);

    return jsonSuccess({
      query: q,
      products,
      categories,
      brands: brands.map((b) => b.brand).filter(Boolean),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

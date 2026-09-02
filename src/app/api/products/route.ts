import { NextRequest } from "next/server";
import { z } from "zod";
import { getProducts, PRODUCT_SORT_OPTIONS } from "@/lib/services/products";
import { handleApiError, jsonSuccess } from "@/lib/api-utils";

const querySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  sort: z.enum(PRODUCT_SORT_OPTIONS).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  brand: z.string().optional(),
  isLimited: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
  isRare: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
  onSale: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
  availability: z.enum(["in_stock", "out_of_stock"]).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const filters = querySchema.parse(params);
    const result = await getProducts(filters);
    return jsonSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}

import { NextRequest } from "next/server";
import { getProductBySlug } from "@/lib/services/products";
import { handleApiError, jsonError, jsonSuccess } from "@/lib/api-utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
      return jsonError("Product not found", 404);
    }

    return jsonSuccess(product);
  } catch (error) {
    return handleApiError(error);
  }
}

import { prisma } from "@/lib/prisma";
import { handleApiError, jsonSuccess } from "@/lib/api-utils";

export async function GET() {
  try {
    const now = new Date();
    const offers = await prisma.liveOffer.findMany({
      where: {
        enabled: true,
        startAt: { lte: now },
        endAt: { gt: now },
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            thumbnail: true,
            brand: true,
            status: true,
            images: { orderBy: { sortOrder: "asc" }, take: 1, select: { url: true } },
          },
        },
      },
      orderBy: [{ priority: "desc" }, { endAt: "asc" }],
    });

    const activeOffers = offers.filter((offer) => offer.product.status === "ACTIVE");

    return jsonSuccess(activeOffers);
  } catch (error) {
    return handleApiError(error);
  }
}

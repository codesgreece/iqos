import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-utils";
import { calculateOfferDiscount, getLiveOfferStatus } from "@/lib/live-offers";

export async function GET() {
  try {
    await requireAdmin();

    const offers = await prisma.liveOffer.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            thumbnail: true,
            brand: true,
            price: true,
          },
        },
      },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    });

    const enriched = offers.map((offer) => ({
      ...offer,
      status: getLiveOfferStatus(offer),
    }));

    return NextResponse.json(enriched);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();

    const normalPrice = parseFloat(body.normalPrice);
    const salePrice = parseFloat(body.salePrice);
    const discount = calculateOfferDiscount(normalPrice, salePrice);

    const offer = await prisma.liveOffer.create({
      data: {
        productId: body.productId,
        normalPrice,
        salePrice,
        discount,
        startAt: new Date(body.startAt),
        endAt: new Date(body.endAt),
        badge: body.badge,
        priority: body.priority ?? 0,
        enabled: body.enabled ?? true,
        customTitle: body.customTitle,
        customDescription: body.customDescription,
      },
      include: { product: { select: { id: true, name: true, slug: true } } },
    });

    return NextResponse.json({ ...offer, status: getLiveOfferStatus(offer) }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Offer ID required" }, { status: 400 });
    }

    const normalPrice = parseFloat(body.normalPrice);
    const salePrice = parseFloat(body.salePrice);
    const discount = calculateOfferDiscount(normalPrice, salePrice);

    const offer = await prisma.liveOffer.update({
      where: { id: body.id },
      data: {
        productId: body.productId,
        normalPrice,
        salePrice,
        discount,
        startAt: new Date(body.startAt),
        endAt: new Date(body.endAt),
        badge: body.badge,
        priority: body.priority,
        enabled: body.enabled,
        customTitle: body.customTitle,
        customDescription: body.customDescription,
      },
      include: { product: { select: { id: true, name: true, slug: true } } },
    });

    return NextResponse.json({ ...offer, status: getLiveOfferStatus(offer) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Offer ID required" }, { status: 400 });
    }

    await prisma.liveOffer.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}

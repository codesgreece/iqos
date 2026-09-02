export type LiveOfferStatus = "DISABLED" | "SCHEDULED" | "ACTIVE" | "EXPIRED";

export interface LiveOfferWithProduct {
  id: string;
  productId: string;
  normalPrice: number;
  salePrice: number;
  discount: number;
  startAt: Date;
  endAt: Date;
  badge: string | null;
  priority: number;
  enabled: boolean;
  customTitle: string | null;
  customDescription: string | null;
  product: {
    id: string;
    name: string;
    slug: string;
    thumbnail: string | null;
    brand: string | null;
    images?: { url: string }[];
  };
}

export function getLiveOfferStatus(
  offer: { enabled: boolean; startAt: Date; endAt: Date },
  now: Date = new Date()
): LiveOfferStatus {
  if (!offer.enabled) return "DISABLED";
  const start = new Date(offer.startAt);
  const end = new Date(offer.endAt);
  if (now < start) return "SCHEDULED";
  if (now >= end) return "EXPIRED";
  return "ACTIVE";
}

export function isOfferActive(
  offer: { enabled: boolean; startAt: Date; endAt: Date },
  now: Date = new Date()
): boolean {
  return getLiveOfferStatus(offer, now) === "ACTIVE";
}

export function filterActiveOffers<T extends { enabled: boolean; startAt: Date; endAt: Date }>(
  offers: T[],
  now: Date = new Date()
): T[] {
  return offers.filter((offer) => isOfferActive(offer, now));
}

export function calculateOfferDiscount(normalPrice: number, salePrice: number): number {
  if (normalPrice <= 0) return 0;
  return Math.round(((normalPrice - salePrice) / normalPrice) * 100);
}

export function getRemainingTime(endAt: Date, now: Date = new Date()) {
  const diff = Math.max(0, new Date(endAt).getTime() - now.getTime());
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { hours, minutes, seconds, total: diff };
}

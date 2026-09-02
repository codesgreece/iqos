import type { EnrichedProduct } from "@/lib/services/products";

interface ProductJsonLdProps {
  product: EnrichedProduct;
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const image = product.thumbnail ?? product.images[0]?.url;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription ?? product.description,
    sku: product.sku,
    brand: product.brand
      ? { "@type": "Brand", name: product.brand }
      : undefined,
    image: image ? [image] : undefined,
    url: `${baseUrl}/product/${product.slug}`,
    offers: {
      "@type": "Offer",
      price: product.effectivePrice,
      priceCurrency: "EUR",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${baseUrl}/product/${product.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

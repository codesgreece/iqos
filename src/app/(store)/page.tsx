import { Hero } from "@/components/home/Hero";
import { LiveOffersSection } from "@/components/home/LiveOffersSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { LimitedEditions } from "@/components/home/LimitedEditions";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { NewArrivals } from "@/components/home/NewArrivals";
import { PromoBanner } from "@/components/home/PromoBanner";
import { WhySection } from "@/components/home/WhySection";
import { Newsletter } from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LiveOffersSection />
      <FeaturedProducts />
      <LimitedEditions />
      <CategoriesSection />
      <NewArrivals />
      <PromoBanner />
      <WhySection />
      <Newsletter />
    </>
  );
}

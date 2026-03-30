import { useTranslation } from "../hooks/useTranslation";
import { usePageMeta } from "../hooks/usePageMeta";
import { Hero } from "../components/Hero";
import { TrustStrip } from "../components/TrustStrip";
import { ProductGrid } from "../components/ProductGrid";
import { Testimonials } from "../components/Testimonials";
import { ComingSoonBanner } from "../components/ComingSoonBanner";
import { Footer } from "../components/Footer";

export function HomePage() {
  const { t } = useTranslation();
  usePageMeta({ title: t("seo_home_title"), description: t("seo_home_desc") });

  return (
    <>
      <Hero />
      <TrustStrip />
      <ProductGrid />
      <Testimonials />
      <ComingSoonBanner />
      <Footer />
    </>
  );
}

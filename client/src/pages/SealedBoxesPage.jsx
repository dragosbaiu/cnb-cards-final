import { motion } from "motion/react";
import { useTranslation } from "../hooks/useTranslation";
import { usePageMeta } from "../hooks/usePageMeta";
import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "../components/ProductCard";
import { Footer } from "../components/Footer";

export function SealedBoxesPage() {
  const { t } = useTranslation();
  usePageMeta({ title: t("seo_sealed_title"), description: t("seo_sealed_desc") });
  const { products, loading } = useProducts({ product_type: "sealed_box" });

  const hasProducts = !loading && products.length > 0;

  return (
    <>
      {hasProducts ? (
        <section className="bg-white py-20 min-h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <h1 className="text-3xl font-bold text-[#111111] tracking-tight">
                {t("sealed_title")}
              </h1>
              <p className="mt-2 text-[#4B5563]">{t("shop_subtitle")}</p>
            </motion.div>

            <motion.div
              className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            >
              {products.map((product) => (
                <ProductCard key={product.id} card={product} />
              ))}
            </motion.div>
          </div>
        </section>
      ) : (
        <section className="bg-gray-900 min-h-screen flex items-center justify-center py-32">
          <motion.div
            className="max-w-2xl mx-auto px-4 text-center flex flex-col items-center gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div>
              <h1 className="text-5xl sm:text-7xl font-bold text-white tracking-tight font-[Perandory]">
                {t("sealed_title")}
              </h1>
              <p className="mt-3 text-base font-semibold uppercase tracking-widest text-f1-red">
                {t("sealed_badge")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xl">
              <input
                type="email"
                placeholder={t("sealed_placeholder")}
                className="flex-1 w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-f1-red/50 focus:border-f1-red"
              />
              <button className="w-full sm:w-auto px-6 py-3 bg-f1-red text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap">
                {t("sealed_notify")}
              </button>
            </div>
          </motion.div>
        </section>
      )}
      <Footer />
    </>
  );
}

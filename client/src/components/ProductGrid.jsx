import { motion } from "motion/react";
import { useTranslation } from "../hooks/useTranslation";
import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "./ProductCard";

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export function ProductGrid() {
  const { t } = useTranslation();
  const { products, loading } = useProducts({ featured: "true" });

  return (
    <section className="bg-[#F8F9FA] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#111111] tracking-tight text-center mb-12">
          {t("featured_title")}
        </h2>
        {loading ? (
          <div className="text-center py-12 text-[#9CA3AF]">Loading...</div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            variants={gridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {products.map((card) => (
              <ProductCard key={card.id} card={card} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

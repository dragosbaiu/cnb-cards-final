import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { useTranslation } from "../hooks/useTranslation";
import { usePageMeta } from "../hooks/usePageMeta";
import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "../components/ProductCard";
import { Footer } from "../components/Footer";

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export function ShopPage() {
  const { t } = useTranslation();
  usePageMeta({ title: t("seo_shop_title"), description: t("seo_shop_desc") });
  const { products, loading } = useProducts({ product_type: "single" });

  const [search, setSearch] = useState("");
  const [condition, setCondition] = useState("All");
  const [year, setYear] = useState("All");
  const [collection, setCollection] = useState("All");
  const [sort, setSort] = useState("newest");

  const years = useMemo(
    () => [...new Set(products.map((c) => c.year))].sort((a, b) => b - a),
    [products]
  );

  const collections = useMemo(
    () => [...new Set(products.map((c) => c.set))].sort(),
    [products]
  );

  const filteredCards = useMemo(() => {
    let cards = [...products];

    if (search.trim()) {
      const words = search.toLowerCase().split(/\s+/).filter(Boolean);
      cards = cards.filter((c) => {
        const haystack = `${c.driver} ${c.set} ${c.year}`.toLowerCase();
        return words.every((word) => haystack.includes(word));
      });
    }

    if (condition !== "All") {
      cards = cards.filter((c) => c.condition === condition);
    }

    if (year !== "All") {
      cards = cards.filter((c) => c.year === Number(year));
    }

    if (collection !== "All") {
      cards = cards.filter((c) => c.set === collection);
    }

    if (sort === "low-high") {
      cards.sort((a, b) => a.price - b.price);
    } else if (sort === "high-low") {
      cards.sort((a, b) => b.price - a.price);
    } else {
      cards.sort((a, b) => b.year - a.year);
    }

    return cards;
  }, [products, search, condition, year, collection, sort]);

  if (!loading && products.length === 0) {
    return (
      <>
        <section className="bg-gray-900 min-h-screen flex items-center justify-center py-32">
          <motion.div
            className="max-w-2xl mx-auto px-4 text-center flex flex-col items-center gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div>
              <h1 className="text-5xl sm:text-7xl font-bold text-white tracking-tight font-[Perandory]">
                {t("shop_title")}
              </h1>
              <p className="mt-3 text-base font-semibold uppercase tracking-widest text-f1-red">
                {t("shop_coming_soon_badge")}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xl">
              <input
                type="email"
                placeholder={t("shop_coming_soon_placeholder")}
                className="flex-1 w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-f1-red/50 focus:border-f1-red"
              />
              <button className="w-full sm:w-auto px-6 py-3 bg-f1-red text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap">
                {t("shop_coming_soon_notify")}
              </button>
            </div>
          </motion.div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-[#111111] tracking-tight">
              {t("shop_title")}
            </h1>
            <p className="mt-2 text-[#4B5563] leading-relaxed">
              {t("shop_subtitle")}
            </p>
          </div>

          {/* Filters bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("shop_search_placeholder")}
              className="flex-1 px-4 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#111111] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-f1-red/50 focus:border-f1-red"
            />
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#4B5563] bg-white focus:outline-none focus:ring-2 focus:ring-f1-red/50 focus:border-f1-red"
            >
              <option value="All">{t("shop_filter_all_years")}</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select
              value={collection}
              onChange={(e) => setCollection(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#4B5563] bg-white focus:outline-none focus:ring-2 focus:ring-f1-red/50 focus:border-f1-red"
            >
              <option value="All">{t("shop_filter_all_collections")}</option>
              {collections.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#4B5563] bg-white focus:outline-none focus:ring-2 focus:ring-f1-red/50 focus:border-f1-red"
            >
              <option value="All">{t("shop_filter_all")}</option>
              <option value="Mint">{t("shop_filter_mint")}</option>
              <option value="Near Mint">{t("shop_filter_near_mint")}</option>
              <option value="Excellent">{t("shop_filter_excellent")}</option>
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#4B5563] bg-white focus:outline-none focus:ring-2 focus:ring-f1-red/50 focus:border-f1-red"
            >
              <option value="newest">{t("shop_sort_newest")}</option>
              <option value="low-high">{t("shop_sort_low_high")}</option>
              <option value="high-low">{t("shop_sort_high_low")}</option>
            </select>
          </div>

          {/* Grid or empty state */}
          {loading ? (
            <div className="text-center py-20 text-[#9CA3AF]">Loading...</div>
          ) : filteredCards.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              variants={gridVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              key={`${search}-${condition}-${year}-${collection}-${sort}`}
            >
              {filteredCards.map((card) => (
                <ProductCard key={card.id} card={card} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl font-semibold text-[#111111]">
                {t("shop_no_results")}
              </p>
              <p className="mt-2 text-sm text-[#9CA3AF]">
                {t("shop_no_results_hint")}
              </p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}

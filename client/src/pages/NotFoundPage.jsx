import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useTranslation } from "../hooks/useTranslation";
import { usePageMeta } from "../hooks/usePageMeta";

export function NotFoundPage() {
  const { t } = useTranslation();

  usePageMeta({ title: t("seo_404_title"), description: t("seo_404_desc") });

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-white">
      <motion.div
        className="text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <p className="text-8xl font-bold text-f1-red">404</p>
        <h1 className="mt-4 text-3xl font-bold text-[#111111] tracking-tight">
          {t("not_found_title")}
        </h1>
        <p className="mt-3 text-[#4B5563] leading-relaxed">
          {t("not_found_subtitle")}
        </p>
        <Link
          to="/"
          className="inline-block mt-8 px-6 py-3 bg-f1-red text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
        >
          {t("not_found_cta")}
        </Link>
      </motion.div>
    </section>
  );
}

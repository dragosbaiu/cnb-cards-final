import { motion } from "motion/react";
import { useTranslation } from "../hooks/useTranslation";

export function ComingSoonBanner() {
  const { t } = useTranslation();

  return (
    <motion.section
      className="bg-[#F8F9FA] py-16"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-[#111111] tracking-tight">
          {t("coming_soon_title")}
        </h2>
        <p className="mt-4 text-[#4B5563] leading-relaxed">
          {t("coming_soon_subtitle")}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full">
          <input
            type="email"
            placeholder={t("coming_soon_placeholder")}
            className="w-full flex-1 px-4 py-3 rounded-lg border border-[#E5E7EB] text-sm text-[#111111] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-f1-red/50 focus:border-f1-red"
          />
          <button className="w-full sm:w-auto px-6 py-3 bg-f1-red text-white font-semibold text-sm rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap">
            {t("coming_soon_button")}
          </button>
        </div>
      </div>
    </motion.section>
  );
}

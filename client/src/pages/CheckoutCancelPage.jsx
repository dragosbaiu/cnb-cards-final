import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useTranslation } from "../hooks/useTranslation";
import { usePageMeta } from "../hooks/usePageMeta";

export function CheckoutCancelPage() {
  const { t } = useTranslation();
  usePageMeta({ title: "Checkout Cancelled — CNB Cards", description: "Your checkout was cancelled." });

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-white">
      <motion.div
        className="text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-[#111111] tracking-tight">
          {t("checkout_cancel_title")}
        </h1>
        <p className="mt-3 text-[#4B5563] leading-relaxed max-w-md mx-auto">
          {t("checkout_cancel_subtitle")}
        </p>
        <Link
          to="/cart"
          className="inline-block mt-8 px-6 py-3 bg-f1-red text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
        >
          {t("checkout_cancel_cta")}
        </Link>
      </motion.div>
    </section>
  );
}

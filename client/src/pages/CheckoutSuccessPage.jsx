import { useEffect, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { useTranslation } from "../hooks/useTranslation";
import { usePageMeta } from "../hooks/usePageMeta";
import { CartContext } from "../context/CartContext";

import { API_URL } from "../lib/api";

export function CheckoutSuccessPage() {
  const { t } = useTranslation();
  usePageMeta({ title: "Order Confirmed — CNB Cards", description: "Your order has been confirmed." });
  const { clearCart } = useContext(CartContext);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    clearCart();
    const paymentIntentId = searchParams.get("payment_intent");
    if (paymentIntentId) {
      fetch(`${API_URL}/api/checkout/verify-payment/${paymentIntentId}`).catch(() => {});
    }
  }, []);

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-white">
      <motion.div
        className="text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-6xl mb-6">&#10003;</div>
        <h1 className="text-3xl font-bold text-[#111111] tracking-tight">
          {t("checkout_success_title")}
        </h1>
        <p className="mt-3 text-[#4B5563] leading-relaxed max-w-md mx-auto">
          {t("checkout_success_subtitle")}
        </p>
        <Link
          to="/shop/singles"
          className="inline-block mt-8 px-6 py-3 bg-f1-red text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
        >
          {t("checkout_success_cta")}
        </Link>
      </motion.div>
    </section>
  );
}

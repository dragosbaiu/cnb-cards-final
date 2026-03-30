import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { usePageMeta } from "../hooks/usePageMeta";
import { CartContext } from "../context/CartContext";
import { Footer } from "../components/Footer";
import { getProcessingFee } from "../lib/fees";

export function CartPage() {
  const { t } = useTranslation();
  usePageMeta({ title: "Cart — CNB Cards", description: "Your shopping cart" });
  const { items, removeItem, updateQuantity, total } = useContext(CartContext);
  const navigate = useNavigate();

  const processingFee = getProcessingFee(total);
  const estimatedTotal = total + processingFee;

  const itemLabel = items.length === 1 ? t("cart_items_count") : t("cart_items_count_plural");

  return (
    <>
      <section className="bg-[#F8F9FA] py-16 min-h-[calc(100vh-4rem)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E7EB]">
              <h1 className="text-2xl font-bold text-[#111111] flex items-center gap-2">
                <ShoppingCart className="h-6 w-6" />
                {t("cart_title")}
              </h1>
              <span className="text-sm text-[#9CA3AF]">
                {items.length} {itemLabel}
              </span>
            </div>

            {/* Body */}
            <div className="px-6 py-6">
              {items.length === 0 ? (
                <motion.div
                  className="text-center py-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-lg font-semibold text-[#111111]">
                    {t("cart_empty")}
                  </p>
                  <p className="mt-2 text-sm text-[#9CA3AF]">
                    {t("cart_empty_hint")}
                  </p>
                  <Link
                    to="/shop/singles"
                    className="inline-block mt-6 px-6 py-3 bg-f1-red text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                  >
                    {t("cart_browse")}
                  </Link>
                </motion.div>
              ) : (
                <>
                  {/* Item list */}
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 border border-[#E5E7EB] rounded-lg p-3"
                      >
                        <div className="w-20 h-24 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.driver}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#111111] truncate">
                            {item.driver}
                          </p>
                          <p className="text-sm text-[#9CA3AF] mt-0.5">
                            {item.year} · {item.set}
                          </p>
                          <p className="text-sm text-[#4B5563] mt-0.5">
                            {item.condition}
                          </p>
                          {item.product_type === "sealed_box" && (
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-6 h-6 rounded border border-[#E5E7EB] text-[#4B5563] text-sm font-bold flex items-center justify-center hover:bg-gray-50 transition-colors"
                              >
                                −
                              </button>
                              <span className="text-sm font-semibold text-[#111111] w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.stock}
                                className="w-6 h-6 rounded border border-[#E5E7EB] text-[#4B5563] text-sm font-bold flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-3 flex-shrink-0">
                          <p className="font-bold text-[#111111]">
                            &euro;{(item.price * item.quantity).toFixed(2)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-[#9CA3AF]">
                              &euro;{item.price.toFixed(2)} each
                            </p>
                          )}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-[#9CA3AF] hover:text-red-600 transition-colors"
                            aria-label={t("cart_remove")}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Separator */}
                  <div className="h-px bg-[#E5E7EB] my-6" />

                  {/* Summary */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-[#4B5563]">
                      <span>{t("cart_subtotal")}</span>
                      <span className="font-medium">&euro;{total.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-[#4B5563]">
                      <span>{t("cart_shipping")}</span>
                      <span className="font-medium text-[#9CA3AF]">{t("cart_shipping_value")}</span>
                    </div>

                    {/* Processing fee */}
                    <div className="flex justify-between text-[#4B5563]">
                      <span className="flex items-center gap-1">
                        {t("cart_processing_fee")}
                        <span className="text-[10px] text-[#9CA3AF] bg-gray-100 rounded px-1 py-0.5">1.5%</span>
                      </span>
                      <span className="font-medium">&euro;{processingFee.toFixed(2)}</span>
                    </div>

                    <div className="h-px bg-[#E5E7EB] my-1" />
                    <div className="flex justify-between font-bold text-lg text-[#111111]">
                      <span>{t("cart_total")}</span>
                      <span>&euro;{estimatedTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 pb-6">
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full py-3 bg-f1-red text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                  {t("cart_checkout")}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </section>
      <Footer />
    </>
  );
}

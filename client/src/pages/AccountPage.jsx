import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Package, LogOut, Trash2 } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { usePageMeta } from "../hooks/usePageMeta";
import { AuthContext } from "../context/AuthContext";
import { Footer } from "../components/Footer";

import { API_URL } from "../lib/api";

export function AccountPage() {
  const { t } = useTranslation();
  usePageMeta({ title: "My Account — CNB Cards", description: "Your account and order history" });
  const { user, loading: authLoading, signOut, getAccessToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch {
        // silently fail
      }
      setLoadingOrders(false);
    };
    fetchOrders();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteEmailSent, setDeleteEmailSent] = useState(false);

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/request-delete`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      if (res.ok) {
        setDeleteEmailSent(true);
        setShowDeleteConfirm(false);
      }
    } catch {
      // silently fail
    }
    setDeleting(false);
  };

  if (authLoading) return null;
  if (!user) return null;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    shipped: "bg-blue-100 text-blue-800",
    delivered: "bg-gray-100 text-gray-800",
  };

  return (
    <>
      <section className="bg-[#F8F9FA] min-h-[calc(100vh-4rem)] py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Account card */}
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden mb-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E7EB]">
              <h1 className="text-2xl font-bold text-[#111111]">{t("account_title")}</h1>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 text-sm text-[#4B5563] hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                {t("account_signout")}
              </button>
            </div>
            <div className="px-6 py-5">
              <p className="text-[#111111]">
                <span className="font-medium">{t("account_greeting")}, </span>
                <span className="font-bold">{user.name || user.email}</span>
              </p>
              <p className="text-sm text-[#9CA3AF] mt-1">{user.email}</p>
            </div>
          </motion.div>

          {/* Delete account */}
          {deleteEmailSent ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 rounded-xl px-6 py-5 mb-4 text-sm text-green-800"
            >
              {t("account_delete_email_sent")}
            </motion.div>
          ) : !showDeleteConfirm ? (
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1.5 text-sm text-[#9CA3AF] hover:text-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                {t("account_delete")}
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-xl px-6 py-5 mb-4"
            >
              <p className="text-sm text-red-800 mb-4">{t("account_delete_confirm")}</p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {t("account_delete_confirm_btn")}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-[#4B5563] hover:text-[#111111] transition-colors"
                >
                  {t("account_delete_cancel")}
                </button>
              </div>
            </motion.div>
          )}

          {/* Order history */}
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          >
            <div className="flex items-center gap-2 px-6 py-5 border-b border-[#E5E7EB]">
              <Package className="h-5 w-5 text-[#111111]" />
              <h2 className="text-lg font-bold text-[#111111]">{t("account_orders_title")}</h2>
            </div>

            {loadingOrders ? (
              <div className="px-6 py-12 text-center text-sm text-[#9CA3AF]">...</div>
            ) : orders.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-[#111111] font-medium">{t("account_no_orders")}</p>
                <p className="text-sm text-[#9CA3AF] mt-1">{t("account_no_orders_hint")}</p>
                <Link
                  to="/shop/singles"
                  className="inline-block mt-6 px-6 py-3 bg-f1-red text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                  {t("account_browse")}
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#E5E7EB]">
                {orders.map((order) => (
                  <div key={order.id} className="px-6 py-5">
                    {/* Order header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-[#111111]">
                          {t("account_order")} #{order.id.slice(0, 8)}
                        </span>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            statusColors[order.status] || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-[#111111]">
                        &euro;{Number(order.total).toFixed(2)}
                      </span>
                    </div>

                    <p className="text-xs text-[#9CA3AF] mb-3">
                      {formatDate(order.created_at)}
                      {order.shipping_address && (
                        <>
                          {" · "}
                          {order.shipping_address.city}, {order.shipping_address.country}
                        </>
                      )}
                    </p>

                    {/* Order items */}
                    <div className="space-y-2">
                      {order.order_items?.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          {item.products?.image_url && (
                            <div className="w-10 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                              <img
                                src={item.products.image_url}
                                alt={item.products.driver}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#111111] truncate">
                              {item.products?.driver || "Product"}
                            </p>
                            <p className="text-xs text-[#9CA3AF]">
                              {item.products?.year} · {item.products?.set_name}
                            </p>
                          </div>
                          <p className="text-sm font-medium text-[#111111]">
                            &euro;{Number(item.price_at_purchase).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>
      <Footer />
    </>
  );
}

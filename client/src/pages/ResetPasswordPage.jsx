import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { useTranslation } from "../hooks/useTranslation";
import { usePageMeta } from "../hooks/usePageMeta";
import { API_URL } from "../lib/api";
import { Footer } from "../components/Footer";

function parseToken() {
  // PKCE flow: token_hash is a query param (?token_hash=...&type=recovery)
  const query = new URLSearchParams(window.location.search);
  if (query.get("token_hash") && query.get("type") === "recovery") {
    return { token_hash: query.get("token_hash") };
  }

  // Implicit flow: access_token is in the URL hash (#access_token=...&type=recovery)
  const hash = new URLSearchParams(window.location.hash.slice(1));
  if (hash.get("access_token") && hash.get("type") === "recovery") {
    return { access_token: hash.get("access_token") };
  }

  return null;
}

export function ResetPasswordPage() {
  const { t } = useTranslation();
  usePageMeta({ title: "Reset Password — CNB Cards", description: "Set a new password for your account" });
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [searchParams] = useSearchParams();

  const token = parseToken();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError(t("reset_password_mismatch"));
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...token, new_password: password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDone(true);
      setTimeout(() => navigate("/auth"), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="bg-[#F8F9FA] min-h-[calc(100vh-4rem)] flex items-center justify-center py-16">
        <motion.div
          className="w-full max-w-md mx-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden">
            <div className="px-6 py-5 border-b border-[#E5E7EB]">
              <h1 className="text-2xl font-bold text-[#111111]">
                {t("reset_password_title")}
              </h1>
            </div>

            <div className="px-6 py-6">
              {!token ? (
                <div className="text-center space-y-4">
                  <p className="text-sm text-red-600">{t("reset_password_invalid_link")}</p>
                  <Link to="/auth" className="text-sm text-f1-red font-semibold hover:text-red-700 transition-colors">
                    {t("reset_password_back_to_signin")}
                  </Link>
                </div>
              ) : done ? (
                <div className="text-center space-y-2">
                  <p className="text-sm text-green-700 font-semibold">{t("reset_password_success")}</p>
                  <p className="text-sm text-[#9CA3AF]">{t("reset_password_redirecting")}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-[#4B5563] mb-1">
                      {t("reset_password_new")}
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#111111] focus:outline-none focus:ring-2 focus:ring-f1-red/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#4B5563] mb-1">
                      {t("reset_password_confirm")}
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#111111] focus:outline-none focus:ring-2 focus:ring-f1-red/50"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-f1-red text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "..." : t("reset_password_submit")}
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </section>
      <Footer />
    </>
  );
}

import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useTranslation } from "../hooks/useTranslation";
import { usePageMeta } from "../hooks/usePageMeta";
import { AuthContext } from "../context/AuthContext";
import { API_URL } from "../lib/api";
import { Footer } from "../components/Footer";

export function AuthPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, signIn, signUp } = useContext(AuthContext);

  const [mode, setMode] = useState("signin"); // "signin" | "signup" | "forgot"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  usePageMeta({
    title: mode === "signin" ? "Sign In — CNB Cards" : mode === "signup" ? "Sign Up — CNB Cards" : "Forgot Password — CNB Cards",
    description: "Sign in or create an account at CNB Cards",
  });

  useEffect(() => {
    if (user) navigate("/account");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "forgot") {
        const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setForgotSent(true);
      } else if (mode === "signin") {
        await signIn(email, password);
        navigate("/account");
      } else {
        await signUp(email, password, name);
        navigate("/account");
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const toggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setError(null);
    setForgotSent(false);
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
                {mode === "signin" ? t("auth_signin_title") : mode === "signup" ? t("auth_signup_title") : t("auth_forgot_title")}
              </h1>
            </div>

            {/* Forgot password — success state */}
            {mode === "forgot" && forgotSent ? (
              <div className="px-6 py-6 text-center space-y-3">
                <p className="text-sm text-green-700 font-semibold">{t("auth_forgot_sent")}</p>
                <p className="text-sm text-[#9CA3AF]">{t("auth_forgot_sent_hint")}</p>
                <button
                  onClick={() => { setMode("signin"); setForgotSent(false); setError(null); }}
                  className="text-sm text-f1-red font-semibold hover:text-red-700 transition-colors"
                >
                  {t("auth_switch_to_signin_action")}
                </button>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">
                      {error}
                    </p>
                  )}

                  {mode === "signup" && (
                    <div>
                      <label className="block text-sm font-medium text-[#4B5563] mb-1">
                        {t("auth_name")}
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#111111] focus:outline-none focus:ring-2 focus:ring-f1-red/50"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-[#4B5563] mb-1">
                      {t("auth_email")}
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#111111] focus:outline-none focus:ring-2 focus:ring-f1-red/50"
                    />
                  </div>

                  {mode !== "forgot" && (
                    <div>
                      <label className="block text-sm font-medium text-[#4B5563] mb-1">
                        {t("auth_password")}
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
                  )}

                  {mode === "signin" && (
                    <div className="text-right -mt-1">
                      <button
                        type="button"
                        onClick={() => { setMode("forgot"); setError(null); }}
                        className="text-xs text-[#9CA3AF] hover:text-[#4B5563] transition-colors"
                      >
                        {t("auth_forgot_link")}
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-f1-red text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "..." : mode === "signin" ? t("auth_signin_button") : mode === "signup" ? t("auth_signup_button") : t("auth_forgot_submit")}
                  </button>
                </form>

                <div className="px-6 pb-6 text-center">
                  {mode === "forgot" ? (
                    <button
                      onClick={() => { setMode("signin"); setError(null); }}
                      className="text-sm text-[#4B5563]"
                    >
                      {t("auth_forgot_back")}
                    </button>
                  ) : (
                    <button onClick={toggleMode} className="text-sm text-[#4B5563]">
                      {mode === "signin" ? t("auth_switch_to_signup") : t("auth_switch_to_signin")}{" "}
                      <span className="text-f1-red font-semibold hover:text-red-700 transition-colors">
                        {mode === "signin" ? t("auth_switch_to_signup_action") : t("auth_switch_to_signin_action")}
                      </span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </section>
      <Footer />
    </>
  );
}

import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Trash2, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LanguageContext } from "../context/LanguageContext";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useTranslation } from "../hooks/useTranslation";
import logo from "@/assets/logo.jpg";

export function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { language, toggleLanguage } = useContext(LanguageContext);
  const { itemCount, items, total, removeItem } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();

  const navLinks = [
    { to: "/", label: t("nav_home") },
    { to: "/about", label: t("nav_about") },
    { to: "/contact", label: t("nav_contact") },
  ];

  const shopSubLinks = [
    { to: "/shop/singles", label: t("nav_shop_singles") },
    { to: "/shop/sealed-boxes", label: t("nav_shop_sealed") },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="CNB Cards"
              className="h-8 w-auto object-contain"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
            <span className="text-[2rem] font-bold text-[#111111] tracking-tight font-[Perandory] leading-none h-8 flex items-center translate-y-[3px]">
              CNB Cards
            </span>
          </Link>

          {/* Desktop nav links — absolutely centered */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <Link
              to={navLinks[0].to}
              className="text-sm font-medium text-[#4B5563] hover:text-[#111111] transition-colors"
              onMouseEnter={() => setShopOpen(false)}
            >
              {navLinks[0].label}
            </Link>

            {/* Shop trigger */}
            <button
              className="text-sm font-medium text-[#4B5563] hover:text-[#111111] transition-colors"
              onMouseEnter={() => setShopOpen(true)}
            >
              {t("nav_shop")}
            </button>

            {navLinks.slice(1).map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-[#4B5563] hover:text-[#111111] transition-colors"
                onMouseEnter={() => setShopOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side: language toggle + cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center text-sm font-medium">
              <button
                onClick={() => language !== "en" && toggleLanguage()}
                className={language === "en" ? "text-[#111111]" : "text-[#9CA3AF] hover:text-[#4B5563] transition-colors"}
              >
                EN
              </button>
              <span className="mx-1 text-[#9CA3AF]">|</span>
              <button
                onClick={() => language !== "ro" && toggleLanguage()}
                className={language === "ro" ? "text-[#111111]" : "text-[#9CA3AF] hover:text-[#4B5563] transition-colors"}
              >
                RO
              </button>
            </div>

            {/* Cart icon */}
            <div
              className="relative"
              onMouseEnter={() => setCartOpen(true)}
              onMouseLeave={() => setCartOpen(false)}
            >
              <Link to="/cart" className="relative text-[#4B5563] hover:text-[#111111] transition-colors flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-f1-red text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Cart summary dropdown */}
              <AnimatePresence>
                {cartOpen && location.pathname !== "/cart" && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-3 w-72 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-50"
                  >
                    <div className="px-4 py-3 border-b border-[#E5E7EB]">
                      <p className="text-sm font-semibold text-[#111111]">Cart Summary</p>
                    </div>
                    {items.length === 0 ? (
                      <div className="px-4 py-6 text-center text-sm text-[#9CA3AF]">
                        Your cart is empty
                      </div>
                    ) : (
                      <>
                        <div className="px-4 py-3 space-y-3 max-h-56 overflow-y-auto">
                          {items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3">
                              <div className="w-10 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                                <img src={item.image} alt={item.driver} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-[#111111] truncate">{item.driver}</p>
                                <p className="text-xs text-[#9CA3AF]">{item.year} · {item.set}</p>
                                {item.quantity > 1 && (
                                  <p className="text-xs text-[#9CA3AF]">Qty: {item.quantity}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <p className="text-xs font-bold text-[#111111]">&euro;{(item.price * item.quantity).toFixed(2)}</p>
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="text-[#9CA3AF] hover:text-red-600 transition-colors"
                                  aria-label="Remove"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="px-4 py-3 border-t border-[#E5E7EB] flex items-center justify-between">
                          <span className="text-sm font-bold text-[#111111]">Total</span>
                          <span className="text-sm font-bold text-[#111111]">&euro;{total.toFixed(2)}</span>
                        </div>
                        <div className="px-4 pb-4">
                          <Link
                            to="/cart"
                            onClick={() => setCartOpen(false)}
                            className="block w-full text-center py-2 bg-f1-red text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
                          >
                            View Cart
                          </Link>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Account icon */}
            <Link
              to={user ? "/account" : "/auth"}
              className="flex text-[#4B5563] hover:text-[#111111] transition-colors"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-[#4B5563] hover:text-[#111111]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            <Link
              to="/"
              className="block py-2 text-sm font-medium text-[#4B5563] hover:text-[#111111]"
              onClick={() => setMobileOpen(false)}
            >
              {t("nav_home")}
            </Link>
            <div className="py-2 text-sm font-medium text-[#4B5563]">
              {t("nav_shop")}
            </div>
            <div className="pl-4">
              <span className="block py-1 text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                {t("nav_shop_f1")}
              </span>
              {shopSubLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block py-2 pl-2 text-sm text-[#4B5563] hover:text-[#111111]"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <Link
              to="/about"
              className="block py-2 text-sm font-medium text-[#4B5563] hover:text-[#111111]"
              onClick={() => setMobileOpen(false)}
            >
              {t("nav_about")}
            </Link>
            <Link
              to="/contact"
              className="block py-2 text-sm font-medium text-[#4B5563] hover:text-[#111111]"
              onClick={() => setMobileOpen(false)}
            >
              {t("nav_contact")}
            </Link>
            <Link
              to={user ? "/account" : "/auth"}
              className="block py-2 text-sm font-medium text-[#4B5563] hover:text-[#111111]"
              onClick={() => setMobileOpen(false)}
            >
              {user ? t("account_title") : t("auth_signin_title")}
            </Link>
          </div>
        )}
      </div>

      {/* Full-width mega dropdown */}
      <AnimatePresence>
        {shopOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="hidden md:block absolute left-0 w-full bg-gray-50 border-t border-gray-100 shadow-xl"
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-3">
                  {t("nav_shop_f1")}
                </span>
                {shopSubLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="block py-1.5 text-sm text-[#4B5563] hover:text-[#111111] transition-colors"
                    onClick={() => setShopOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { ScrollToTop } from "./components/ScrollToTop";
import { HomePage } from "./pages/HomePage";
import { ShopPage } from "./pages/ShopPage";
import { SealedBoxesPage } from "./pages/SealedBoxesPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutSuccessPage } from "./pages/CheckoutSuccessPage";
import { CheckoutCancelPage } from "./pages/CheckoutCancelPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { AdminPage } from "./pages/AdminPage";
import { AuthPage } from "./pages/AuthPage";
import { AccountPage } from "./pages/AccountPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { TermsPage } from "./pages/TermsPage";
import { ReturnPolicyPage } from "./pages/ReturnPolicyPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { ConfirmDeletePage } from "./pages/ConfirmDeletePage";

function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={
                <>
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop/singles" element={<ShopPage />} />
                    <Route path="/shop/sealed-boxes" element={<SealedBoxesPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
                    <Route path="/checkout/cancel" element={<CheckoutCancelPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/returns" element={<ReturnPolicyPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/confirm-delete" element={<ConfirmDeletePage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </>
              } />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </CartProvider>
    </LanguageProvider>
  );
}

export default App;

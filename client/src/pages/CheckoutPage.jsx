import { useState, useEffect, useCallback, useContext, Component } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  AddressElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { motion } from "motion/react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { API_URL } from "../lib/api";
import { getProcessingFee } from "../lib/fees";
import { Footer } from "../components/Footer";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

class StripeErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div className="bg-white rounded-xl border border-red-200 p-6 text-center space-y-3">
          <p className="text-red-600 font-medium text-sm">Failed to load payment form.</p>
          <p className="text-[#9CA3AF] text-xs">Please refresh the page and try again.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const EU_COUNTRIES = new Set(["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","SK","SI","ES","SE"]);

function getShippingFee(country) {
  if (!country) return null;
  if (country === "RO") return 1;
  if (EU_COUNTRIES.has(country)) return 2;
  return 5;
}

// ─── Inner form — must live inside <Elements> to use stripe/elements hooks ───
function CheckoutForm({ paymentIntentId, items, subtotal, processingFee, shippingFee, onAddressCountry }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [addressComplete, setAddressComplete] = useState(false);
  const [lastCountry, setLastCountry] = useState(null);

  const grandTotal = subtotal + processingFee + (shippingFee ?? 0);

  const handleAddressChange = useCallback(async (event) => {
    setAddressComplete(event.complete);
    if (!event.complete) return;

    const country = event.value.address.country;
    if (country === lastCountry) return;
    setLastCountry(country);

    // Notify parent for display
    onAddressCountry(country);

    // Update PaymentIntent amount on server
    try {
      const res = await fetch(`${API_URL}/api/checkout/update-shipping`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_intent_id: paymentIntentId, country }),
      });
      if (!res.ok) {
        setError("Failed to calculate shipping. Please try again.");
        return;
      }
      // Sync Elements with updated PaymentIntent amount
      if (elements) await elements.fetchUpdates();
    } catch {
      setError("Network error. Please check your connection and try again.");
    }
  }, [lastCountry, paymentIntentId, elements, onAddressCountry]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !addressComplete || shippingFee === null) return;

    setError(null);
    setSubmitting(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message);
      setSubmitting(false);
      return;
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    if (confirmError) {
      setError(confirmError.message);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Shipping address */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#9CA3AF] mb-4">
          Shipping Address
        </h2>
        <AddressElement
          options={{
            mode: "shipping",
            allowedCountries: ["RO","AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","SK","SI","ES","SE","GB","CH","NO","US","CA","AU","JP"],
          }}
          onChange={handleAddressChange}
        />
      </div>

      {/* Shipping fee feedback */}
      {shippingFee !== null && (
        <div className="flex items-center justify-between px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
          <span>Shipping to your location</span>
          <span className="font-semibold">&euro;{shippingFee.toFixed(2)}</span>
        </div>
      )}

      {/* Payment */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#9CA3AF] mb-4">
          Payment
        </h2>
        <PaymentElement options={{ fields: { billingDetails: { email: "always" } } }} />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>
      )}

      <button
        type="submit"
        disabled={!stripe || submitting || !addressComplete || shippingFee === null}
        className="w-full py-3.5 bg-f1-red text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting
          ? "Processing..."
          : !addressComplete
          ? "Complete your address to continue"
          : shippingFee === null
          ? "Loading..."
          : `Pay \u20ac${grandTotal.toFixed(2)}`}
      </button>

      <p className="text-center text-xs text-[#9CA3AF]">
        Secured by Stripe. Your card details are never stored on our servers.
      </p>
    </form>
  );
}

// ─── Outer page ───────────────────────────────────────────────────────────────
export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total } = useContext(CartContext);
  const { getAccessToken, user } = useContext(AuthContext);

  const [clientSecret, setClientSecret] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [shippingFee, setShippingFee] = useState(null);
  const [initError, setInitError] = useState(null);

  const processingFee = getProcessingFee(total);
  const grandTotal = total + processingFee + (shippingFee ?? 0);

  useEffect(() => {
    if (!items.length) { navigate("/cart"); return; }

    const init = async () => {
      const headers = { "Content-Type": "application/json" };
      const token = getAccessToken();
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/api/checkout/create-intent`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
          customer_email: user?.email || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setInitError(data.error || "Failed to initialize checkout");
        return;
      }

      const data = await res.json();
      setClientSecret(data.client_secret);
      setPaymentIntentId(data.payment_intent_id);
    };

    init();
  }, []);

  const handleAddressCountry = useCallback((country) => {
    setShippingFee(getShippingFee(country));
  }, []);

  if (initError) {
    return (
      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-red-600 font-medium">{initError}</p>
          <button onClick={() => navigate("/cart")} className="text-sm text-f1-red underline">
            Back to cart
          </button>
        </div>
      </section>
    );
  }

  if (!clientSecret) {
    return (
      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-[#9CA3AF]">Loading checkout...</p>
      </section>
    );
  }

  return (
    <>
      <section className="bg-[#F8F9FA] py-16 min-h-[calc(100vh-4rem)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            className="text-2xl font-bold text-[#111111] mb-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Checkout
          </motion.h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left — address + payment form */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <StripeErrorBoundary>
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: "stripe",
                      variables: {
                        colorPrimary: "#E10600",
                        colorBackground: "#ffffff",
                        colorText: "#111111",
                        colorDanger: "#E10600",
                        borderRadius: "8px",
                        fontFamily: "Arial, sans-serif",
                      },
                    },
                  }}
                >
                  <CheckoutForm
                    paymentIntentId={paymentIntentId}
                    items={items}
                    subtotal={total}
                    processingFee={processingFee}
                    shippingFee={shippingFee}
                    onAddressCountry={handleAddressCountry}
                  />
                </Elements>
              </StripeErrorBoundary>
            </motion.div>

            {/* Right — order summary */}
            <motion.div
              className="bg-white rounded-xl border border-[#E5E7EB] p-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#9CA3AF] mb-4">
                Order Summary
              </h2>

              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-10 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={item.image} alt={item.driver} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#111111] truncate">{item.driver}</p>
                      <p className="text-xs text-[#9CA3AF]">{item.year} · {item.set}</p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-[#9CA3AF]">Qty: {item.quantity}</p>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-[#111111] flex-shrink-0">
                      &euro;{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-[#E5E7EB] space-y-2 text-sm">
                <div className="flex justify-between text-[#4B5563]">
                  <span>Subtotal</span>
                  <span>&euro;{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#4B5563]">
                  <span className="flex items-center gap-1">
                    Processing fee
                    <span className="text-[10px] bg-gray-100 text-[#9CA3AF] rounded px-1">1.5%</span>
                  </span>
                  <span>&euro;{processingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#4B5563]">
                  <span>Shipping</span>
                  <span>
                    {shippingFee !== null
                      ? `\u20ac${shippingFee.toFixed(2)}`
                      : <span className="text-[#9CA3AF] italic">enter address</span>}
                  </span>
                </div>
                <div className="h-px bg-[#E5E7EB] my-1" />
                <div className="flex justify-between font-bold text-[#111111]">
                  <span>Total</span>
                  <span>&euro;{grandTotal.toFixed(2)}</span>
                </div>
                {shippingFee === null && (
                  <p className="text-[11px] text-[#9CA3AF]">
                    Shipping is calculated automatically based on your delivery address.
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

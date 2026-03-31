import { motion } from "motion/react";
import { usePageMeta } from "../hooks/usePageMeta";
import { Footer } from "../components/Footer";

export function TermsPage() {
  usePageMeta({
    title: "Terms & Conditions — CNB Cards",
    description: "Terms and conditions for purchasing from CNB Cards.",
  });

  return (
    <>
      <section className="bg-white py-20">
        <motion.div
          className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-4xl font-bold text-[#111111] tracking-tight mb-2">Terms &amp; Conditions</h1>
          <p className="text-sm text-[#9CA3AF] mb-12">Last updated: March 2026</p>

          <div className="prose prose-gray max-w-none space-y-8 text-[#4B5563] leading-relaxed">

            <section>
              <h2 className="text-xl font-bold text-[#111111] mb-3">1. Introduction</h2>
              <p>These Terms and Conditions govern your use of the CNB Cards website (cnbcards.com) and the purchase of products through it. By placing an order, you agree to be bound by these terms. CNB Cards is operated as a private business based in Romania, selling Formula 1 trading cards to customers within the European Union and internationally.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111111] mb-3">2. Products</h2>
              <p>CNB Cards sells official Formula 1 trading cards, including single cards and sealed boxes. All cards are genuine and sourced from authorised distributors or reputable secondary market sellers. Each listing clearly states the card's condition (Mint, Near Mint, Excellent). Images shown are representative of the actual card you will receive.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111111] mb-3">3. Pricing and Payment</h2>
              <p>All prices are displayed in Euros (€) and include VAT where applicable. A payment processing fee of 1.5% is applied to all orders to cover card transaction costs. Shipping fees are calculated based on your delivery country at checkout.</p>
              <p className="mt-2">Payments are processed securely by Stripe. CNB Cards does not store any card payment details. By completing a purchase, you confirm that the payment method is yours and that you are authorised to use it.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111111] mb-3">4. Orders and Stock</h2>
              <p>All orders are subject to availability. Because many cards are one-of-a-kind collectibles, stock is not reserved until payment is completed. In the unlikely event that a card becomes unavailable after your payment is processed, we will contact you immediately and issue a full refund.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111111] mb-3">5. Shipping and Delivery</h2>
              <p>Orders are shipped from Romania. Estimated delivery times:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Romania: 2–4 business days</li>
                <li>European Union: 5–10 business days</li>
                <li>Rest of World: 10–21 business days</li>
              </ul>
              <p className="mt-2">All cards are packaged with protective sleeves and rigid mailers to ensure safe delivery. CNB Cards is not responsible for delays caused by customs or postal services.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111111] mb-3">6. Returns and Refunds</h2>
              <p>Please refer to our <a href="/returns" className="text-f1-red hover:underline">Return Policy</a> for full details. Under EU consumer law, you have the right to withdraw from a purchase within 14 days of receiving your order, without giving a reason, provided the item is in its original condition.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111111] mb-3">7. Intellectual Property</h2>
              <p>All content on the CNB Cards website — including text, images, logos, and design — is the property of CNB Cards or its licensors and is protected under applicable copyright laws. You may not reproduce, distribute, or create derivative works without prior written consent.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111111] mb-3">8. Limitation of Liability</h2>
              <p>To the maximum extent permitted by applicable law, CNB Cards shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products. Our total liability shall not exceed the amount paid for the order in question.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111111] mb-3">9. Governing Law</h2>
              <p>These terms are governed by the laws of Romania and applicable European Union consumer protection regulations, including Directive 2011/83/EU on consumer rights. Any disputes shall be subject to the jurisdiction of Romanian courts, without prejudice to your rights as a consumer under applicable EU law.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111111] mb-3">10. Contact</h2>
              <p>For any questions regarding these terms, please contact us at <a href="mailto:contact@cnbcards.ro" className="text-f1-red hover:underline">contact@cnbcards.ro</a>.</p>
            </section>

          </div>
        </motion.div>
      </section>
      <Footer />
    </>
  );
}

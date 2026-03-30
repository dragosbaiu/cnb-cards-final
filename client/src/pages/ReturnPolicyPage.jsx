import { motion } from "motion/react";
import { usePageMeta } from "../hooks/usePageMeta";
import { Footer } from "../components/Footer";

export function ReturnPolicyPage() {
  usePageMeta({
    title: "Return Policy — CNB Cards",
    description: "Our return and refund policy for CNB Cards purchases.",
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
          <h1 className="text-4xl font-bold text-[#111111] tracking-tight mb-2">Return Policy</h1>
          <p className="text-sm text-[#9CA3AF] mb-12">Last updated: March 2026</p>

          <div className="prose prose-gray max-w-none space-y-8 text-[#4B5563] leading-relaxed">

            <section>
              <h2 className="text-xl font-bold text-[#111111] mb-3">Your Right to Return</h2>
              <p>Under EU consumer law (Directive 2011/83/EU), you have the right to withdraw from your purchase within <strong className="text-[#111111]">14 days</strong> of receiving your order, without giving any reason. This right applies to all customers within the European Union.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111111] mb-3">Conditions for Return</h2>
              <p>To be eligible for a return, the item must:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Be in the same condition as received — unhandled, with no additional marks or damage</li>
                <li>Be in its original packaging (card sleeve and any protective wrapping)</li>
                <li>Not have been graded, signed, or altered in any way after receipt</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111111] mb-3">Exceptions</h2>
              <p>The following items cannot be returned:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong className="text-[#111111]">Opened sealed boxes</strong> — once a sealed product has been opened, it cannot be returned, as the contents are revealed and the product's sealed nature is permanently altered.</li>
                <li>Items damaged after delivery due to customer handling.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111111] mb-3">How to Initiate a Return</h2>
              <ol className="list-decimal pl-6 mt-2 space-y-2">
                <li>Contact us at <a href="mailto:contact@cnbcards.com" className="text-f1-red hover:underline">contact@cnbcards.com</a> within 14 days of receiving your order.</li>
                <li>Include your order number and a brief description of the reason for return.</li>
                <li>We will reply within 2 business days with return instructions.</li>
                <li>Ship the item back to us using a tracked service. You are responsible for return shipping costs unless the item was sent in error or is defective.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111111] mb-3">Refunds</h2>
              <p>Once we receive and inspect the returned item, we will notify you by email. If approved, your refund will be processed within <strong className="text-[#111111]">14 days</strong> of receiving the return. The refund will be issued to your original payment method via Stripe.</p>
              <p className="mt-2">Please note that the original shipping fee and processing fee are non-refundable unless the return is due to our error or a defective item.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111111] mb-3">Damaged or Incorrect Items</h2>
              <p>If you receive a card that was damaged in transit, or that does not match the listing description, please contact us within <strong className="text-[#111111]">48 hours</strong> of delivery with photos of the item and packaging. We will arrange a full refund or replacement at no cost to you.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111111] mb-3">Contact</h2>
              <p>For all return enquiries: <a href="mailto:contact@cnbcards.com" className="text-f1-red hover:underline">contact@cnbcards.com</a></p>
            </section>

          </div>
        </motion.div>
      </section>
      <Footer />
    </>
  );
}

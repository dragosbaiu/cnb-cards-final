import { motion } from "motion/react";
import { usePageMeta } from "../hooks/usePageMeta";
import { Footer } from "../components/Footer";

export function PrivacyPage() {
  usePageMeta({
    title: "Privacy Policy — CNB Cards",
    description: "How CNB Cards collects, uses, and protects your personal data.",
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
          <h1 className="text-4xl font-bold text-[#111111] tracking-tight mb-2">Privacy Policy</h1>
          <p className="text-sm text-[#9CA3AF] mb-12">Last updated: March 2026</p>

          <div className="prose prose-gray max-w-none space-y-8 text-[#4B5563] leading-relaxed">

            <section>
              <h2 className="text-xl font-bold text-[#111111] mb-3">1. Who We Are</h2>
              <p>CNB Cards (cnbcards.ro) is a trading card business based in Romania. We are committed to protecting your personal data in accordance with the EU General Data Protection Regulation (GDPR) and Romanian data protection law. For any privacy-related questions, contact us at <a href="mailto:contact@cnbcards.ro" className="text-f1-red hover:underline">contact@cnbcards.ro</a>.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111111] mb-3">2. Data We Collect</h2>
              <p>When you use our website or place an order, we may collect:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong className="text-[#111111]">Identity data:</strong> your name</li>
                <li><strong className="text-[#111111]">Contact data:</strong> email address</li>
                <li><strong className="text-[#111111]">Delivery data:</strong> shipping address</li>
                <li><strong className="text-[#111111]">Payment data:</strong> processed exclusively by Stripe — we never see or store your card number, CVC, or expiry date</li>
                <li><strong className="text-[#111111]">Account data:</strong> email and hashed password if you create an account</li>
                <li><strong className="text-[#111111]">Communication data:</strong> messages sent via the contact form</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111111] mb-3">3. How We Use Your Data</h2>
              <p>Your data is used only for the following purposes:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Processing and fulfilling your orders</li>
                <li>Sending order confirmation and shipping notifications</li>
                <li>Responding to customer service enquiries</li>
                <li>Maintaining your account and order history</li>
                <li>Complying with legal obligations (e.g. tax records)</li>
              </ul>
              <p className="mt-2">We do not use your data for marketing, profiling, or automated decision-making, and we do not sell your data to third parties.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111111] mb-3">4. Third-Party Services</h2>
              <p>We use the following trusted third-party services to operate our store:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li><strong className="text-[#111111]">Stripe</strong> — payment processing. Stripe operates under its own privacy policy and is PCI-DSS certified. We pass your name, email, and shipping address to Stripe to complete payment.</li>
                <li><strong className="text-[#111111]">Supabase</strong> — database and authentication. Your order data and account credentials are stored securely on Supabase-managed servers (AWS infrastructure, encrypted at rest).</li>
                <li><strong className="text-[#111111]">Google (Gmail)</strong> — used to send transactional emails (order confirmations, contact form replies).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111111] mb-3">5. Data Retention</h2>
              <p>We retain your personal data for as long as necessary to fulfil the purposes described above:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Order data is kept for 5 years to comply with Romanian accounting and tax law.</li>
                <li>Account data is kept until you delete your account.</li>
                <li>Contact form messages are kept for 12 months.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111111] mb-3">6. Your Rights under GDPR</h2>
              <p>As a data subject under GDPR, you have the right to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong className="text-[#111111]">Access</strong> — request a copy of the personal data we hold about you</li>
                <li><strong className="text-[#111111]">Rectification</strong> — request correction of inaccurate data</li>
                <li><strong className="text-[#111111]">Erasure</strong> — request deletion of your data ("right to be forgotten"), subject to legal retention requirements</li>
                <li><strong className="text-[#111111]">Portability</strong> — receive your data in a structured, machine-readable format</li>
                <li><strong className="text-[#111111]">Objection</strong> — object to processing where we rely on legitimate interests</li>
              </ul>
              <p className="mt-2">To exercise any of these rights, email us at <a href="mailto:contact@cnbcards.ro" className="text-f1-red hover:underline">contact@cnbcards.ro</a>. We will respond within 30 days. You also have the right to lodge a complaint with the Romanian data protection authority (ANSPDCP) at <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer" className="text-f1-red hover:underline">dataprotection.ro</a>.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111111] mb-3">7. Cookies</h2>
              <p>Our website uses minimal cookies — only those strictly necessary for the site to function (session management and Stripe's fraud prevention cookies). We do not use advertising or analytics cookies. No consent banner is required under GDPR for strictly necessary cookies.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111111] mb-3">8. Security</h2>
              <p>All data transmitted to and from our website is encrypted via HTTPS/TLS. Payment data is handled entirely by Stripe and never passes through our servers. Account passwords are never stored in plain text.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111111] mb-3">9. Contact</h2>
              <p>For any privacy concerns or data requests: <a href="mailto:contact@cnbcards.ro" className="text-f1-red hover:underline">contact@cnbcards.ro</a></p>
            </section>

          </div>
        </motion.div>
      </section>
      <Footer />
    </>
  );
}

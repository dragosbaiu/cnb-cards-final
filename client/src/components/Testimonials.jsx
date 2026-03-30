import { motion } from "motion/react";
import { useTranslation } from "../hooks/useTranslation";

const testimonials = [
  {
    name: "Andrei Popescu",
    text_en: "Amazing quality cards! The packaging was perfect — each card arrived in a top loader with extra protection. Will definitely order again.",
    text_ro: "Carduri de o calitate uimitoare! Ambalajul a fost perfect — fiecare card a ajuns în top loader cu protecție suplimentară. Voi comanda din nou cu siguranță.",
    rating: 5,
  },
  {
    name: "Maria Fischer",
    text_en: "Fast shipping to Germany and the cards were exactly as described. The Verstappen Chrome was in pristine condition. Highly recommend CNB Cards!",
    text_ro: "Livrare rapidă în Germania și cardurile au fost exact cum au fost descrise. Chrome-ul Verstappen era în stare impecabilă. Recomand cu încredere CNB Cards!",
    rating: 5,
  },
  {
    name: "Luca Marinescu",
    text_en: "Great selection of F1 singles. I've been looking for a Leclerc Chrome everywhere and found it here at a fair price. Excellent service!",
    text_ro: "Selecție excelentă de carduri F1. Am căutat un Leclerc Chrome peste tot și l-am găsit aici la un preț corect. Serviciu excelent!",
    rating: 5,
  },
  {
    name: "Sophie Laurent",
    text_en: "My son collects F1 cards and this shop has become our go-to. The condition grading is honest and accurate. Love the careful packaging too.",
    text_ro: "Fiul meu colecționează carduri F1 și acest magazin a devenit preferatul nostru. Gradarea stării este onestă și precisă. Adorăm și ambalarea atentă.",
    rating: 5,
  },
  {
    name: "Cristian Ionescu",
    text_en: "Ordered 4 cards and all arrived within 2 days. Each one was perfectly sleeved and protected. The best card shop I've found online.",
    text_ro: "Am comandat 4 carduri și toate au ajuns în 2 zile. Fiecare a fost perfect protejat în sleeve. Cel mai bun magazin de carduri pe care l-am găsit online.",
    rating: 5,
  },
  {
    name: "Elena Dumitrescu",
    text_en: "Authentic cards, fair prices, and the owner clearly cares about the hobby. Already placed my third order. Keep up the great work!",
    text_ro: "Carduri autentice, prețuri corecte, și proprietarul chiar ține la acest hobby. Am plasat deja a treia comandă. Continuați tot așa!",
    rating: 5,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  const { t, language } = useTranslation();

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#111111] tracking-tight text-center mb-12">
          {t("testimonials_title")}
        </h2>
        <motion.div
          className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="break-inside-avoid bg-[#F8F9FA] rounded-lg p-6 border border-[#E5E7EB]"
              variants={itemVariants}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <StarRating rating={testimonial.rating} />
              <p className="mt-3 text-sm text-[#4B5563] leading-relaxed">
                {language === "ro" ? testimonial.text_ro : testimonial.text_en}
              </p>
              <p className="mt-4 text-sm font-semibold text-[#111111]">
                {testimonial.name}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

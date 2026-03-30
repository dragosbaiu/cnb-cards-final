import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useTranslation } from "../hooks/useTranslation";
import { Waves } from "./ui/wave-background";

export function Hero() {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Waves background — full width */}
      <Waves
        strokeColor="#E10600"
        backgroundColor="#000000"
      />

      {/* Content layer */}
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-4">
        <div className="flex flex-col items-center text-center gap-6 max-w-4xl">
          <motion.h1
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white tracking-tight font-[Perandory]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t("hero_headline")}
          </motion.h1>

          <motion.p
            className="text-[1.15rem] md:text-[1.25rem] text-white max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t("hero_subheadline")}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center gap-4 mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              to="/shop/singles"
              className="px-8 py-3 bg-f1-red text-white font-bold rounded-lg hover:bg-red-700 transition-colors text-lg"
            >
              {t("hero_cta")}
            </Link>
            <a
              href="/about"
              className="px-8 py-3 text-white hover:text-white font-medium transition-colors text-lg"
            >
              {t("hero_secondary")}
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

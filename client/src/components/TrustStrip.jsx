import { motion } from "motion/react";
import { useTranslation } from "../hooks/useTranslation";

const trustItems = [
  { icon: "authentic", emoji: "\uD83D\uDD0D" },
  { icon: "packaging", emoji: "\uD83D\uDCE6" },
  { icon: "dispatch", emoji: "\u26A1" },
  { icon: "checkout", emoji: "\uD83D\uDCB3" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function TrustStrip() {
  const { t } = useTranslation();

  const items = trustItems.map((item) => ({
    ...item,
    title: t(`trust_${item.icon}_title`),
    desc: t(`trust_${item.icon}_desc`),
  }));

  return (
    <section className="bg-white py-12">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <motion.div
              key={item.icon}
              className="flex flex-col items-center text-center gap-2"
              variants={itemVariants}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <span className="text-[32px]">{item.emoji}</span>
              <h3 className="text-base font-semibold text-[#111111]">
                {item.title}
              </h3>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

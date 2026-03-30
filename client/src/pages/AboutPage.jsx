import { motion } from "motion/react";
import { useTranslation } from "../hooks/useTranslation";
import { usePageMeta } from "../hooks/usePageMeta";
import { Footer } from "../components/Footer";
import { Waves } from "../components/ui/wave-background";
import teamPicture from "@/assets/team-picture.jpg";

const values = [
  {
    key: "authenticity",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    key: "care",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
  {
    key: "passion",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
      </svg>
    ),
  },
];

export function AboutPage() {
  const { t } = useTranslation();
  usePageMeta({ title: t("seo_about_title"), description: t("seo_about_desc") });

  return (
    <>
      {/* Hero banner with Waves */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <Waves strokeColor="#E10600" backgroundColor="#000000" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            {t("about_headline")}
          </h1>
          <p className="mt-4 text-lg text-white leading-relaxed max-w-xl mx-auto">
            {t("about_subheadline")}
          </p>
        </div>
      </section>

      {/* Our Story */}
      <motion.section
        className="bg-white py-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#111111] tracking-tight">
                {t("about_story_title")}
              </h2>
              <p className="mt-6 text-[#4B5563] leading-relaxed">
                {t("about_story_p1")}
              </p>
              <p className="mt-4 text-[#4B5563] leading-relaxed">
                {t("about_story_p2")}
              </p>
            </div>
            <div className="rounded-lg overflow-hidden">
              <img
                src="https://placehold.co/500x400?text=Our+Story"
                alt="Our story"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Values strip */}
      <motion.section
        className="bg-gray-900 py-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {values.map((v) => (
              <div
                key={v.key}
                className="bg-white rounded-lg border border-[#E5E7EB] p-8 text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 text-f1-red mb-4">
                  {v.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#111111]">
                  {t(`about_value_${v.key}_title`)}
                </h3>
                <p className="mt-2 text-sm text-[#4B5563] leading-relaxed">
                  {t(`about_value_${v.key}_desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Meet the Team */}
      <motion.section
        className="bg-white py-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#111111] tracking-tight text-center mb-12">
            {t("about_team_title")}
          </h2>
          <div className="max-w-sm mx-auto text-center">
            <img
              src={teamPicture}
              alt={t("about_team_name")}
              className="w-28 h-28 rounded-full mx-auto object-cover"
            />
            <h3 className="mt-6 text-lg font-semibold text-[#111111]">
              {t("about_team_name")}
            </h3>
            <p className="mt-3 text-sm text-[#4B5563] leading-relaxed">
              {t("about_team_bio")}
            </p>
          </div>
        </div>
      </motion.section>

      <Footer />
    </>
  );
}

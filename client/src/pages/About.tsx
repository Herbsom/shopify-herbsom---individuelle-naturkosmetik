/*
 * About Page – Herbsom Über uns
 * Sektionen: Hero, Geschichte, Gründer, Werte, Team, Mission
 * Design: Elegante Serif-Typografie, Grüntöne #5B5B38, #7D7D5D, #424226
 */
import { useEffect, useRef } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
// Scroll reveal hook
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    const elements = ref.current?.querySelectorAll(".reveal");
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return ref;
}
export default function About() {
  const { t } = useTranslation();
  const pageRef = useScrollReveal();
  return (
    <div ref={pageRef} className="min-h-screen bg-[#F8F5F0]">
      <Navigation />
      {/* ─── HERO SECTION ─────────────────────────────────────────────── */}
      <section className="pt-32 md:pt-40 pb-24 md:pb-36">
        <div className="container">
          <div className="max-w-3xl">
            <p className="section-label text-[#5B5B38] mb-4 reveal">
              Unsere Geschichte
            </p>
            <h1
              className="font-display text-5xl md:text-7xl lg:text-8xl text-[#1C1C1A] leading-[0.95] mb-8 reveal reveal-delay-1"
            >
              Aus Münster<br />
              <em className="italic">für deine Haut.</em>
            </h1>
            <p className="font-body text-lg text-[#4A4A48] leading-relaxed max-w-2xl reveal reveal-delay-2">
              Alles begann mit einer einfachen Überzeugung: Hautpflege sollte so individuell sein wie die Menschen, die sie verwenden. Mittlerweile ist daraus eine gesamte hocheffektive und individuelle Hautpflegelinie gewachsen.
            </p>
          </div>
        </div>
      </section>
      {/* ─── STORY SECTION ────────────────────────────────────────────── */}
      <section className="py-24 md:py-36 bg-[#5B5B38]">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <p className="section-label text-[#7D7D5D] mb-8 reveal">Die Gründungsgeschichte</p>
            <h2
              className="font-display text-4xl md:text-6xl text-[#F8F5F0] font-light leading-tight mb-12 reveal reveal-delay-1"
            >
              „Wir wussten sofort: Jeder braucht diese Creme!"
            </h2>
            <div className="space-y-6 reveal reveal-delay-2">
              <p className="font-body text-base text-[#E8E3DB] leading-relaxed">
                Alles begann mit Alica und Kathrin und einer innovativen Idee: „Eine Creme, individuell zugeschnitten auf meine Hautbedürfnisse." Sie erkannten schnell, dass herkömmliche Hautpflegeprodukte nicht wirklich funktionieren – weil sie nicht auf die individuellen Bedürfnisse jeder einzelnen Haut abgestimmt sind.
              </p>
              <p className="font-body text-base text-[#E8E3DB] leading-relaxed">
                Mit dieser Vision gründeten sie Herbsom und entwickelten ein System, das es jedem ermöglicht, seine perfekte Hautpflege zu finden. Mittlerweile vertrauen über 20.000 Kunden auf ihre individuelle Herbsom-Formel.
              </p>
              <p className="font-body text-base text-[#E8E3DB] leading-relaxed">
                Heute ist Herbsom mehr als nur ein Hautpflegeprodukt – es ist eine Bewegung hin zu persönlicher, wissenschaftlich fundierter Hautpflege, die wirklich funktioniert.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* ─── FOUNDERS IMAGE SECTION ──────────────────────────────────── */}
      <section className="py-24 md:py-36">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Founders Image */}
            <div className="reveal">
              <img
                src="/manus-storage/064-pasted_file_Uwbp89_IMG_6177_9f3c4d13-9e69e26e_9f0cfa2d.jpg"
                alt="Herbsom Store mit Gründerinnen"
                className="w-full h-auto rounded-sm"
              />
            </div>
            {/* Text */}
            <div className="reveal">
              <p className="section-label text-[#5B5B38] mb-4">Unsere Gründerinnen</p>
              <h3
                className="font-display text-3xl md:text-4xl text-[#1C1C1A] font-light mb-6"
              >
                Alica & Kathrin
              </h3>
              <p className="font-body text-base text-[#4A4A48] leading-relaxed mb-4">
                Mit Leidenschaft für Hautpflege und einem tiefen Verständnis für die Bedürfnisse ihrer Kunden, gründeten Alica und Kathrin Herbsom. Ihr Ziel war klar: Hautpflege, die wirklich funktioniert – weil sie auf die individuellen Bedürfnisse jeder Haut abgestimmt ist.
              </p>
              <p className="font-body text-base text-[#4A4A48] leading-relaxed">
                Heute leiten sie ein wachsendes Team von Hautpflege-Experten und Wissenschaftlern, die täglich daran arbeiten, die beste individuelle Hautpflege zu entwickeln.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* ─── LAB IMAGE SECTION ────────────────────────────────────────── */}
      <section className="py-24 md:py-36 bg-[#F0EBE3]">
        <div className="container">
          <div className="mb-12 reveal">
            <p className="section-label text-[#5B5B38] mb-3">Unsere Entwicklung</p>
            <h3
              className="font-display text-3xl md:text-4xl text-[#1C1C1A] font-light"
            >
              Wissenschaft trifft Natur
            </h3>
          </div>
          <div className="reveal">
            <img
              src="/manus-storage/035-gruenderin_norderney2_adb1f6a3-98e15ceb_01bba88d.jpg"
              alt="Herbsom Gründerin Norderney"
              className="w-full h-auto rounded-sm"
            />
          </div>
        </div>
      </section>
      {/* ─── VALUES SECTION ───────────────────────────────────────────── */}
      <section className="py-24 md:py-36">
        <div className="container">
          <div className="mb-16 reveal">
            <p className="section-label mb-3">Unsere Werte</p>
            <h2
              className="font-display text-4xl md:text-6xl text-[#1C1C1A] font-light"
            >
              Was uns antreibt.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#D5CFC7]">
            {[
              {
                number: "01",
                title: "Individuell",
                description: "Jede Haut ist einzigartig und verdient individuelle Pflege. Wir entwickeln jede Formel speziell für deine Hautbedürfnisse, nicht für eine Masse.",
              },
              {
                number: "02",
                title: "Wirksam",
                description: "Optimale Wirkstoffkonzentrationen, speziell auf deine Hautbedürfnisse abgestimmt. Konzentriert auf das Wesentliche – ohne unnötige Füllstoffe.",
              },
              {
                number: "03",
                title: "Transparent",
                description: "Wir glauben an Transparenz. Du kennst genau, welche Wirkstoffe in deiner Formel sind und warum sie für deine Haut richtig sind.",
              },
            ].map((value, i) => (
              <div
                key={value.number}
                className={`bg-[#F8F5F0] p-10 md:p-12 reveal reveal-delay-${i + 1}`}
              >
                <span
                  className="font-display text-6xl text-[#E5E0D8] font-light block mb-8"
                >
                  {value.number}
                </span>
                <h3
                  className="font-display text-2xl text-[#1C1C1A] mb-4 font-light"
                >
                  {value.title}
                </h3>
                <p className="font-body text-sm text-[#6B6B69] leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ─── MISSION SECTION ──────────────────────────────────────────── */}
      <section className="py-24 md:py-36 bg-[#F0EBE3]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center reveal">
            <p className="section-label mb-5">Unsere Mission</p>
            <h2
              className="font-display text-4xl md:text-6xl text-[#1C1C1A] font-light mb-8"
            >
              Perfekt auf dich<br />
              <em className="italic">abgestimmt.</em>
            </h2>
            <p className="font-body text-base text-[#6B6B69] leading-relaxed mb-10 max-w-2xl mx-auto reveal reveal-delay-1">
              Wir glauben, dass hocheffektive Hautpflege nicht kompliziert sein muss. Mit unserem intelligenten Hauttest und wissenschaftlich fundierten Formeln helfen wir dir, deine perfekte Hautpflege zu finden – individuell, wirksam und transparent.
            </p>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.location.href = "/hauttest"; }}
              className="btn-outline-dark inline-flex items-center gap-2 reveal reveal-delay-2"
            >
              Hauttest starten <ArrowRight size={14} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </section>
      {/* ─── STATS SECTION ────────────────────────────────────────────── */}
      <section className="py-24 md:py-36 bg-[#5B5B38]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {[
              { number: "20.000+", label: "Zufriedene Kunden" },
              { number: "4,9/5", label: "Durchschnittliche Bewertung" },
              { number: "2021", label: "Gegründet in Münster" },
            ].map((stat, i) => (
              <div key={i} className={`text-center reveal reveal-delay-${i + 1}`}>
                <div
                  className="font-display text-5xl md:text-6xl text-[#F8F5F0] font-light mb-3"
                >
                  {stat.number}
                </div>
                <p className="font-body text-sm text-[#7D7D5D] tracking-[0.1em] uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ─── CTA SECTION ──────────────────────────────────────────────── */}
      <section className="py-24 md:py-36 bg-[#F8F5F0]">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center reveal">
            <h2
              className="font-display text-4xl md:text-6xl text-[#1C1C1A] font-light mb-8"
            >
              Entdecke deine<br />
              <em className="italic">individuelle Formel.</em>
            </h2>
            <p className="font-body text-base text-[#6B6B69] leading-relaxed mb-10 max-w-md mx-auto reveal reveal-delay-1">
              Beantworte unseren intelligenten Hauttest und erhalte deine persönliche Hautpflege-Empfehlung. Kostenlos und unverbindlich.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 reveal reveal-delay-2">
            <a
              href="/hauttest"
              className="btn-outline-dark"
            >
              Hauttest starten
            </a>
              <a
                href="/#produkte"
                className="btn-outline-dark"
              >
                Produkte entdecken
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

/*
 * Home Page – Herbsom Skandinavisches Labor
 * Sektionen: Hero, Produkte, Hauttest, Über uns, Werte, echte Bewertungen, Newsletter
 * Design: Nordischer Minimalismus × Pharmazeutische Präzision
 * Farben: Cremeweiß (#F8F5F0) ↔ Dunkelgrün (#5B5B38), Salbeigrün (#7D7D5D), Tiefgrün (#424226)
 * Typografie: Cormorant Garamond (Display) + Inter (Body)
 */
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TopReviews from "@/components/TopReviews";
import { ArrowRight, ChevronRight } from "lucide-react";
import { HOME_IMAGES } from "@/lib/homeAssets";
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
export default function Home() {
  const { t } = useTranslation();

  const pageRef = useScrollReveal();
  const products = [
    {
      id: 1,
      label: "01",
      name: t("products.serum"),
      description: t("homepage.products_serum_desc"),
      tag: t("homepage.bestseller"),
      href: "/hauttest?product=serum",
      image: HOME_IMAGES.productSerum,
    },
    {
      id: 2,
      label: "02",
      name: t("products.cream"),
      description: t("homepage.products_cream_desc"),
      tag: t("homepage.new"),
      href: "/hauttest?product=creme",
      image: HOME_IMAGES.productCream,
    },
    {
      id: 3,
      label: "03",
      name: t("products.cleanser"),
      description: t("homepage.products_cleanser_desc"),
      tag: "",
      href: "/cleaners",
      image: HOME_IMAGES.productCleanser,
    },
    {
      id: 4,
      label: "04",
      name: t("products.peeling"),
      description: t("homepage.products_peeling_desc"),
      tag: "",
      href: "/peelings",
      image: HOME_IMAGES.productPeeling,
    },
  ];
  const values = [
    {
      number: "01",
      title: t("homepage.personalized"),
      text: t("homepage.personalized_desc"),
    },
    {
      number: "02",
      title: t("homepage.natural"),
      text: t("homepage.natural_desc"),
    },
    {
      number: "03",
      title: t("homepage.effective"),
      text: t("homepage.effective_desc"),
    },
  ];
  return (
    <div ref={pageRef} className="min-h-screen bg-[#F8F5F0]">
      <Navigation />
      {/* ─── HERO SECTION ─────────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HOME_IMAGES.hero})` }}
        />
        {/* Subtle overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F8F5F0]/80 via-[#F8F5F0]/30 to-transparent" />
        {/* Hero Content */}
        <div className="relative h-full container flex flex-col justify-end pb-20 md:pb-28">
          <div className="max-w-xl">
            <p className="section-label text-[#5B5B38] mb-4 reveal">
              {t("homepage.subtitle")}
            </p>
            <h1
              className="font-display text-5xl md:text-7xl lg:text-8xl text-[#1C1C1A] leading-[0.95] mb-6 reveal reveal-delay-1"
            >
              {t("homepage.hero_title")}<br />
              <em className="italic">{t("homepage.hero_formula")}</em>
            </h1>
            <p className="font-body text-sm md:text-base text-[#4A4A48] leading-relaxed mb-10 max-w-sm reveal reveal-delay-2">
              {t("homepage.hero_subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4 reveal reveal-delay-3">
              <a href="/hauttest" className="btn-outline-dark">
                {t("homepage.cta_skin_test")}
              </a>
              <a href="#produkte" className="btn-outline-dark">
                {t("homepage.cta_shop")}
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* ─── ANNOUNCEMENT STRIP ───────────────────────────────────────── */}
      <div className="bg-[#5B5B38] py-3 overflow-hidden">
        <div className="container">
          <p className="font-body text-[11px] tracking-[0.2em] uppercase text-[#7D7D5D] text-center">
            {t("homepage.announcement")}
          </p>
        </div>
      </div>
      {/* ─── BEKANNT AUS SECTION ──────────────────────────────────────── */}
      <section className="py-12 md:py-16 bg-[#F8F5F0] border-b border-[#D5CFC7]">
        <div className="container">
          <p className="font-body text-[11px] tracking-[0.2em] uppercase text-[#7D7D5D] text-center mb-8 reveal">
            {t("homepage.featured_in")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
            {[
              { name: "Brigitte", logo: "BRIGITTE" },
              { name: "InTouch", logo: "INTOUCH" },
              { name: "Closer", logo: "CLOSER" },
              { name: "Welt", logo: "WELT" },
              { name: "Douglas", logo: "DOUGLAS" },
            ].map((publication, i) => (
              <div key={publication.name} className={`reveal reveal-delay-${i + 1} flex-shrink-0`}>
                <div className="font-display text-lg md:text-xl text-[#5B5B38] font-light tracking-wider opacity-70 hover:opacity-100 transition-opacity duration-300">
                  {publication.logo}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ─── PRODUKTE SECTION ─────────────────────────────────────────── */}
      <section id="produkte" className="py-24 md:py-36">
        <div className="container">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
            <div className="reveal">
              <p className="section-label mb-3">{t("homepage.our_range")}</p>
              <h2
                className="font-display text-4xl md:text-6xl text-[#1C1C1A] font-light"
              >
                {t("homepage.care_title")}<br />
                <em className="italic">{t("homepage.care_works")}</em>
              </h2>
            </div>
            <a
              href="/products"
              className="flex items-center gap-2 font-body text-xs tracking-[0.15em] uppercase text-[#5B5B38] hover:gap-4 transition-all duration-300 reveal reveal-delay-2"
            >
              {t("homepage.all_products")} <ArrowRight size={14} strokeWidth={1.5} />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#D5CFC7]">
            {products.map((product, i) => (
              <a
                key={product.id}
                href={product.href}
                className={`bg-[#F8F5F0] p-8 md:p-12 group cursor-pointer hover:bg-[#F0EBE3] transition-colors duration-500 reveal reveal-delay-${i + 1} block flex flex-col`}
              >
                {product.image && (
                  <div
                    className="w-full h-64 md:h-72 bg-cover bg-center mb-8 rounded-sm"
                    style={{ backgroundImage: `url(${product.image})` }}
                  />
                )}
                <div className="flex items-start justify-between mb-8">
              <span className="font-display text-5xl text-[#E5E0D8] font-light">
                {product.label}
              </span>
              {product.tag && product.tag !== "" && (
                <span className="font-body text-[10px] tracking-[0.15em] uppercase text-[#7D7D5D] border border-[#7D7D5D] px-2 py-1">
                  {product.tag}
                </span>
              )}
                </div>
                <h3
                  className="font-display text-2xl md:text-3xl text-[#1C1C1A] mb-4 font-light"
                >
                  {product.name}
                </h3>
                <p className="font-body text-sm text-[#6B6B69] leading-relaxed mb-8">
                  {product.description}
                </p>
                <div className="flex items-center gap-2 font-body text-[11px] tracking-[0.15em] uppercase text-[#5B5B38] group-hover:gap-4 transition-all duration-300">
                  Entdecken <ChevronRight size={12} strokeWidth={1.5} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      {/* ─── EDITORIAL SPLIT: INGREDIENTS ────────────────────────────── */}
      <section className="bg-[#5B5B38] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
          {/* Image */}
          <div
            className="relative h-72 md:h-auto bg-cover bg-center"
            style={{ backgroundImage: `url(${HOME_IMAGES.ingredients})` }}
          />
          {/* Content */}
          <div className="flex flex-col justify-center px-8 md:px-16 lg:px-20 py-16 md:py-24">
            <p className="section-label text-[#7D7D5D] mb-5 reveal">Unsere Philosophie</p>
            <h2
              className="font-display text-4xl md:text-5xl lg:text-6xl text-[#F8F5F0] font-light leading-tight mb-8 reveal reveal-delay-1"
            >
              Wirkstoffe,<br />
              <em className="italic">optimal auf</em><br />
              dich zugeschnitten.
            </h2>
            <p className="font-body text-sm text-[#A8B8A6] leading-relaxed mb-10 max-w-sm reveal reveal-delay-2">
              Wir kombinieren die Kraft der Natur mit wissenschaftlicher Präzision. Jede Formel wird individuell für deinen Hauttyp, deine Bedürfnisse und deine Ziele entwickelt.
            </p>
            <a
              href="/about"
              className="btn-outline-light self-start reveal reveal-delay-3"
            >
              Mehr erfahren
            </a>
          </div>
        </div>
      </section>
      {/* ─── HAUTTEST SECTION ─────────────────────────────────────────── */}
      <section id="hauttest" className="py-24 md:py-36 bg-[#F0EBE3]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
            {/* Content */}
            <div>
              <p className="section-label mb-5 reveal">Dein Weg zur perfekten Pflege</p>
              <h2
                className="font-display text-4xl md:text-6xl text-[#1C1C1A] font-light leading-tight mb-8 reveal reveal-delay-1"
              >
                Intelligenter<br />
                <em className="italic">Hauttest.</em>
              </h2>
              <p className="font-body text-sm text-[#6B6B69] leading-relaxed mb-6 reveal reveal-delay-2">
                Beantworte 11 Fragen über deine Haut und unser Algorithmus erstellt deine persönliche Hautpflege-Empfehlung. Präzise. Individuell. Wirksam.
              </p>
              {/* Steps */}
              <div className="space-y-5 mb-10">
                {[
                  { step: "01", text: "11 Fragen zu deiner Haut beantworten" },
                  { step: "02", text: "Algorithmus analysiert deinen Hauttyp" },
                  { step: "03", text: "Deine individuelle Formel wird erstellt" },
                ].map((item, i) => (
                  <div key={item.step} className={`flex items-center gap-5 reveal reveal-delay-${i + 2}`}>
                    <span
                      className="font-display text-3xl text-[#7D7D5D] font-light w-10 flex-shrink-0"
                    >
                      {item.step}
                    </span>
                    <div className="h-px flex-1 bg-[#D5CFC7]" />
                    <p className="font-body text-sm text-[#4A4A48] text-right">{item.text}</p>
                  </div>
                ))}
              </div>
              <a
                href="/hauttest"
                className="btn-outline-dark reveal reveal-delay-4"
              >
                Jetzt Hauttest starten
              </a>
            </div>
            {/* Image */}
            <div className="relative reveal reveal-delay-2">
              <div
                className="aspect-[3/4] bg-cover bg-center"
                style={{ backgroundImage: `url(${HOME_IMAGES.ritual})` }}
              />
              {/* Floating stat card */}
              <div className="absolute -bottom-6 -left-6 bg-[#5B5B38] p-6 hidden md:block">
                <div
                  className="font-display text-4xl text-[#F8F5F0] font-light mb-1"
                >
                  20.000
                </div>
                <p className="font-body text-[11px] tracking-[0.15em] uppercase text-[#7D7D5D]">
                  Zufriedene Kunden
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ─── WERTE SECTION ────────────────────────────────────────────── */}
      <section id="ueber-uns" className="py-24 md:py-36">
        <div className="container">
          <div className="mb-16 reveal">
            <p className="section-label mb-3">Unsere Überzeugungen</p>
            <h2
              className="font-display text-4xl md:text-6xl text-[#1C1C1A] font-light"
            >
              Was uns antreibt.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#D5CFC7]">
            {values.map((value, i) => (
              <div key={value.number} className={`bg-[#F8F5F0] p-10 md:p-12 reveal reveal-delay-${i + 1}`}>
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
                  {value.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ─── FEATURED PRODUCT: SONNENSCHUTZ ────────────────────────────── */}
      <section className="py-24 md:py-36 bg-[#F8F5F0]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="relative reveal">
              <div
                className="aspect-[4/3] bg-cover bg-center"
                style={{ backgroundImage: `url(${HOME_IMAGES.sunscreen})` }}
              />
              <div className="absolute top-6 left-6 bg-[#5B5B38] px-4 py-2">
                <span className="font-body text-[10px] tracking-[0.2em] uppercase text-[#7D7D5D]">Neu</span>
              </div>
            </div>
            <div>
              <p className="section-label mb-5 reveal">Sonnenschutz</p>
              <h2
                className="font-display text-4xl md:text-5xl text-[#1C1C1A] font-light leading-tight mb-6 reveal reveal-delay-1"
              >
                Sonnenschutzfluid<br />
                <em className="italic">SPF 50+</em>
              </h2>
              <p className="font-body text-sm text-[#6B6B69] leading-relaxed mb-4 reveal reveal-delay-2">
                Unser leichtes Sonnenschutzfluid schützt deine Haut effektiv vor UVA, UVB und Blaulicht. Leichte Textur, kein weißer Schleier, ideal für jeden Tag.
              </p>
              <ul className="space-y-2 mb-10 reveal reveal-delay-2">
                {["Schutz vor UVA, UVB & Blaulicht", "Leichte, nicht fettende Textur", "Geeignet für alle Hauttypen", "Dermatologisch getestet"].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 font-body text-sm text-[#4A4A48]">
                    <span className="w-1 h-1 rounded-full bg-[#7D7D5D] flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="/product/sunscreen"
                className="btn-outline-dark reveal reveal-delay-3"
              >
                Jetzt bestellen
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
          {/* Content */}
          <div className="flex flex-col justify-center px-8 md:px-16 lg:px-20 py-16 md:py-24 bg-[#E8E3DB] order-2 md:order-1">
            <p className="section-label mb-5 reveal">Unsere Geschichte</p>
            <h2
              className="font-display text-4xl md:text-5xl text-[#1C1C1A] font-light leading-tight mb-8 reveal reveal-delay-1"
            >
              Aus Münster<br />
              <em className="italic">für deine Haut.</em>
            </h2>
            <p className="font-body text-sm text-[#6B6B69] leading-relaxed mb-10 max-w-sm reveal reveal-delay-2">
              Herbsom wurde mit einer einfachen Überzeugung gegründet: Hautpflege sollte so individuell sein wie die Menschen, die sie verwenden. Wir entwickeln jede Formel mit Sorgfalt und wissenschaftlicher Präzision.
            </p>
            <a
              href="/about"
              className="btn-outline-dark self-start reveal reveal-delay-3"
            >
              Unsere Geschichte
            </a>
          </div>
          {/* Image */}
          <div
            className="relative h-72 md:h-auto bg-cover bg-center order-1 md:order-2"
            style={{ backgroundImage: `url(${HOME_IMAGES.products})` }}
          />
        </div>
      </section>
      {/* ─── ECHTE FREIGEGEBENE BEWERTUNGEN ───────────────────────────── */}
      <div id="wissen">
        <TopReviews />
      </div>
      {/* ─── TEXTURE / PRODUCT CLOSE-UP ───────────────────────────────── */}
      <section className="relative h-[50vh] min-h-[300px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HOME_IMAGES.texture})` }}
        />
        <div className="absolute inset-0 bg-[#F8F5F0]/30" />
        <div className="relative h-full container flex items-center justify-center">
          <div className="text-center reveal">
            <p className="section-label text-[#5B5B38] mb-4">Qualität, die man spürt</p>
            <h2
              className="font-display text-4xl md:text-6xl text-[#1C1C1A] font-light"
            >
              Reine Wirkstoffe.<br />
              <em className="italic">Sichtbare Ergebnisse.</em>
            </h2>
          </div>
        </div>
      </section>
      {/* ─── CTA SECTION ──────────────────────────────────────────────── */}
      <section className="py-12 md:py-16 bg-[#F8F5F0]">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center reveal">
            <p className="section-label mb-5">Starte jetzt</p>
            <h2
              className="font-display text-4xl md:text-6xl text-[#1C1C1A] font-light mb-8"
            >
              Entdecke deine<br />
              <em className="italic">individuelle Formel.</em>
            </h2>
            <p className="font-body text-sm text-[#6B6B69] leading-relaxed mb-12 max-w-md mx-auto reveal reveal-delay-1">
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
                href="/products"
                className="btn-outline-dark"
              >
                Zum Shop
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

/**
 * Blog Page – Herbsom Naturkosmetik
 * Design: Elegante Serif-Typografie, Grüntöne #5B5B38, #7D7D5D, #424226
 * Artikel zu Hautpflege, Inhaltsstoffen und Skincare-Tipps
 */
import { useState } from "react";
import { ArrowRight, Calendar, User } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
export default function Blog() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;
  const articles = [
    {
      id: 1,
      title: "Die Kraft der Hyaluronsäure",
      excerpt: "Erfahre, warum Hyaluronsäure das Geheimnis für strahlende, pralle Haut ist und wie du sie optimal nutzt.",
      category: "Wirkstoffe",
      author: "Dr. Sarah Meyer",
      date: "15. Juni 2026",
      image: "🧪",
      readTime: "5 min",
    },
    {
      id: 2,
      title: "Hauttypen verstehen",
      excerpt: "Lerne die verschiedenen Hauttypen kennen und finde heraus, welche Pflege zu deiner Haut passt.",
      category: "Grundlagen",
      author: "Alica Herbsom",
      date: "12. Juni 2026",
      image: "🔍",
      readTime: "7 min",
    },
    {
      id: 3,
      title: "Natürliche Inhaltsstoffe vs. Chemie",
      excerpt: "Warum natürliche Inhaltsstoffe nicht automatisch besser sind – und wie wir die beste Balance finden.",
      category: "Wirkstoffe",
      author: "Kathrin Herbsom",
      date: "10. Juni 2026",
      image: "🌿",
      readTime: "8 min",
    },
    {
      id: 4,
      title: "Die perfekte Skincare-Routine",
      excerpt: "Schritt-für-Schritt Anleitung für eine effektive Morgen- und Abendroutine mit Herbsom Produkten.",
      category: "Anwendung",
      author: "Dr. Sarah Meyer",
      date: "8. Juni 2026",
      image: "✨",
      readTime: "6 min",
    },
    {
      id: 5,
      title: "Sonnenschutz im Sommer",
      excerpt: "Warum Sonnenschutz das ganze Jahr über wichtig ist und wie du deine Haut optimal schützt.",
      category: "Tipps",
      author: "Alica Herbsom",
      date: "5. Juni 2026",
      image: "☀️",
      readTime: "5 min",
    },
    {
      id: 6,
      title: "Vitamin C – Der Glow-Booster",
      excerpt: "Entdecke die Wirkung von Vitamin C und wie es deine Haut strahlender und ebenmäßiger macht.",
      category: "Wirkstoffe",
      author: "Dr. Sarah Meyer",
      date: "1. Juni 2026",
      image: "🍊",
      readTime: "6 min",
    },
  ];
  const categories = ["all", "Wirkstoffe", "Grundlagen", "Anwendung", "Tipps"];
  const filteredArticles =
    selectedCategory === "all"
      ? articles
      : articles.filter((a) => a.category === selectedCategory);
  
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + articlesPerPage);
  
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };
  return (
    <div className="min-h-screen bg-[#F8F5F0] flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20 md:pt-24">
        {/* ─── HERO SECTION ─────────────────────────────────────────── */}
        <section className="py-16 md:py-24 bg-[#5B5B38]">
          <div className="container max-w-4xl">
            <div className="text-center">
              <span className="inline-block font-body text-xs tracking-[0.15em] uppercase text-[#7D7D5D] border border-[#7D7D5D] px-3 py-1 mb-6">
                Wissen & Tipps
              </span>
              <h1
                className="font-display text-4xl md:text-5xl text-[#F8F5F0] mb-6 font-light"
              >
                Herbsom Blog
              </h1>
              <p className="font-body text-base text-[#E8E3DB] leading-relaxed">
                Entdecke Artikel über Hautpflege, Wirkstoffe und Skincare-Tipps von unseren Experten.
              </p>
            </div>
          </div>
        </section>
        {/* ─── FILTER SECTION ─────────────────────────────────────────── */}
        <section className="py-12 md:py-16">
          <div className="container max-w-4xl">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`font-body text-xs tracking-[0.12em] uppercase px-4 py-2 border transition-all duration-300 ${
                    selectedCategory === cat
                      ? "bg-[#5B5B38] text-[#F8F5F0] border-[#5B5B38]"
                      : "bg-transparent text-[#5B5B38] border-[#5B5B38] hover:bg-[#5B5B38] hover:text-[#F8F5F0]"
                  }`}
                >
                  {cat === "all" ? "Alle Artikel" : cat}
                </button>
              ))}
            </div>
          </div>
        </section>
        {/* ─── ARTICLES GRID ─────────────────────────────────────────── */}
        <section className="py-16 md:py-24">
          <div className="container max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {paginatedArticles.map((article) => {
                const articleUrls: Record<number, string> = {
                  1: "/blog/hyaluronsaeure",
                  2: "/blog/hauttypen",
                  3: "/blog/inhaltsstoffe",
                  4: "/blog/routine",
                  5: "/blog/sonnenschutz",
                  6: "/blog/vitamin-c",
                };
                const articleUrl = articleUrls[article.id] || "/blog";
                return (
                <Link key={article.id} href={articleUrl}>
                  <article className="group cursor-pointer transition-all duration-300 hover:opacity-80">
                    {/* Image */}
                    <div className="bg-[#F0EBE3] rounded-sm aspect-video flex items-center justify-center mb-6 overflow-hidden group-hover:scale-105 transition-transform duration-500">
                      <div className="text-6xl">{article.image}</div>
                    </div>
                    {/* Content */}
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="inline-block font-body text-[10px] tracking-[0.15em] uppercase text-[#7D7D5D] border border-[#7D7D5D] px-2 py-1">
                          {article.category}
                        </span>
                        <span className="font-body text-xs text-[#7D7D5D]">
                          {article.readTime}
                        </span>
                      </div>
                      <h3 className="font-display text-2xl text-[#1C1C1A] mb-3 font-light group-hover:text-[#5B5B38] transition-colors">
                        {article.title}
                      </h3>
                      <p className="font-body text-sm text-[#6B6B69] leading-relaxed mb-4">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-[#E5E0D8]">
                        <div className="flex items-center gap-3">
                          <span className="font-body text-xs text-[#7D7D5D]">
                            {article.author}
                          </span>
                          <span className="font-body text-xs text-[#7D7D5D]">
                            {article.date}
                          </span>
                        </div>
                        <ArrowRight
                          size={16}
                          className="text-[#5B5B38] group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </div>
                  </article>
                </Link>
              );
              })
              }
            </div>
            {paginatedArticles.length === 0 && (
              <div className="text-center py-12">
                <p className="font-body text-base text-[#6B6B69]">
                  Keine Artikel in dieser Kategorie gefunden.
                </p>
              </div>
            )}
          </div>
        </section>
        {/* ─── PAGINATION ─────────────────────────────────────────── */}
        {totalPages > 1 && (
          <section className="py-12 md:py-16 border-t border-[#E5E0D8]">
            <div className="container max-w-5xl">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="font-body text-xs tracking-[0.12em] uppercase px-4 py-2 border border-[#5B5B38] text-[#5B5B38] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#5B5B38] hover:text-[#F8F5F0] transition-all duration-300"
                >
                  Zurück
                </button>
                <div className="flex items-center gap-1 flex-wrap">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`font-body text-xs tracking-[0.12em] uppercase px-3 py-2 border transition-all duration-300 ${
                        currentPage === page
                          ? "bg-[#5B5B38] text-[#F8F5F0] border-[#5B5B38]"
                          : "bg-transparent text-[#5B5B38] border-[#5B5B38] hover:bg-[#5B5B38] hover:text-[#F8F5F0]"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="font-body text-xs tracking-[0.12em] uppercase px-4 py-2 border border-[#5B5B38] text-[#5B5B38] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#5B5B38] hover:text-[#F8F5F0] transition-all duration-300"
                >
                  Weiter
                </button>
              </div>
              <p className="text-center font-body text-xs text-[#7D7D5D] mt-4">
                Seite {currentPage} von {totalPages}
              </p>
            </div>
          </section>
        )}
        {/* ─── CTA SECTION ──────────────────────────────────────────── */}
        <section className="py-16 md:py-24 bg-[#5B5B38]">
          <div className="container max-w-3xl text-center">
            <h2
              className="font-display text-3xl md:text-4xl text-[#F8F5F0] mb-6 font-light"
            >
              Bereit für deine individuelle Hautpflege?
            </h2>
            <p className="font-body text-base text-[#E8E3DB] mb-8 leading-relaxed">
              Starte unseren intelligenten Hauttest und erhalte personalisierte Produktempfehlungen.
            </p>
            <a
              href="/hauttest"
              className="inline-block border border-[#F8F5F0] text-[#F8F5F0] font-body text-xs tracking-[0.12em] uppercase px-8 py-3 hover:bg-[#F8F5F0] hover:text-[#5B5B38] transition-all duration-300"
            >
              Hauttest starten
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

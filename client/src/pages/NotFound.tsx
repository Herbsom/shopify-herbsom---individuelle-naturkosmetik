/*
 * 404 Not Found – Herbsom Skandinavisches Labor
 */
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#F8F5F0] flex flex-col items-center justify-center px-6 text-center">
      <span
        className="font-display text-[120px] md:text-[180px] text-[#E5E0D8] leading-none font-light select-none"
      >
        404
      </span>
      <h1
        className="font-display text-3xl md:text-4xl text-[#1C1C1A] font-light mt-4 mb-4"
      >
        Seite nicht gefunden.
      </h1>
      <p className="font-body text-sm text-[#6B6B69] mb-10 max-w-sm leading-relaxed">
        Die gesuchte Seite existiert nicht oder wurde verschoben. Kehre zur Startseite zurück.
      </p>
      <Link href="/">
        <span className="btn-outline-dark">Zur Startseite</span>
      </Link>
    </div>
  );
}

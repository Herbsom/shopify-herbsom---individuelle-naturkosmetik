/*
 * Footer – Herbsom Skandinavisches Labor
 * Dunkelgrüner Hintergrund, heller Text, Newsletter, Links, Social Media
 */

import { useState } from "react";
import { toast } from "sonner";
import { Instagram, Linkedin, Facebook } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { t } = useTranslation();

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success(t("footer.newsletter_thanks", "Danke! Du wirst bald von uns hören."));
      setEmail("");
    }
  };

  const produkteLinks = [
    { label: t("nav.custom_cream"), href: "/configurator/creme" },
    { label: t("nav.custom_serum"), href: "/configurator/serum" },
    { label: t("nav.cleanser"), href: "/cleaners" },
    { label: t("nav.peelings"), href: "/peelings" },
  ];

  const aboutLinks = [
    { label: t("footer.our_story", "Unsere Geschichte"), href: "/about" },
    { label: t("footer.our_values", "Unsere Werte"), href: "/about" },
    { label: t("footer.our_skin", "Unsere Haut"), href: "/about" },
    { label: t("nav.skintest"), href: "/hauttest" },
  ];

  const legalLinks = [
    { label: t("navigation.shipping_returns"), href: "/shipping" },
    { label: t("navigation.privacy"), href: "/privacy" },
    { label: t("navigation.terms"), href: "/terms" },
    { label: t("navigation.withdrawal"), href: "/withdrawal" },
    { label: t("navigation.impressum"), href: "/impressum" },
  ];

  return (
    <footer className="bg-[#3D3D24] text-[#F8F5F0]">
      {/* Newsletter Strip */}
      <div className="border-b border-[#4A4A2E]">
        <div className="container py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <p className="section-label text-[#A8A88D] mb-3">Newsletter</p>
              <h3
                className="font-display text-3xl md:text-4xl text-[#F8F5F0] font-light"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {t("footer.newsletter_title", "Bleib auf dem Laufenden.")}
              </h3>
            </div>
            <form onSubmit={handleNewsletter} className="flex gap-0 w-full md:w-auto md:min-w-[400px]">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("footer.email_placeholder", "Deine E-Mail-Adresse")}
                required
                className="flex-1 bg-transparent border border-[#4A4A2E] px-4 py-3 text-[#F8F5F0] placeholder-[#8A8A72] font-body text-sm focus:outline-none focus:border-[#A8A88D] transition-colors duration-300"
              />
              <button
                type="submit"
                className="bg-[#5B5B38] text-[#F8F5F0] px-6 py-3 font-body text-[11px] tracking-[0.15em] uppercase hover:bg-[#4A4A2E] transition-colors duration-300"
              >
                {t("footer.send", "Senden")}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <img
              src="https://cdn.shopify.com/s/files/1/0517/5702/3400/files/hbs_logo_Zeichenflache_1.svg?v=1635415875"
              alt="Herbsom"
              className="h-5 md:h-7 w-auto mb-4"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <p className="font-body text-sm text-[#A8A88D] leading-relaxed mb-6">
              {t("footer.brand_desc", "Individuelle Naturkosmetik, präzise auf deine Haut abgestimmt. Entwickelt in Münster.")}
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/herbsom.skincare/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#A8A88D] hover:text-[#F8F5F0] transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram size={18} strokeWidth={1.5} />
              </a>
              <a
                href="https://de.linkedin.com/company/herbsom"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#A8A88D] hover:text-[#F8F5F0] transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} strokeWidth={1.5} />
              </a>
              <a
                href="https://www.facebook.com/Herbsom-100811678745689/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#A8A88D] hover:text-[#F8F5F0] transition-colors duration-300"
                aria-label="Facebook"
              >
                <Facebook size={18} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Produkte */}
          <div>
            <p className="section-label text-[#A8A88D] mb-5">{t("nav.products")}</p>
            <ul className="space-y-3">
              {produkteLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="font-body text-sm text-[#D4CCC0] hover:text-[#F8F5F0] transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Über uns */}
          <div>
            <p className="section-label text-[#A8A88D] mb-5">{t("nav.about")}</p>
            <ul className="space-y-3">
              {aboutLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="font-body text-sm text-[#D4CCC0] hover:text-[#F8F5F0] transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontakt & Rechtliches */}
          <div>
            <p className="section-label text-[#A8A88D] mb-5">{t("footer.contact", "Kontakt")}</p>
            <address className="not-italic font-body text-sm text-[#D4CCC0] leading-relaxed mb-6">
              ILI Skincare GmbH<br />
              Steinfurterstraße 51a<br />
              48149 Münster<br />
              <a href="mailto:info@herbsom.de" className="hover:text-[#F8F5F0] transition-colors duration-300 mt-1 block">
                info@herbsom.de
              </a>
            </address>
            <ul className="space-y-3">
              {legalLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="font-body text-sm text-[#D4CCC0] hover:text-[#F8F5F0] transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#6B6B52]">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-[#6B7B69] tracking-wide">
            {t("footer.copyright", "© 2024 Herbsom · ILI Skincare GmbH · Alle Rechte vorbehalten")}
          </p>
          <p className="font-body text-xs text-[#6B7B69]">
            {t("footer.tagline", "Individuelle Naturkosmetik · Made in Germany")}
          </p>
        </div>
      </div>
    </footer>
  );
}

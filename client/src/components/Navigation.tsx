/*
 * Navigation – Herbsom wie herbsom.de
 * Logo links, Navigation rechts, Icons rechts
 */

import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [produkteOpen, setProdukteOpen] = useState(false);
  const { t } = useTranslation();

  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleMenuLeave = () => {
    setProdukteOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: t("nav.products"), href: "#", isDropdown: true },
    { label: t("nav.skintest"), href: "/hauttest" },
    { label: t("nav.about"), href: "/about" },
    { label: t("nav.knowledge"), href: "/blog" },
    { label: t("nav.account"), href: "/account" },
  ];

  const produkteLinks = [
    { label: t("nav.custom_cream"), href: "/configurator/creme", isConfigurator: true },
    { label: t("nav.custom_serum"), href: "/configurator/serum", isConfigurator: true },
    { label: t("nav.cleanser"), href: "/cleaners" },
    { label: t("nav.peelings"), href: "/peelings" },
    { label: t("nav.sunscreen"), href: "/product/sunscreen" },
  ];

  const routinenLinks = [
    { label: t("nav.mature_skin"), href: "/routine/reife-haut" },
    { label: t("nav.dry_skin"), href: "/routine/trockene-haut" },
    { label: t("nav.oily_skin"), href: "/routine/unreine-haut" },
    { label: t("nav.combination_skin"), href: "/routine/mischhaut" },
    { label: t("nav.sensitive_skin"), href: "/routine/empfindliche-haut" },
    { label: t("nav.normal_skin"), href: "/routine/normale-haut" },
    { label: t("nav.sensible_skin"), href: "/routine/sensible-haut" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 transition-all duration-500 ${
          mobileOpen ? "z-[70]" : "z-50"
        } ${
          scrolled
            ? "bg-[#F8F5F0]/95 backdrop-blur-sm border-b border-[#E5E0D8]"
            : "bg-transparent"
        }`}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16 md:h-20 gap-6">
            {/* Logo */}
            <Link href="/">
              <div className="flex-shrink-0">
                <img
                  src="https://cdn.shopify.com/s/files/1/0517/5702/3400/files/hbs_logo_Zeichenflache_1.svg?v=1635415875"
                  alt="Herbsom"
                  className="h-7 md:h-8 w-auto transition-opacity duration-300"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => {
                    if (link.href === "#") setProdukteOpen(true);
                  }}
                  onMouseLeave={() => {
                    // Don't close on button leave, only on menu leave
                  }}
                >
                  {link.href === "#" ? (
                    <button
                      className="font-body text-[11px] tracking-[0.18em] uppercase text-[#1C1C1A] hover:text-[#5B5B38] transition-colors duration-300 whitespace-nowrap"
                      onMouseEnter={() => setProdukteOpen(true)}
                      onMouseLeave={() => {
                        // Don't close on button leave
                      }}
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link href={link.href}>
                      <span className="font-body text-[11px] tracking-[0.18em] uppercase text-[#1C1C1A] hover:text-[#5B5B38] transition-colors duration-300 whitespace-nowrap cursor-pointer">
                        {link.label}
                      </span>
                    </Link>
                  )}

                  {/* PRODUKTE Mega-Menu */}
                  {link.href === "#" && produkteOpen && (
                    <div
                      className="fixed top-20 left-0 right-0 mt-0 bg-gradient-to-b from-[#5B5B38] to-[#4A4A2E] border-b border-[#3D3D24] shadow-2xl z-50 backdrop-blur-sm"
                      onMouseEnter={() => setProdukteOpen(true)}
                      onMouseLeave={() => setProdukteOpen(false)}
                    >
                      <div className="container max-w-6xl">
                        <div className="grid grid-cols-3 gap-8 px-0 py-12">
                          {/* PRODUKTE Section */}
                          <div className="border-r border-[#6B6B48] pr-8">
                            <h3 className="font-display text-base text-[#F8F5F0] mb-8 font-light tracking-widest uppercase opacity-90">{t("nav.products")}</h3>
                            <div className="space-y-4">
                              {produkteLinks.map((pLink) => (
                                <Link key={pLink.label} href={pLink.href} className="block font-body text-sm text-[#E8E3DB] hover:text-[#F8F5F0] transition-all duration-300 hover:translate-x-1 relative group">
                                    <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-1 bg-[#F8F5F0] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    {pLink.label}
                                </Link>
                              ))}
                            </div>
                          </div>

                          {/* ROUTINEN Section */}
                          <div className="border-r border-[#6B6B48] pr-8">
                            <h3 className="font-display text-base text-[#F8F5F0] mb-8 font-light tracking-widest uppercase opacity-90">{t("nav.routines", "Routinen")}</h3>
                            <div className="space-y-4">
                              {routinenLinks.map((rLink) => (
                                <Link key={rLink.label} href={rLink.href} className="block font-body text-sm text-[#E8E3DB] hover:text-[#F8F5F0] transition-all duration-300 hover:translate-x-1 relative group">
                                    <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-1 bg-[#F8F5F0] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    {rLink.label}
                                </Link>
                              ))}
                            </div>
                          </div>

                          {/* SONSTIGES Section */}
                          <div>
                            <h3 className="font-display text-base text-[#F8F5F0] mb-8 font-light tracking-widest uppercase opacity-90">{t("nav.misc", "Sonstiges")}</h3>
                            <div className="space-y-4">
                              <Link href="/gutschein" className="block font-body text-sm text-[#E8E3DB] hover:text-[#F8F5F0] transition-all duration-300 hover:translate-x-1 relative group">
                                  <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-1 bg-[#F8F5F0] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                  {t("nav.gift_card", "Gutschein")}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right: Icons */}
            <div className="flex items-center gap-4 md:gap-6">
              <LanguageSwitcher />

              <button
                onClick={() => toast.info(t("common.search_coming_soon", "Suche – demnächst verfügbar"))}
                className="text-[#1C1C1A] hover:text-[#5B5B38] transition-colors duration-300"
                aria-label={t("common.search")}
              >
                <Search size={18} strokeWidth={1.5} />
              </button>

              <Link
                href="/cart"
                className="text-[#1C1C1A] hover:text-[#5B5B38] transition-colors duration-300 relative"
                aria-label={t("common.cart")}
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#5B5B38] text-[#F8F5F0] text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden text-[#1C1C1A] hover:text-[#5B5B38] transition-colors duration-300 z-[80] relative"
                aria-label={t("nav.menu", "Menü")}
              >
                {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-[#1C1C1A]/50 z-[60] md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-[#F8F5F0] z-[65] md:hidden transform transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-[#E5E0D8]">
            <img
              src="https://cdn.shopify.com/s/files/1/0517/5702/3400/files/hbs_logo_Zeichenflache_1.svg?v=1635415875"
              alt="Herbsom"
              className="h-6 w-auto"
            />
            <button
              onClick={() => setMobileOpen(false)}
              className="text-[#1C1C1A]"
              aria-label={t("common.close")}
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          <nav className="flex-1 p-6 space-y-6">
            <div>
              <p className="font-body text-[10px] tracking-[0.2em] uppercase text-[#8B8070] mb-3">{t("nav.products")}</p>
              <div className="space-y-3">
                {produkteLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block font-body text-sm text-[#1C1C1A] hover:text-[#5B5B38] transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="font-body text-[10px] tracking-[0.2em] uppercase text-[#8B8070] mb-3">{t("nav.routines", "Routinen")}</p>
              <div className="space-y-3">
                {routinenLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block font-body text-sm text-[#1C1C1A] hover:text-[#5B5B38] transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Link href="/hauttest" className="block font-body text-sm text-[#1C1C1A] hover:text-[#5B5B38] transition-colors" onClick={() => setMobileOpen(false)}>
                {t("nav.skintest")}
              </Link>
              <Link href="/about" className="block font-body text-sm text-[#1C1C1A] hover:text-[#5B5B38] transition-colors" onClick={() => setMobileOpen(false)}>
                {t("nav.about")}
              </Link>
              <Link href="/blog" className="block font-body text-sm text-[#1C1C1A] hover:text-[#5B5B38] transition-colors" onClick={() => setMobileOpen(false)}>
                {t("nav.knowledge")}
              </Link>
              <Link href="/account" className="block font-body text-sm text-[#1C1C1A] hover:text-[#5B5B38] transition-colors" onClick={() => setMobileOpen(false)}>
                {t("nav.account")}
              </Link>
              <Link href="/gutschein" className="block font-body text-sm text-[#1C1C1A] hover:text-[#5B5B38] transition-colors" onClick={() => setMobileOpen(false)}>
                {t("nav.gift_card", "Gutschein")}
              </Link>
            </div>
          </nav>

          <div className="p-6 border-t border-[#E5E0D8]">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </>
  );
}

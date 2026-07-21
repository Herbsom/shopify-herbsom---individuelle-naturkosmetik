/*
 * Routine Seite – UnreineHaut
 * Design: Nordischer Minimalismus × Pharmazeutische Präzision (wie Homepage)
 * Farben: Cremeweiß (#F8F5F0) ↔ Dunkelgrün (#5B5B38), Salbeigrün (#7D7D5D)
 * Typografie: Cormorant Garamond (Display) + Inter (Body)
 */
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowRight, Star, ShoppingBag, Pencil, Info } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { Link } from "wouter";
import { ROUTINE_UNREINE_HAUT } from "@/lib/routineRecommendations";
import ProductDetailModal, { STANDARD_PRODUCT_DETAILS, type ProductDetail } from "@/components/ProductDetailModal";
import { SERUM_INGREDIENT_DETAILS, CREME_INGREDIENT_DETAILS } from "@/components/IngredientDetailModal";
import { useTranslation } from "react-i18next";
import ShopifyLegacyProductPrice from "@/components/ShopifyLegacyProductPrice";
import ShopifyPurchaseButton from "@/components/ShopifyPurchaseButton";

export default function RoutineReifHaut() {
  const { t } = useTranslation();
  const { addItem } = useCart();
  const rec = ROUTINE_UNREINE_HAUT;

  const products = [
    {
      ...rec.cleanser,
      label: "01",
    },
    {
      ...rec.peeling,
      label: "02",
    },
    {
      ...rec.serum,
      label: "03",
    },
    {
      ...rec.creme,
      label: "04",
    },
    {
      ...rec.sunscreen,
      label: "05",
    },
  ];
  const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(null);


  const handleProductClick = (product: typeof products[0]) => {
    if (STANDARD_PRODUCT_DETAILS[product.id]) {
      setSelectedProduct(STANDARD_PRODUCT_DETAILS[product.id]);
      return;
    }
    if (product.id.startsWith("serum-") && product.ingredientIds) {
      const ingredients = product.ingredientIds.map(id => ({
        id,
        name: SERUM_INGREDIENT_DETAILS[id]?.subtitle || id,
      }));
      setSelectedProduct({
        id: product.id,
        name: product.name,
        subtitle: "Individuelles Serum",
        description: product.description,
        image: product.image,
        anwendung: "In das Basisserum geben und schütteln. Das fertige Serum morgens und abends auf das Gesicht auftragen.",
        hautprobleme: "Individuell angepasst",
        hauttypen: "Alle Hauttypen",
        wirkung: "Das Serum kombiniert ausgewählte Wirkstoffe für eine personalisierte Hautpflege.",
        selectedIngredients: ingredients,
        baseProduct: SERUM_INGREDIENT_DETAILS.baseSerum?.inhaltsstoffe || [],
      });
      return;
    }
    if (product.id.startsWith("creme-") && product.ingredientIds) {
      const ingredients = product.ingredientIds.map(id => ({
        id,
        name: SERUM_INGREDIENT_DETAILS[id]?.subtitle || id,
      }));
      // Select correct base creme based on cremeBase
      const baseCremeKey = product.cremeBase === "rich" ? "baseCremeRich" : "baseCreme";
      setSelectedProduct({
        id: product.id,
        name: product.name,
        subtitle: "Individuelle Creme",
        description: product.description,
        image: product.image,
        anwendung: "Wirkstoffe in die Basiscreme geben, mit dem mitgelieferten Holzspatel 2 Minuten umrühren. Die fertige individuelle Creme morgens und abends auf die gereinigte Haut auftragen.",
        hautprobleme: "Individuell angepasst",
        hauttypen: "Alle Hauttypen",
        wirkung: "Die Creme kombiniert eine hochwertige Basiscreme mit ausgewählten Wirkstoffen für eine personalisierte Hautpflege.",
        selectedIngredients: ingredients,
        baseProduct: CREME_INGREDIENT_DETAILS[baseCremeKey]?.inhaltsstoffe || [],
      });
    }
  };

  const handleAddToCart = (product: typeof products[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      quantity: 1,
      description: product.description,
    });
    toast.success(`${product.name} wurde in den Warenkorb gelegt!`);
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-96 md:h-[600px] bg-[#F8F5F0] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F8F5F0] via-[#F8F5F0]/50 to-transparent" />
          <div className="relative z-10 text-center px-4 max-w-3xl">
            <p className="font-body text-xs tracking-[0.12em] uppercase mb-4 text-[#7D7D5D]">
              Routine für Unreine Haut
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-light mb-6 leading-tight text-[#1C1C1A]">
              Klare Haut
            </h1>
            <p className="font-body text-base md:text-lg leading-relaxed text-[#4A4A48]">
              Eine Routine individuell auf unreine Haut zugeschnitten – gegen Pickel und Unreinheiten
            </p>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 md:py-24 lg:py-32 bg-[#5B5B38]">
          <div className="container max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                { icon: "✓", title: "Tiefenreinigung & Porenverfeinering", text: "mit gezielten Wirkstoffen" },
                { icon: "✓", title: "Reduziert Pickel & Mitesser", text: "und reguliert Talgproduktion" },
                { icon: "✓", title: "Sichtbare Ergebnisse", text: "bereits nach 3–5 Wochen" },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="text-4xl mb-4 text-[#F8F5F0]">{item.icon}</div>
                  <h3 className="font-display text-lg text-[#F8F5F0] mb-2 font-light">{item.title}</h3>
                  <p className="font-body text-sm text-[#E8E3DB]">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16 md:py-24">
          <div className="container max-w-5xl">
            <h2 className="font-display text-4xl md:text-5xl text-center mb-4 text-[#1C1C1A] font-light">
              Deine Routine
            </h2>
            <p className="font-body text-center text-[#7D7D5D] mb-16">
              Fünf Schritte für klare, reine Haut ohne Pickel und Mitesser
            </p>

            <div className="space-y-20 lg:space-y-24">
              {products.map((product, idx) => (
                <div key={product.id} className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
                  {idx % 2 === 0 ? (
                    <>
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-[#5B5B38] rounded-full flex items-center justify-center">
                            <span className="text-white font-display text-sm font-light">{product.label}</span>
                          </div>
                          <span className="font-body text-xs tracking-[0.12em] uppercase text-[#7D7D5D]">
                            Schritt {product.label}
                          </span>
                        </div>

                        <h3 className="font-display text-3xl md:text-4xl lg:text-5xl text-[#1C1C1A] mb-4 font-light leading-tight">
                          {product.name}
                        </h3>

                        <p className="font-body text-base lg:text-lg text-[#4A4A48] leading-relaxed mb-8">
                          {product.description}
                        </p>

                        {product.benefits && product.benefits.length > 0 && (
                          <ul className="space-y-2 mb-8">
                            {product.benefits.map((benefit, bidx) => (
                              <li key={bidx} className="flex items-start gap-3 font-body text-sm text-[#4A4A48]">
                                <span className="text-[#5B5B38] font-semibold mt-0.5">•</span>
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <ShopifyLegacyProductPrice item={product} className="font-display text-2xl text-[#5B5B38]" />
                          <ShopifyPurchaseButton
                            item={{
                              id: product.id,
                              name: product.name,
                              quantity: 1,
                              description: product.description,
                            }}
                            onPurchase={() => handleAddToCart(product)}
                            className="bg-[#5B5B38] text-[#F8F5F0] font-body text-xs lg:text-sm tracking-[0.12em] uppercase px-6 lg:px-8 py-3 lg:py-4 rounded-sm hover:bg-[#424226] transition-all duration-300 flex items-center gap-2 group shadow-sm hover:shadow-md"
                          >
                            <ShoppingBag size={16} />
                            In den Warenkorb
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </ShopifyPurchaseButton>
                                                    <button
                            onClick={() => handleProductClick(product)}
                            className="flex items-center gap-1 font-body text-xs text-[#5B5B38] hover:text-[#424226] transition-colors duration-200 tracking-[0.08em] uppercase"
                            title="Produktdetails anzeigen"
                          >
                            <Info size={12} />
                            Details
                          </button>
{product.href?.startsWith("/configurator") && (
                            <Link
                              href={product.href}
                              className="flex items-center gap-1 font-body text-xs text-[#5B5B38] hover:text-[#424226] transition-colors duration-200 tracking-[0.08em] uppercase"
                            >
                              <Pencil size={12} />
                              Anpassen
                            </Link>
                          )}
                        </div>
                      </div>

                      <div className="aspect-square flex items-center justify-center group">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" />
                        ) : (
                          <div className="text-8xl">🧴</div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleProductClick(product)}
                        className="aspect-square flex items-center justify-center order-last md:order-first group cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" />
                        ) : (
                          <div className="text-8xl">🧴</div>
                        )}
                      </button>

                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-[#5B5B38] rounded-full flex items-center justify-center">
                            <span className="text-white font-display text-sm font-light">{product.label}</span>
                          </div>
                          <span className="font-body text-xs tracking-[0.12em] uppercase text-[#7D7D5D]">
                            Schritt {product.label}
                          </span>
                        </div>

                        <h3 className="font-display text-3xl md:text-4xl lg:text-5xl text-[#1C1C1A] mb-4 font-light leading-tight">
                          {product.name}
                        </h3>

                        <p className="font-body text-base lg:text-lg text-[#4A4A48] leading-relaxed mb-8">
                          {product.description}
                        </p>

                        {product.benefits && product.benefits.length > 0 && (
                          <ul className="space-y-2 mb-8">
                            {product.benefits.map((benefit, bidx) => (
                              <li key={bidx} className="flex items-start gap-3 font-body text-sm text-[#4A4A48]">
                                <span className="text-[#5B5B38] font-semibold mt-0.5">•</span>
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <ShopifyLegacyProductPrice item={product} className="font-display text-2xl text-[#5B5B38]" />
                          <ShopifyPurchaseButton
                            item={{
                              id: product.id,
                              name: product.name,
                              quantity: 1,
                              description: product.description,
                            }}
                            onPurchase={() => handleAddToCart(product)}
                            className="bg-[#5B5B38] text-[#F8F5F0] font-body text-xs lg:text-sm tracking-[0.12em] uppercase px-6 lg:px-8 py-3 lg:py-4 rounded-sm hover:bg-[#424226] transition-all duration-300 flex items-center gap-2 group shadow-sm hover:shadow-md"
                          >
                            <ShoppingBag size={16} />
                            In den Warenkorb
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </ShopifyPurchaseButton>
                                                    <button
                            onClick={() => handleProductClick(product)}
                            className="flex items-center gap-1 font-body text-xs text-[#5B5B38] hover:text-[#424226] transition-colors duration-200 tracking-[0.08em] uppercase"
                            title="Produktdetails anzeigen"
                          >
                            <Info size={12} />
                            Details
                          </button>
{product.href?.startsWith("/configurator") && (
                            <Link
                              href={product.href}
                              className="flex items-center gap-1 font-body text-xs text-[#5B5B38] hover:text-[#424226] transition-colors duration-200 tracking-[0.08em] uppercase"
                            >
                              <Pencil size={12} />
                              Anpassen
                            </Link>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Total CTA */}
            <div className="mt-24 pt-20 border-t border-[#E5E0D8]">
              <div className="bg-gradient-to-r from-[#5B5B38] to-[#424226] rounded-lg p-8 md:p-16 lg:p-20 flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg">
                <div className="text-center md:text-left">
                  <p className="font-body text-sm text-[#E8E3DB] mb-2">Gesamtpreis der Routine</p>
                  <p className="font-display text-3xl lg:text-4xl text-[#F8F5F0] font-light">Aktueller Gesamtpreis im Shopify-Warenkorb</p>
                </div>
                <ShopifyPurchaseButton
                  items={products.map((product) => ({
                    id: product.id,
                    name: product.name,
                    quantity: 1,
                    description: product.description,
                  }))}
                  onPurchase={() => {
                    products.forEach((product) => handleAddToCart(product));
                  }}
                  wrapperClassName="items-center"
                  messageClassName="text-[#F2D7CE]"
                  className="bg-[#F8F5F0] text-[#5B5B38] font-body text-xs lg:text-sm tracking-[0.12em] uppercase px-8 lg:px-10 py-4 lg:py-5 rounded-sm hover:bg-[#E8E3DB] transition-all duration-300 flex items-center gap-2 group shadow-md hover:shadow-lg hover:scale-105"
                >
                  <ShoppingBag size={18} className="flex-shrink-0" />
                  <span className="whitespace-nowrap">Gesamte Routine hinzufügen</span>
                  <ArrowRight size={16} className="flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                </ShopifyPurchaseButton>
              </div>
            </div>
          </div>
        </section>

        {/* Application Section */}
        <section className="py-16 md:py-24 lg:py-32 bg-[#5B5B38]">
          <div className="container max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
              <div>
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#F8F5F0] mb-12 lg:mb-16 font-light leading-tight">
                  Die Anwendung
                </h2>

                <div className="space-y-8 lg:space-y-10">
                  {[
                    { step: "1", title: "Morgens & Abends: Reinigen", desc: "Reinige dein Gesicht mit dem Reinigungsgel, um Talg und Unreinheiten zu entfernen." },
                    { step: "2", title: "2x pro Woche: Peeling", desc: "Trage das BHA & Azelainsäure Peeling zweimal pro Woche auf, um Poren zu klären." },
                    { step: "3", title: "Morgens & Abends: Serum", desc: "Dein individuelles Serum mit Niacinamid & Azelainsäure reguliert Talg und beruhigt Entzündungen." },
                    { step: "4", title: "Abends: Creme", desc: "Deine individuelle Creme mit leichter Textur regeneriert die Haut ohne zu beschweren." },
                    { step: "5", title: "Morgens: Sonnenschutz", desc: "Das Sonnenschutzfluid schützt vor UV-Strahlung und verhindert Pigmentflecken." },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4 lg:gap-6 group">
                      <div className="w-12 h-12 lg:w-14 lg:h-14 bg-[#F8F5F0] rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#7D7D5D] transition-colors duration-300">
                        <span className="font-display text-base lg:text-lg font-light text-[#5B5B38] group-hover:text-[#F8F5F0] transition-colors duration-300">{item.step}</span>
                      </div>
                      <div>
                        <h4 className="font-display text-lg lg:text-xl text-[#F8F5F0] mb-2 font-light">{item.title}</h4>
                        <p className="font-body text-sm lg:text-base text-[#E8E3DB] leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Application image on right for desktop */}
              <div className="hidden lg:flex items-center justify-center">
                <img
                  src="/manus-storage/application-image_b29f3e02.webp"
                  alt="Hautpflege-Anwendung"
                  className="w-full h-auto object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-24 lg:py-32 bg-[#F8F5F0]">
          <div className="container max-w-5xl">
            <h2 className="font-display text-4xl md:text-5xl text-center mb-16 text-[#1C1C1A] font-light">
              Das sagen unsere Kunden
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah M.",
                  rating: 5,
                  text: "Meine Haut hat sich in 3 Wochen komplett verändert. Keine Pickel mehr, die Poren sind verfeinert und meine Haut fühlt sich endlich ausgeglichen an!",
                },
                {
                  name: "Julia K.",
                  rating: 5,
                  text: "Endlich eine Routine, die wirklich funktioniert! Das Serum und die Creme sind perfekt auf meine unreine Haut abgestimmt.",
                },
                {
                  name: "Lisa W.",
                  rating: 5,
                  text: "Ich bin begeistert! Die Routine ist einfach zu handhaben und die Ergebnisse sind sichtbar. Meine Haut ist klarer und reiner als je zuvor.",
                },
              ].map((testimonial, idx) => (
                <div key={idx} className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#5B5B38" color="#5B5B38" />
                    ))}
                  </div>
                  <p className="font-body text-sm text-[#4A4A48] leading-relaxed mb-6">{testimonial.text}</p>
                  <p className="font-display text-sm text-[#5B5B38] font-light">{testimonial.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 md:py-24 lg:py-32 bg-[#5B5B38]">
          <div className="container max-w-4xl text-center">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#F8F5F0] mb-6 font-light">
              Bereit für klare Haut?
            </h2>
            <p className="font-body text-lg text-[#E8E3DB] mb-12 max-w-2xl mx-auto">
              Finde deine perfekte Routine mit unserem Hauttest und starte deine Reise zu gesunder, strahlender Haut.
            </p>
            <Link
              href="/hauttest"
              className="bg-[#F8F5F0] text-[#5B5B38] font-body text-xs tracking-[0.12em] uppercase px-8 py-4 rounded-sm hover:bg-[#E8E3DB] transition-colors duration-300 flex items-center gap-2 group mx-auto inline-flex"
            >
              <span className="whitespace-nowrap">Zum Hauttest</span>
              <ArrowRight size={16} className="flex-shrink-0 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />

      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}

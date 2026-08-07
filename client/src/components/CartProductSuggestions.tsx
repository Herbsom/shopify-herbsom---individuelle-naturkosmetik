import { Link } from "wouter";
import { useCart } from "@/contexts/CartContext";
import ShopifyProductPrice from "@/components/ShopifyProductPrice";
import ShopifyPurchaseButton from "@/components/ShopifyPurchaseButton";

const CART_SUGGESTIONS = [
  {
    name: "50 ml Reinigungsgel",
    handle: "mini-reiniger",
    href: "/product/cleaner",
    image: "/manus-storage/50ml-reinigungsgel-warenkorb_0faad0fb.jpeg",
  },
  {
    name: "Reinigungsgel",
    handle: "reinigungsgel",
    href: "/product/cleaner",
    image: "https://herbsomweb-rcxwgckf.manus.space/manus-storage/Reinigungsgel_bcbacfba.webp",
  },
  {
    name: "AHA & PHA Peeling",
    handle: "aha-pha-peeling",
    href: "/product/peeling/aha",
    image: "https://herbsomweb-rcxwgckf.manus.space/manus-storage/aha_pha_peeling_1x1_white_aad680df.webp",
  },
  {
    name: "Sonnenschutzfluid SPF 50+",
    handle: "sonnenschutzfluid-spf-50",
    href: "/product/sunscreen",
    image: "https://herbsomweb-rcxwgckf.manus.space/manus-storage/hf_20260616_214302_5233e72b-a663-4b93-a6d9-685e4cbb5b18_94230957.png",
  },
  {
    name: "Gua Sha Jade",
    handle: "gua-sha-jade-stein",
    image: "https://cdn.shopify.com/s/files/1/0517/5702/3400/files/hf_20260618_101521_5f7c0ade-0380-49e9-85a5-c4a9b90d6395_1.png?v=1786100350",
  },
] as const;

export default function CartProductSuggestions() {
  const { items } = useCart();
  const productsInCart = new Set(items.map(item => item.productHandle));
  const suggestions = CART_SUGGESTIONS.filter(product => !productsInCart.has(product.handle));

  if (suggestions.length === 0) return null;

  return (
    <section className="mt-12 border-t border-[#E5E0D8] pt-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="section-label mb-2">Vervollständige deine Routine</p>
          <h2 className="font-display text-2xl font-light text-[#1C1C1A] md:text-3xl">
            Passt gut dazu
          </h2>
        </div>
        <p className="max-w-xs font-body text-xs leading-relaxed text-[#7D7D5D]">
          Mit einem zusätzlichen Produkt erreichst du schnell den kostenlosen Versand ab 60 €.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {suggestions.map(product => (
          <article key={product.handle} className="flex gap-4 border border-[#E5E0D8] bg-white p-4">
            {"href" in product ? (
              <Link href={product.href} className="block h-20 w-20 flex-none overflow-hidden bg-[#F0EBE3]">
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              </Link>
            ) : (
              <div className="h-20 w-20 flex-none overflow-hidden bg-[#F0EBE3]">
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              </div>
            )}
            <div className="flex min-w-0 flex-1 flex-col">
              {"href" in product ? (
                <Link href={product.href} className="font-display text-base font-light text-[#1C1C1A] transition-colors hover:text-[#5B5B38]">
                  {product.name}
                </Link>
              ) : (
                <h3 className="font-display text-base font-light text-[#1C1C1A]">{product.name}</h3>
              )}
              <ShopifyProductPrice handle={product.handle} showFrom={false} className="mt-1 font-body text-xs text-[#7D7D5D]" />
              <ShopifyPurchaseButton
                item={{ id: product.handle, name: product.name, quantity: 1 }}
                wrapperClassName="mt-auto w-full pt-3"
                className="w-full border border-[#5B5B38] px-3 py-2 font-body text-[10px] uppercase tracking-[0.11em] text-[#5B5B38] transition-colors hover:bg-[#5B5B38] hover:text-[#F8F5F0] active:scale-[0.98]"
              >
                Hinzufügen
              </ShopifyPurchaseButton>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

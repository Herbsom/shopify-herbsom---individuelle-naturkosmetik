import {
  inferShopifyHandle,
  selectVariantForLegacyItem,
  type LegacyCartItem,
} from "@/contexts/CartContext";
import { formatMoney } from "@/lib/format";
import { trpc } from "@/lib/trpc";

type ShopifyLegacyProductPriceProps = {
  item: Pick<LegacyCartItem, "id" | "name" | "description">;
  className?: string;
  showFrom?: boolean;
};

function PriceStatus({
  children,
  className = "",
  error = false,
}: {
  children: string;
  className?: string;
  error?: boolean;
}) {
  return (
    <span
      className={`${error ? "text-[#8A3F35]" : "text-[#7D7D5D]"} ${className}`}
      role={error ? "alert" : "status"}
      aria-live="polite"
    >
      {children}
    </span>
  );
}

export default function ShopifyLegacyProductPrice({
  item,
  className,
  showFrom = true,
}: ShopifyLegacyProductPriceProps) {
  let handle: string | null = null;
  try {
    handle = inferShopifyHandle({ ...item, quantity: 1 });
  } catch {
    handle = null;
  }

  const productQuery = trpc.commerce.products.byHandle.useQuery(
    { handle: handle ?? "nicht-zugeordnet" },
    { enabled: Boolean(handle), staleTime: 5 * 60 * 1000 }
  );

  if (!handle) {
    return <PriceStatus className={className} error>Produkt nicht in Shopify verfügbar</PriceStatus>;
  }

  if (productQuery.isLoading) {
    return <PriceStatus className={className}>Preis wird aus Shopify geladen</PriceStatus>;
  }

  if (productQuery.isError || !productQuery.data) {
    return <PriceStatus className={className} error>Preis derzeit nicht verfügbar</PriceStatus>;
  }

  const product = productQuery.data;
  const configured = Boolean(item.description) || /^(creme|serum)-/i.test(item.id);

  if (configured) {
    try {
      const variant = selectVariantForLegacyItem(product, {
        ...item,
        quantity: 1,
      });
      return <span className={className}>{formatMoney(variant.price)}</span>;
    } catch {
      return <PriceStatus className={className} error>Variante derzeit nicht verfügbar</PriceStatus>;
    }
  }

  const amounts = product.variants
    .filter((variant) => variant.availableForSale)
    .map((variant) => Number(variant.price.amount))
    .filter(Number.isFinite);
  const min = amounts.length > 0 ? Math.min(...amounts) : Number(product.priceRange.min.amount);
  const max = amounts.length > 0 ? Math.max(...amounts) : Number(product.priceRange.max.amount);

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return <PriceStatus className={className} error>Preis derzeit nicht verfügbar</PriceStatus>;
  }

  const money = {
    amount: String(min),
    currencyCode: product.priceRange.min.currencyCode,
  };

  return (
    <span className={className}>
      {showFrom && min !== max ? "ab " : ""}{formatMoney(money)}
    </span>
  );
}

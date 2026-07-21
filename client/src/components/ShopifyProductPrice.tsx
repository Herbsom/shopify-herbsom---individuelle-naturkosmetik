import { formatMoney } from "@/lib/format";
import { trpc } from "@/lib/trpc";

type ShopifyProductPriceProps = {
  handle: string;
  className?: string;
  showFrom?: boolean;
};

export default function ShopifyProductPrice({
  handle,
  className = "",
  showFrom = true,
}: ShopifyProductPriceProps) {
  const { data: product, isLoading, isError } = trpc.commerce.products.byHandle.useQuery(
    { handle },
    { staleTime: 5 * 60 * 1000 }
  );

  if (isLoading) {
    return (
      <span
        className={`inline-flex min-h-5 items-center text-sm text-[#7D7D5D] ${className}`}
        role="status"
        aria-live="polite"
      >
        <span className="mr-2 inline-block h-3 w-3 animate-pulse rounded-full bg-[#C8C2B8]" aria-hidden="true" />
        Preis wird aus Shopify geladen
      </span>
    );
  }

  if (isError || !product) {
    return (
      <span className={`text-sm text-[#8A3F35] ${className}`} role="alert">
        Preis derzeit nicht verfügbar
      </span>
    );
  }

  const { min, max } = product.priceRange;
  const hasRange = min.amount !== max.amount || min.currencyCode !== max.currencyCode;

  return (
    <span className={className}>
      {hasRange && showFrom ? "ab " : ""}
      {formatMoney(min)}
      {hasRange && !showFrom ? ` – ${formatMoney(max)}` : ""}
    </span>
  );
}

import { trpc } from "@/lib/trpc";

type ShopifyProductCardImageProps = {
  handle: string;
  alt: string;
  className?: string;
};

export default function ShopifyProductCardImage({
  handle,
  alt,
  className = "h-full w-full object-cover",
}: ShopifyProductCardImageProps) {
  const { data: product, isLoading, isError } = trpc.commerce.products.byHandle.useQuery(
    { handle },
    { staleTime: 5 * 60 * 1000 }
  );

  if (isLoading) {
    return <div className="h-full w-full animate-pulse bg-[#E8E3DB]" aria-label="Produktbild wird geladen" />;
  }

  const image = product?.images?.[0];
  if (isError || !image) {
    return (
      <div
        className="flex h-full w-full items-center justify-center px-3 text-center text-xs text-[#8A3F35]"
        role="img"
        aria-label="Produktbild derzeit nicht verfügbar"
      >
        Produktbild derzeit nicht verfügbar
      </div>
    );
  }

  return <img src={image.url} alt={image.altText || alt} className={`block ${className}`} loading="eager" />;
}

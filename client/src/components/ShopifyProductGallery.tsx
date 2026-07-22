import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

type ProductGalleryImage = {
  url: string;
  altText?: string | null;
};

type ShopifyProductGalleryProps = {
  handle: string;
  alt: string;
  /**
   * Kuratierte Referenzmotive für das sichtbare Produktbild. Sie werden
   * bewusst vor dynamischen Shopify-Bildern eingesetzt, ohne Preise,
   * Verfügbarkeit oder Warenkorb-Daten vom Shopify-Produkt zu entkoppeln.
   */
  referenceImages?: readonly ProductGalleryImage[];
  className?: string;
  imageClassName?: string;
};

export default function ShopifyProductGallery({
  handle,
  alt,
  referenceImages = [],
  className = "aspect-square rounded-sm bg-[#F0EBE3]",
  imageClassName = "h-full w-full object-cover",
}: ShopifyProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { data: product, isLoading, isError } = trpc.commerce.products.byHandle.useQuery(
    { handle },
    { staleTime: 5 * 60 * 1000 }
  );

  const images = referenceImages.length > 0 ? referenceImages : product?.images ?? [];
  const usesReferenceImages = referenceImages.length > 0;

  useEffect(() => {
    setActiveIndex(0);
  }, [handle]);

  if (isLoading && !usesReferenceImages) {
    return (
      <div className={`flex items-center justify-center ${className}`} role="status" aria-live="polite">
        <div className="text-center text-sm text-[#7D7D5D]">
          <span className="mx-auto mb-3 block h-6 w-6 animate-pulse rounded-full bg-[#C8C2B8]" aria-hidden="true" />
          Produktbild wird aus Shopify geladen
        </div>
      </div>
    );
  }

  if ((isError && !usesReferenceImages) || images.length === 0) {
    return (
      <div className={`flex items-center justify-center border border-[#D9C2BC] ${className}`} role="alert">
        <p className="max-w-52 px-6 text-center text-sm text-[#8A3F35]">
          Produktbild derzeit nicht verfügbar
        </p>
      </div>
    );
  }

  const activeImage = images[Math.min(activeIndex, images.length - 1)];

  return (
    <div className="flex flex-col gap-3">
      <div className={`overflow-hidden ${className}`}>
        <img
          src={activeImage.url}
          alt={activeImage.altText || alt}
          className={imageClassName}
          loading="eager"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2" aria-label="Produktbilder">
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Produktbild ${index + 1} anzeigen`}
              aria-pressed={activeIndex === index}
              className={`h-16 w-16 overflow-hidden rounded-sm border transition-opacity ${
                activeIndex === index
                  ? "border-[#5B5B38] opacity-100"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={image.url}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

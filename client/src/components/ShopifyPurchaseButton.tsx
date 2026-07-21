import { trpc } from "@/lib/trpc";
import {
  inferShopifyHandle,
  selectVariantForLegacyItem,
  type LegacyCartItem,
  useCart,
} from "@/contexts/CartContext";
import type { Product } from "@shared/commerce/types";
import type { ReactNode } from "react";

const PRODUCT_LIST_INPUT = { first: 100 } as const;

export type ShopifyPurchaseUiState = {
  disabled: boolean;
  kind: "loading" | "error" | "disabled" | "available";
  message: string | null;
};

export function getShopifyPurchaseUiState(input: {
  items: LegacyCartItem[];
  products: Product[] | undefined;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  manuallyDisabled?: boolean;
  disabledReason?: string;
}): ShopifyPurchaseUiState {
  if (input.manuallyDisabled) {
    return {
      disabled: true,
      kind: "disabled",
      message: input.disabledReason ?? "Bitte vervollständige zuerst die erforderlichen Angaben.",
    };
  }

  if (input.isLoading) {
    return {
      disabled: true,
      kind: "loading",
      message: "Verfügbarkeit wird direkt bei Shopify geprüft …",
    };
  }

  if (input.isError) {
    return {
      disabled: true,
      kind: "error",
      message: input.errorMessage || "Die Shopify-Produktdaten konnten nicht geladen werden.",
    };
  }

  if (!input.products) {
    return {
      disabled: true,
      kind: "error",
      message: "Die Shopify-Produktdaten sind derzeit nicht verfügbar.",
    };
  }

  try {
    for (const item of input.items) {
      const handle = inferShopifyHandle(item);
      const product = input.products.find((candidate) => candidate.handle === handle);
      if (!product) {
        throw new Error(`„${item.name}“ ist im Shopify-Verkaufskanal derzeit nicht verfügbar.`);
      }
      selectVariantForLegacyItem(product, item);
    }
  } catch (error) {
    return {
      disabled: true,
      kind: "error",
      message: error instanceof Error ? error.message : "Mindestens ein Shopify-Produkt ist derzeit nicht kaufbar.",
    };
  }

  return { disabled: false, kind: "available", message: null };
}

type ShopifyPurchaseButtonProps = {
  item?: LegacyCartItem;
  items?: LegacyCartItem[];
  onPurchase?: () => void | Promise<void>;
  disabled?: boolean;
  disabledReason?: string;
  className?: string;
  wrapperClassName?: string;
  messageClassName?: string;
  children: ReactNode;
};

export default function ShopifyPurchaseButton({
  item,
  items,
  onPurchase,
  disabled = false,
  disabledReason,
  className = "",
  wrapperClassName = "",
  messageClassName = "text-[#7A3E32]",
  children,
}: ShopifyPurchaseButtonProps) {
  const { addItem } = useCart();
  const productQuery = trpc.commerce.products.list.useQuery(PRODUCT_LIST_INPUT, {
    staleTime: 60_000,
    retry: 1,
  });
  const purchaseItems = items ?? (item ? [item] : []);
  const state = getShopifyPurchaseUiState({
    items: purchaseItems,
    products: productQuery.data,
    isLoading: productQuery.isLoading,
    isError: productQuery.isError,
    errorMessage: productQuery.error?.message,
    manuallyDisabled: disabled || purchaseItems.length === 0,
    disabledReason,
  });

  const handlePurchase = async () => {
    if (state.disabled) return;
    if (onPurchase) {
      await onPurchase();
      return;
    }
    for (const purchaseItem of purchaseItems) {
      await addItem(purchaseItem);
    }
  };

  const buttonContent = state.kind === "loading"
    ? "Shopify wird geprüft …"
    : state.kind === "error"
      ? "Derzeit nicht verfügbar"
      : children;

  return (
    <span
      className={`inline-flex max-w-full flex-col ${wrapperClassName}`}
      data-shopify-purchase-state={state.kind}
    >
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void handlePurchase();
        }}
        disabled={state.disabled}
        aria-disabled={state.disabled}
        className={`${className} disabled:cursor-not-allowed disabled:opacity-55`}
      >
        {buttonContent}
      </button>
      {state.message && (
        <span
          role={state.kind === "error" ? "alert" : "status"}
          className={`mt-2 max-w-sm font-body text-xs leading-relaxed ${messageClassName}`}
        >
          {state.message}
        </span>
      )}
    </span>
  );
}

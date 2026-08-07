import { CheckCircle2, Truck } from "lucide-react";
import { formatMoney } from "@/lib/format";
import type { Money } from "@shared/commerce/types";

export const FREE_SHIPPING_THRESHOLD = 60;

export function getFreeShippingProgress(subtotal: number) {
  const safeSubtotal = Number.isFinite(subtotal) ? Math.max(0, subtotal) : 0;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - safeSubtotal);

  return {
    hasFreeShipping: remaining === 0,
    remaining,
    progress: Math.min(100, Math.round((safeSubtotal / FREE_SHIPPING_THRESHOLD) * 100)),
  };
}

type FreeShippingProgressProps = {
  subtotal: Money | number;
  compact?: boolean;
};

export default function FreeShippingProgress({ subtotal, compact = false }: FreeShippingProgressProps) {
  const subtotalAmount = typeof subtotal === "number" ? subtotal : Number.parseFloat(subtotal.amount);
  const { hasFreeShipping, progress, remaining } = getFreeShippingProgress(subtotalAmount);

  return (
    <section
      aria-live="polite"
      className={`border border-[#D8D3B5] bg-[#F5F5E9] ${compact ? "p-3" : "mb-6 p-4"}`}
    >
      <div className="flex items-start gap-3">
        {hasFreeShipping ? (
          <CheckCircle2 size={compact ? 17 : 19} className="mt-0.5 flex-none text-[#5B5B38]" />
        ) : (
          <Truck size={compact ? 17 : 19} className="mt-0.5 flex-none text-[#5B5B38]" />
        )}
        <div className="min-w-0 flex-1">
          <p className={`font-body font-medium text-[#424226] ${compact ? "text-xs" : "text-sm"}`}>
            {hasFreeShipping
              ? "Deine Bestellung wird versandkostenfrei geliefert."
              : `Nur noch ${formatMoney(remaining)} bis zum kostenlosen Versand.`}
          </p>
          <div
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#DEDCC5]"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={FREE_SHIPPING_THRESHOLD}
            aria-valuenow={Math.min(subtotalAmount, FREE_SHIPPING_THRESHOLD)}
            aria-label={`Versandfortschritt: ${progress}%`}
          >
            <div
              className="h-full bg-[#5B5B38] transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          {!compact && (
            <p className="mt-2 font-body text-[11px] text-[#7D7D5D]">
              Kostenloser Versand ab {formatMoney(FREE_SHIPPING_THRESHOLD)} Bestellwert.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

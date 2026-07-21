import { useState } from "react";
import { X, Plus, AlertCircle, Pencil } from "lucide-react";
import { toast } from "sonner";

export interface Ingredient {
  id: string;
  name: string;
  description: string;
}

interface IngredientEditorProps {
  /** Currently selected ingredients */
  selected: Ingredient[];
  /** All available ingredients to choose from */
  available: Record<string, Ingredient>;
  /** Max number of ingredients allowed */
  maxCount: number;
  /** Min number of ingredients allowed */
  minCount: number;
  /** Callback when selection changes */
  onChange: (ingredients: Ingredient[]) => void;
  /** Product type label for UI */
  productLabel: string;
  /** Icon component */
  icon: React.ReactNode;
}

/** IDs that are mutually exclusive */
const INCOMPATIBLE_PAIRS: [string, string][] = [["vitaminc", "niacinamide"]];

function areIncompatible(id1: string, id2: string): boolean {
  return INCOMPATIBLE_PAIRS.some(
    ([a, b]) => (a === id1 && b === id2) || (a === id2 && b === id1)
  );
}

export default function IngredientEditor({
  selected,
  available,
  maxCount,
  minCount,
  onChange,
  productLabel,
  icon,
}: IngredientEditorProps) {
  const [isEditing, setIsEditing] = useState(false);

  const selectedIds = selected.map((i) => i.id);

  const handleRemove = (id: string) => {
    if (selected.length <= minCount) {
      toast.error(`Mindestens ${minCount} Wirkstoffe erforderlich.`);
      return;
    }
    onChange(selected.filter((i) => i.id !== id));
  };

  const handleAdd = (id: string) => {
    if (selected.length >= maxCount) {
      toast.error(`Maximal ${maxCount} Wirkstoffe möglich.`);
      return;
    }

    // Check incompatibility
    const hasIncompatible = selectedIds.some((existingId) =>
      areIncompatible(existingId, id)
    );
    if (hasIncompatible) {
      const conflicting = id === "vitaminc" ? "Niacinamide" : "Vitamin C";
      toast.error(
        `${available[id].name} kann nicht mit ${conflicting} kombiniert werden.`
      );
      return;
    }

    const ingredient = available[id];
    if (ingredient) {
      onChange([...selected, ingredient]);
    }
  };

  const handleReplace = (oldId: string, newId: string) => {
    // Check incompatibility with remaining ingredients
    const remainingIds = selectedIds.filter((id) => id !== oldId);
    const hasIncompatible = remainingIds.some((existingId) =>
      areIncompatible(existingId, newId)
    );
    if (hasIncompatible) {
      const conflicting = newId === "vitaminc" ? "Niacinamide" : "Vitamin C";
      toast.error(
        `${available[newId].name} kann nicht mit ${conflicting} kombiniert werden.`
      );
      return;
    }

    const newIngredient = available[newId];
    if (newIngredient) {
      onChange(selected.map((i) => (i.id === oldId ? newIngredient : i)));
    }
  };

  // Available ingredients that are not yet selected
  const unselectedIngredients = Object.values(available).filter(
    (i) => !selectedIds.includes(i.id)
  );

  // Check which unselected ingredients would be incompatible
  const getIsDisabled = (id: string): boolean => {
    return selectedIds.some((existingId) => areIncompatible(existingId, id));
  };

  if (!isEditing) {
    return (
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {selected.map((ingredient) => (
            <div
              key={ingredient.id}
              className="bg-white p-4 rounded-lg border border-[#E5E0D8]"
            >
              <div className="flex items-center gap-2 mb-2">
                {icon}
                <span className="font-body text-xs font-medium text-[#5B5B38] uppercase tracking-wide">
                  Wirkstoff
                </span>
              </div>
              <h4 className="font-display text-base text-[#1C1C1A] font-light mb-1">
                {ingredient.name}
              </h4>
              <p className="font-body text-xs text-[#6B6B69] leading-relaxed">
                {ingredient.description}
              </p>
            </div>
          ))}
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="font-body text-xs tracking-[0.12em] uppercase text-[#5B5B38] hover:text-[#424226] transition-colors flex items-center gap-2 mb-6"
        >
          <Pencil size={12} />
          Wirkstoffe anpassen
        </button>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* Selected ingredients with remove buttons */}
      <p className="font-body text-xs tracking-[0.12em] uppercase text-[#7D7D5D] mb-3">
        Ausgewählt ({selected.length}/{maxCount})
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {selected.map((ingredient) => (
          <div
            key={ingredient.id}
            className="bg-[#5B5B38]/10 p-4 rounded-lg border-2 border-[#5B5B38] relative group"
          >
            <button
              onClick={() => handleRemove(ingredient.id)}
              className="absolute top-2 right-2 w-6 h-6 bg-[#5B5B38] text-white rounded-full flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity"
              title="Entfernen"
            >
              <X size={12} />
            </button>
            <div className="flex items-center gap-2 mb-2">
              {icon}
              <span className="font-body text-xs font-medium text-[#5B5B38] uppercase tracking-wide">
                Wirkstoff
              </span>
            </div>
            <h4 className="font-display text-sm text-[#1C1C1A] font-light mb-1 pr-6">
              {ingredient.name}
            </h4>
            <p className="font-body text-xs text-[#6B6B69] leading-relaxed">
              {ingredient.description}
            </p>
          </div>
        ))}
      </div>

      {/* Available ingredients to add */}
      {selected.length < maxCount && (
        <>
          <p className="font-body text-xs tracking-[0.12em] uppercase text-[#7D7D5D] mb-3">
            Verfügbare Wirkstoffe
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {unselectedIngredients.map((ingredient) => {
              const disabled = getIsDisabled(ingredient.id);
              return (
                <button
                  key={ingredient.id}
                  onClick={() => handleAdd(ingredient.id)}
                  disabled={disabled}
                  className={`text-left p-4 rounded-lg border transition-all duration-200 ${
                    disabled
                      ? "border-[#E5E0D8] bg-[#F8F5F0] opacity-50 cursor-not-allowed"
                      : "border-[#E5E0D8] bg-white hover:border-[#5B5B38] hover:shadow-sm cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {disabled ? (
                      <AlertCircle size={14} className="text-red-400" />
                    ) : (
                      <Plus size={14} className="text-[#5B5B38]" />
                    )}
                    <span className="font-body text-xs font-medium text-[#7D7D5D] uppercase tracking-wide">
                      {disabled ? "Inkompatibel" : "Hinzufügen"}
                    </span>
                  </div>
                  <h4 className="font-display text-sm text-[#1C1C1A] font-light mb-1">
                    {ingredient.name}
                  </h4>
                  <p className="font-body text-xs text-[#6B6B69] leading-relaxed">
                    {ingredient.description}
                  </p>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Incompatibility note */}
      <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200 mb-4">
        <AlertCircle size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="font-body text-xs text-amber-800">
          Vitamin C und Niacinamide können nicht kombiniert werden, da sie sich gegenseitig in ihrer Wirkung beeinträchtigen.
        </p>
      </div>

      <button
        onClick={() => setIsEditing(false)}
        className="bg-[#5B5B38] text-[#F8F5F0] font-body text-xs tracking-[0.12em] uppercase px-5 py-3 rounded-sm hover:bg-[#424226] transition-colors duration-300"
      >
        Fertig
      </button>
    </div>
  );
}

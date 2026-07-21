import { useTranslation } from "react-i18next";

/**
 * Custom hook to provide type-safe translations
 * Usage: const t = useTranslations();
 *        const text = t("common.language");
 */
export function useTranslations() {
  const { t } = useTranslation();
  return t;
}

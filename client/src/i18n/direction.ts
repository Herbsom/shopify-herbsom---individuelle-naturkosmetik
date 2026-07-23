export type TextDirection = "ltr" | "rtl";

const RTL_LANGUAGES = new Set(["ar"]);

export function normalizeLanguageCode(language: string): string {
  return language.trim().toLowerCase().split(/[-_]/)[0] || "de";
}

export function getTextDirection(language: string): TextDirection {
  return RTL_LANGUAGES.has(normalizeLanguageCode(language)) ? "rtl" : "ltr";
}

export interface LanguageDirectionSource {
  language: string;
  resolvedLanguage?: string;
  on(event: "languageChanged", listener: (language: string) => void): unknown;
}

export function applyDocumentLanguage(
  language: string,
  targetDocument: Document | undefined =
    typeof document === "undefined" ? undefined : document
): { language: string; direction: TextDirection } {
  const normalizedLanguage = normalizeLanguageCode(language);
  const direction = getTextDirection(normalizedLanguage);

  if (targetDocument) {
    targetDocument.documentElement.lang = normalizedLanguage;
    targetDocument.documentElement.dir = direction;
  }

  return { language: normalizedLanguage, direction };
}

export function bindDocumentDirection(
  source: LanguageDirectionSource,
  targetDocument: Document | undefined =
    typeof document === "undefined" ? undefined : document
): (language: string) => void {
  const synchronize = (language: string) => {
    applyDocumentLanguage(language, targetDocument);
  };

  source.on("languageChanged", synchronize);
  synchronize(source.resolvedLanguage ?? source.language ?? "de");

  return synchronize;
}

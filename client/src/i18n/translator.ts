import { TFunction } from 'i18next';

// Cache for translated strings to avoid repeated API calls
const translationCache = new Map<string, Map<string, string>>();

// Supported languages
const SUPPORTED_LANGUAGES = ['de', 'en', 'fr', 'ar', 'sv', 'nl'];

/**
 * Translate text to target language using Manus Built-in Translation API
 * Falls back to the original text if translation fails
 */
export async function translateText(
  text: string,
  targetLanguage: string,
  sourceLanguage: string = 'de'
): Promise<string> {
  // Don't translate if source and target are the same
  if (sourceLanguage === targetLanguage) {
    return text;
  }

  // Check cache first
  if (!translationCache.has(targetLanguage)) {
    translationCache.set(targetLanguage, new Map());
  }

  const langCache = translationCache.get(targetLanguage)!;
  if (langCache.has(text)) {
    return langCache.get(text)!;
  }

  try {
    // Use Manus Built-in Translation API
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        sourceLanguage,
        targetLanguage,
      }),
    });

    if (!response.ok) {
      console.warn(`Translation API error: ${response.statusText}`);
      return text;
    }

    const data = await response.json();
    const translatedText = data.translatedText || text;

    // Cache the translation
    langCache.set(text, translatedText);

    return translatedText;
  } catch (error) {
    console.warn(`Translation error for "${text}":`, error);
    return text;
  }
}

/**
 * Batch translate multiple texts
 */
export async function translateBatch(
  texts: string[],
  targetLanguage: string,
  sourceLanguage: string = 'de'
): Promise<Map<string, string>> {
  const results = new Map<string, string>();

  for (const text of texts) {
    const translated = await translateText(text, targetLanguage, sourceLanguage);
    results.set(text, translated);
  }

  return results;
}

/**
 * Clear translation cache
 */
export function clearTranslationCache(): void {
  translationCache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { language: string; entries: number }[] {
  return Array.from(translationCache.entries()).map(([lang, cache]) => ({
    language: lang,
    entries: cache.size,
  }));
}

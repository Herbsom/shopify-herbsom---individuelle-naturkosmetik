import { publicProcedure, router } from '../_core/trpc';
import { z } from 'zod';
import { invokeLLM } from '../_core/llm';

// Server-side cache: targetLanguage -> (originalText -> translatedText)
const translationCache = new Map<string, Map<string, string>>();

const LANGUAGE_NAMES: Record<string, string> = {
  de: 'German',
  en: 'English',
  fr: 'French',
  ar: 'Arabic',
  sv: 'Swedish',
  nl: 'Dutch',
};

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Translate a small chunk of texts in a single LLM call.
 * Returns a mapping of original -> translated.
 */
async function translateChunk(
  texts: string[],
  sourceLanguage: string,
  targetLanguage: string,
  retries = 2
): Promise<Record<string, string>> {
  const sourceLangName = LANGUAGE_NAMES[sourceLanguage] || sourceLanguage;
  const targetLangName = LANGUAGE_NAMES[targetLanguage] || targetLanguage;

  // Create a numbered list for the LLM
  const numbered = texts.map((t, i) => `[${i}] ${t}`).join('\n');

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await invokeLLM({
        messages: [
          {
            role: 'system',
            content: `You are a professional translator for a skincare website called Herbsom.
Translate each numbered item from ${sourceLangName} to ${targetLangName}.
Rules:
- Return ONLY a JSON object like: {"0": "translation0", "1": "translation1", ...}
- Use the number as the key (as string)
- Keep brand names (Herbsom), URLs, emails, and numbers unchanged
- Preserve ALL CAPS formatting if the original is ALL CAPS
- Keep short UI labels concise (e.g. "Zurück" -> "Back")
- No explanations, just the JSON object`,
          },
          {
            role: 'user',
            content: numbered,
          },
        ],
      });

      const content = response.choices[0]?.message?.content;
      if (!content || typeof content !== 'string') return {};

      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return {};

      const parsed = JSON.parse(jsonMatch[0]) as Record<string, string>;
      // Map back from index to original text
      const result: Record<string, string> = {};
      texts.forEach((text, i) => {
        const translated = parsed[String(i)];
        if (translated) {
          result[text] = translated;
        }
      });
      return result;
    } catch (err: unknown) {
      const errMsg = String(err);
      const isRateLimit = errMsg.includes('412') || errMsg.includes('rate limit');
      if (isRateLimit && attempt < retries) {
        const waitMs = 2000 * (attempt + 1);
        console.log(`[Translation] Rate limited, waiting ${waitMs}ms before retry ${attempt + 1}/${retries}`);
        await sleep(waitMs);
        continue;
      }
      console.error(`[Translation] Chunk failed after ${attempt + 1} attempts:`, errMsg);
      return {};
    }
  }
  return {};
}

export const translationRouter = router({
  translate: publicProcedure
    .input(
      z.object({
        text: z.string().min(1),
        sourceLanguage: z.string().default('de'),
        targetLanguage: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { text, sourceLanguage, targetLanguage } = input;

      if (sourceLanguage === targetLanguage) {
        return { translatedText: text };
      }

      if (!translationCache.has(targetLanguage)) {
        translationCache.set(targetLanguage, new Map());
      }
      const langCache = translationCache.get(targetLanguage)!;

      if (langCache.has(text)) {
        return { translatedText: langCache.get(text)! };
      }

      try {
        const results = await translateChunk([text], sourceLanguage, targetLanguage);
        const translatedText = results[text] || text;
        langCache.set(text, translatedText);
        return { translatedText };
      } catch (error) {
        console.error(`Translation error:`, error);
        return { translatedText: text };
      }
    }),

  translateBatch: publicProcedure
    .input(
      z.object({
        texts: z.array(z.string()),
        sourceLanguage: z.string().default('de'),
        targetLanguage: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { texts, sourceLanguage, targetLanguage } = input;

      if (sourceLanguage === targetLanguage) {
        const results: Record<string, string> = {};
        texts.forEach(t => { results[t] = t; });
        return { results };
      }

      if (!translationCache.has(targetLanguage)) {
        translationCache.set(targetLanguage, new Map());
      }
      const langCache = translationCache.get(targetLanguage)!;

      // Separate cached from uncached
      const results: Record<string, string> = {};
      const uncached: string[] = [];

      for (const text of texts) {
        if (langCache.has(text)) {
          results[text] = langCache.get(text)!;
        } else {
          uncached.push(text);
        }
      }

      if (uncached.length === 0) {
        return { results };
      }

      console.log(`[Translation] Translating ${uncached.length} uncached texts to ${targetLanguage}`);

      // Process chunks in PARALLEL for maximum speed (3 concurrent LLM calls)
      const CHUNK_SIZE = 40;
      const MAX_PARALLEL = 3;
      const chunks: string[][] = [];
      for (let i = 0; i < uncached.length; i += CHUNK_SIZE) {
        chunks.push(uncached.slice(i, i + CHUNK_SIZE));
      }
      console.log(`[Translation] ${chunks.length} chunks, max ${MAX_PARALLEL} parallel`);

      for (let b = 0; b < chunks.length; b += MAX_PARALLEL) {
        const batch = chunks.slice(b, b + MAX_PARALLEL);
        const batchResults = await Promise.all(
          batch.map(chunk => translateChunk(chunk, sourceLanguage, targetLanguage))
        );
        for (let bi = 0; bi < batch.length; bi++) {
          const chunk = batch[bi];
          const translated = batchResults[bi];
          for (const text of chunk) {
            const translatedText = translated[text] || text;
            langCache.set(text, translatedText);
            results[text] = translatedText;
          }
        }
        console.log(`[Translation] Batch ${Math.floor(b/MAX_PARALLEL)+1}/${Math.ceil(chunks.length/MAX_PARALLEL)} done`);
      }

      return { results };
    }),

  clearCache: publicProcedure.mutation(() => {
    translationCache.clear();
    return { success: true };
  }),
});

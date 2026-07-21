/**
 * AutoTranslateProvider – Instant Translation
 *
 * Strategy:
 * 1. Static translations (334 pre-translated texts) are loaded synchronously from bundled JSON
 * 2. On language change, all known texts are replaced INSTANTLY (no network call)
 * 3. Any remaining uncached texts are translated via LLM in the background
 * 4. A subtle top bar shows progress only when LLM translation is needed
 *
 * Result: Pages with pre-translated content appear instantly translated.
 */

import {
  useEffect,
  useRef,
  useCallback,
  createContext,
  useContext,
  useSyncExternalStore,
} from 'react';
import { useTranslation } from 'react-i18next';
import { staticTranslations } from './static';

// ─── Cache ────────────────────────────────────────────────────────────────────

const LS_PREFIX = 'herbsom_tr_v5_';

function getFullCache(lang: string): Record<string, string> {
  // Start with static translations (always available, no network)
  const base = staticTranslations[lang] || {};
  // Merge with localStorage cache (has additional translations from LLM)
  try {
    const raw = localStorage.getItem(LS_PREFIX + lang);
    if (raw) {
      const dynamic = JSON.parse(raw) as Record<string, string>;
      return { ...base, ...dynamic };
    }
  } catch {}
  return { ...base };
}

function saveDynamicCache(lang: string, newEntries: Record<string, string>) {
  try {
    const raw = localStorage.getItem(LS_PREFIX + lang);
    const existing = raw ? JSON.parse(raw) : {};
    const merged = { ...existing, ...newEntries };
    localStorage.setItem(LS_PREFIX + lang, JSON.stringify(merged));
  } catch {}
}

// ─── DOM helpers ─────────────────────────────────────────────────────────────

const SKIP_TAGS = new Set([
  'SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE',
  'IFRAME', 'SVG', 'PATH', 'META', 'LINK', 'HEAD',
]);
const TRANSLATE_ATTRS = ['placeholder', 'title', 'aria-label', 'alt'];

const nodeOriginals = new WeakMap<Node, string>();
const attrOriginals = new WeakMap<Element, Record<string, string>>();

function skipEl(el: Element) {
  return SKIP_TAGS.has(el.tagName) || el.getAttribute('data-no-translate') === 'true';
}

function isTranslatable(text: string) {
  const t = text.trim();
  return t.length > 0 && /[a-zA-Z\u00C0-\u024F\u0600-\u06FF\u0400-\u04FF]/.test(t);
}

function gatherTextNodes(root: Node, out: Text[]) {
  if (root.nodeType === Node.ELEMENT_NODE && skipEl(root as Element)) return;
  if (root.nodeType === Node.TEXT_NODE) {
    if (isTranslatable(root.textContent || '')) out.push(root as Text);
    return;
  }
  root.childNodes.forEach(c => gatherTextNodes(c, out));
}

function gatherAttrEls(root: Element, out: Element[]) {
  if (skipEl(root)) return;
  if (TRANSLATE_ATTRS.some(a => { const v = root.getAttribute(a); return v && isTranslatable(v); })) {
    out.push(root);
  }
  Array.from(root.children).forEach(c => gatherAttrEls(c, out));
}

function storeOriginals(root: Element, forceUpdate = false) {
  const nodes: Text[] = [];
  gatherTextNodes(root, nodes);
  nodes.forEach(n => {
    const current = n.textContent || '';
    if (forceUpdate || !nodeOriginals.has(n)) {
      nodeOriginals.set(n, current);
    }
  });

  const els: Element[] = [];
  gatherAttrEls(root, els);
  els.forEach(el => {
    if (forceUpdate || !attrOriginals.has(el)) {
      const m: Record<string, string> = {};
      TRANSLATE_ATTRS.forEach(a => { const v = el.getAttribute(a); if (v) m[a] = v; });
      attrOriginals.set(el, m);
    }
  });
}

function applyTranslations(root: Element, cache: Record<string, string>) {
  const nodes: Text[] = [];
  gatherTextNodes(root, nodes);
  nodes.forEach(n => {
    const orig = nodeOriginals.get(n) ?? n.textContent ?? '';
    const trimmed = orig.trim();
    const tr = cache[trimmed];
    if (tr && tr !== trimmed) {
      const lead = orig.match(/^(\s*)/)?.[1] ?? '';
      const trail = orig.match(/(\s*)$/)?.[1] ?? '';
      n.textContent = lead + tr + trail;
    }
  });

  const els: Element[] = [];
  gatherAttrEls(root, els);
  els.forEach(el => {
    const origAttrs = attrOriginals.get(el);
    if (!origAttrs) return;
    TRANSLATE_ATTRS.forEach(a => {
      const orig = origAttrs[a];
      if (!orig) return;
      const tr = cache[orig.trim()];
      if (tr && tr !== orig.trim()) el.setAttribute(a, tr);
    });
  });
}

function restoreGerman(root: Element) {
  const nodes: Text[] = [];
  gatherTextNodes(root, nodes);
  nodes.forEach(n => {
    const orig = nodeOriginals.get(n);
    if (orig !== undefined) n.textContent = orig;
  });
  const els: Element[] = [];
  gatherAttrEls(root, els);
  els.forEach(el => {
    const origAttrs = attrOriginals.get(el);
    if (origAttrs) TRANSLATE_ATTRS.forEach(a => { if (origAttrs[a]) el.setAttribute(a, origAttrs[a]); });
  });
}

function collectUncached(root: Element, cache: Record<string, string>): string[] {
  const texts = new Set<string>();
  const nodes: Text[] = [];
  gatherTextNodes(root, nodes);
  nodes.forEach(n => {
    const orig = nodeOriginals.get(n) ?? n.textContent ?? '';
    const t = orig.trim();
    if (t && !(t in cache)) texts.add(t);
  });
  const els: Element[] = [];
  gatherAttrEls(root, els);
  els.forEach(el => {
    const origAttrs = attrOriginals.get(el);
    if (!origAttrs) return;
    TRANSLATE_ATTRS.forEach(a => {
      const v = origAttrs[a]?.trim();
      if (v && !(v in cache)) texts.add(v);
    });
  });
  return Array.from(texts);
}

// ─── Global state ─────────────────────────────────────────────────────────────

type TranslateState = { active: boolean; progress: number };
let _state: TranslateState = { active: false, progress: 100 };
const _listeners = new Set<() => void>();
function getSnapshot() { return _state; }
function subscribe(cb: () => void) { _listeners.add(cb); return () => _listeners.delete(cb); }
function setState(next: Partial<TranslateState>) {
  _state = { ..._state, ...next };
  _listeners.forEach(cb => cb());
}

// ─── Context ──────────────────────────────────────────────────────────────────

const TranslateContext = createContext<TranslateState>({ active: false, progress: 100 });
export function useAutoTranslateState() { return useContext(TranslateContext); }

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AutoTranslateProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const lang = (i18n.language || 'de').split('-')[0];
  const langRef = useRef(lang);
  const isRunning = useRef(false);
  const observerRef = useRef<MutationObserver | null>(null);
  const pendingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const state = useSyncExternalStore(subscribe, getSnapshot);

  const translatePage = useCallback(async (targetLang: string) => {
    if (isRunning.current) return;

    const root = document.getElementById('root');
    if (!root) return;

    if (targetLang === 'de') {
      restoreGerman(root);
      setState({ active: false, progress: 100 });
      return;
    }

    isRunning.current = true;

    try {
      // Step 1: Store originals
      storeOriginals(root);

      // Step 2: Get full cache (static + localStorage)
      const cache = getFullCache(targetLang);

      // Step 3: Apply cached translations IMMEDIATELY (synchronous, no network)
      applyTranslations(root, cache);

      // Step 4: Check if there are uncached texts
      const uncached = collectUncached(root, cache);

      if (uncached.length === 0) {
        // Everything was in cache - no loading indicator needed!
        setState({ active: false, progress: 100 });
        return;
      }

      // Step 5: Show loading bar for remaining texts
      setState({ active: true, progress: 10 });

      try {
        const response = await fetch('/api/trpc/translation.translateBatch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            json: {
              texts: uncached,
              sourceLanguage: 'de',
              targetLanguage: targetLang,
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const results: Record<string, string> =
            data?.result?.data?.json?.results || {};

          // Save to dynamic cache
          saveDynamicCache(targetLang, results);

          // Apply new translations
          const fullCache = { ...cache, ...results };
          applyTranslations(root, fullCache);

          setState({ active: false, progress: 100 });
        } else {
          setState({ active: false, progress: 100 });
        }
      } catch {
        setState({ active: false, progress: 100 });
      }
    } finally {
      isRunning.current = false;
    }
  }, []);

  // Language change
  useEffect(() => {
    if (langRef.current === lang) return;
    langRef.current = lang;
    translatePage(lang);
  }, [lang, translatePage]);

  // Initial mount (if language is not German)
  useEffect(() => {
    if (lang === 'de') return;
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => translatePage(lang));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // MutationObserver: apply translations to new DOM nodes AND text changes
  useEffect(() => {
    if (lang === 'de') {
      observerRef.current?.disconnect();
      return;
    }

    const observer = new MutationObserver((mutations) => {
      // Detect both new nodes and text content changes (React re-renders)
      let hasRelevantChange = false;
      for (const m of mutations) {
        if (m.type === 'characterData') {
          // Text node content changed (React updated text)
          const node = m.target as Text;
          const newText = node.textContent || '';
          const oldOriginal = nodeOriginals.get(node);
          // If the new text is different from what we stored AND it looks like German source text
          if (oldOriginal !== newText && isTranslatable(newText)) {
            // Update the original to the new German text
            nodeOriginals.set(node, newText);
            hasRelevantChange = true;
          }
        } else if (m.addedNodes.length > 0) {
          for (let i = 0; i < m.addedNodes.length; i++) {
            const n = m.addedNodes[i];
            if (n.nodeType === Node.TEXT_NODE || 
                (n.nodeType === Node.ELEMENT_NODE && (n as Element).textContent?.trim())) {
              hasRelevantChange = true;
              break;
            }
          }
        }
      }
      if (!hasRelevantChange) return;

      // Immediately apply static + cached translations to new/changed content
      const root = document.getElementById('root');
      if (!root) return;
      storeOriginals(root, true);
      const cache = getFullCache(lang);
      applyTranslations(root, cache);

      // Debounce LLM call for any remaining uncached texts
      if (pendingRef.current) clearTimeout(pendingRef.current);
      pendingRef.current = setTimeout(() => {
        if (!isRunning.current) translatePage(lang);
      }, 300);
    });

    const root = document.getElementById('root');
    if (root) observer.observe(root, { childList: true, subtree: true, characterData: true });
    observerRef.current = observer;
    return () => {
      observer.disconnect();
      if (pendingRef.current) clearTimeout(pendingRef.current);
    };
  }, [lang, translatePage]);

  return (
    <TranslateContext.Provider value={state}>
      {children}
      <TranslationBar />
    </TranslateContext.Provider>
  );
}

// ─── Translation Bar (only shows when LLM is needed) ─────────────────────────

function TranslationBar() {
  const { active } = useSyncExternalStore(subscribe, getSnapshot);
  const { i18n } = useTranslation();
  const lang = (i18n.language || 'de').split('-')[0];

  const labels: Record<string, string> = {
    en: 'Translating remaining text…',
    fr: 'Traduction en cours…',
    ar: 'جارٍ الترجمة…',
    sv: 'Översätter…',
    nl: 'Vertalen…',
    de: 'Wird übersetzt…',
  };
  const label = labels[lang] ?? labels.en;

  if (!active) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 99999,
      background: 'rgba(20,20,20,0.9)',
      backdropFilter: 'blur(4px)',
      color: '#fff',
      fontSize: '12px',
      fontFamily: 'inherit',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '5px 16px',
      animation: 'trFadeIn 0.15s ease-out',
    }}>
      <style>{`@keyframes trFadeIn{from{opacity:0;transform:translateY(-100%)}to{opacity:1;transform:translateY(0)}}@keyframes trSpin{to{transform:rotate(360deg)}}`}</style>
      <div style={{
        width: '10px',
        height: '10px',
        border: '1.5px solid rgba(255,255,255,0.3)',
        borderTopColor: '#fff',
        borderRadius: '50%',
        animation: 'trSpin 0.7s linear infinite',
      }} />
      <span>{label}</span>
    </div>
  );
}

import { describe, expect, it } from "vitest";
import {
  applyDocumentLanguage,
  bindDocumentDirection,
  getTextDirection,
  normalizeLanguageCode,
  type LanguageDirectionSource,
} from "../client/src/i18n/direction";

function createDocumentDouble() {
  const documentElement = { lang: "", dir: "" };
  return {
    documentElement,
    document: { documentElement } as unknown as Document,
  };
}

describe("document language direction", () => {
  it("normalizes regional and underscore language codes", () => {
    expect(normalizeLanguageCode("ar-SA")).toBe("ar");
    expect(normalizeLanguageCode("DE_de")).toBe("de");
  });

  it("uses RTL only for Arabic", () => {
    expect(getTextDirection("ar")).toBe("rtl");
    expect(getTextDirection("ar-SA")).toBe("rtl");
    expect(getTextDirection("de")).toBe("ltr");
    expect(getTextDirection("en")).toBe("ltr");
  });

  it("sets lang and dir on the document element", () => {
    const target = createDocumentDouble();
    const result = applyDocumentLanguage("ar-SA", target.document);

    expect(result).toEqual({ language: "ar", direction: "rtl" });
    expect(target.documentElement.lang).toBe("ar");
    expect(target.documentElement.dir).toBe("rtl");
  });

  it("synchronizes the initial language and later language changes", () => {
    const target = createDocumentDouble();
    let languageChanged: ((language: string) => void) | undefined;
    const source: LanguageDirectionSource = {
      language: "de",
      on: (_event, listener) => {
        languageChanged = listener;
      },
    };

    bindDocumentDirection(source, target.document);
    expect(target.documentElement.lang).toBe("de");
    expect(target.documentElement.dir).toBe("ltr");

    languageChanged?.("ar");
    expect(target.documentElement.lang).toBe("ar");
    expect(target.documentElement.dir).toBe("rtl");

    languageChanged?.("nl");
    expect(target.documentElement.lang).toBe("nl");
    expect(target.documentElement.dir).toBe("ltr");
  });
});

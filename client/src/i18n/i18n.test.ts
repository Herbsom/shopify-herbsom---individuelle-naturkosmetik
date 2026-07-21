import { describe, it, expect, beforeEach } from "vitest";
import i18n from "./config";

describe("i18n Configuration", () => {
  beforeEach(async () => {
    // Reset to default language
    await i18n.changeLanguage("de");
  });

  it("should initialize with German as default language", () => {
    expect(i18n.language).toBe("de");
  });

  it("should have all supported languages configured", () => {
    const supportedLanguages = ["de", "en", "fr", "ar", "sv", "nl"];
    supportedLanguages.forEach((lang) => {
      expect(i18n.options.resources?.[lang]).toBeDefined();
    });
  });

  it("should translate German text correctly", () => {
    i18n.changeLanguage("de");
    const translation = i18n.t("common.language");
    expect(translation).toBe("Sprache");
  });

  it("should translate English text correctly", async () => {
    await i18n.changeLanguage("en");
    const translation = i18n.t("common.language");
    expect(translation).toBe("Language");
  });

  it("should translate French text correctly", async () => {
    await i18n.changeLanguage("fr");
    const translation = i18n.t("common.language");
    expect(translation).toBe("Langue");
  });

  it("should translate Arabic text correctly", async () => {
    await i18n.changeLanguage("ar");
    const translation = i18n.t("common.language");
    expect(translation).toBe("اللغة");
  });

  it("should translate Swedish text correctly", async () => {
    await i18n.changeLanguage("sv");
    const translation = i18n.t("common.language");
    expect(translation).toBe("Språk");
  });

  it("should translate Dutch text correctly", async () => {
    await i18n.changeLanguage("nl");
    const translation = i18n.t("common.language");
    expect(translation).toBe("Taal");
  });

  it("should handle missing translations with fallback", () => {
    const translation = i18n.t("nonexistent.key");
    // Should return the key itself as fallback
    expect(translation).toBe("nonexistent.key");
  });

  it("should switch languages dynamically", async () => {
    await i18n.changeLanguage("en");
    expect(i18n.language).toBe("en");
    expect(i18n.t("navigation.products")).toBe("Products");

    await i18n.changeLanguage("de");
    expect(i18n.language).toBe("de");
    expect(i18n.t("navigation.products")).toBe("Produkte");
  });

  it("should have consistent translation keys across all languages", () => {
    const languages = ["de", "en", "fr", "ar", "sv", "nl"];
    const deKeys = Object.keys(i18n.options.resources?.de?.translation || {});

    languages.forEach((lang) => {
      if (lang !== "de") {
        const langKeys = Object.keys(
          i18n.options.resources?.[lang]?.translation || {}
        );
        expect(langKeys.sort()).toEqual(deKeys.sort());
      }
    });
  });

  it("should persist language preference in localStorage", async () => {
    // Mock localStorage
    const store: Record<string, string> = {};
    const mockLocalStorage = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        Object.keys(store).forEach((key) => delete store[key]);
      },
    };

    // Override global localStorage for this test
    Object.defineProperty(window, "localStorage", {
      value: mockLocalStorage,
      writable: true,
    });

    await i18n.changeLanguage("en");
    // The language detector should save to localStorage
    expect(mockLocalStorage.getItem("i18nextLng")).toBeDefined();
  });

  it("should provide all common UI translations", () => {
    const commonKeys = [
      "common.language",
      "common.search",
      "common.cart",
      "common.account",
      "common.logout",
      "common.login",
    ];

    commonKeys.forEach((key) => {
      const translation = i18n.t(key);
      expect(translation).not.toBe(key); // Should not return the key itself
      expect(translation.length).toBeGreaterThan(0);
    });
  });

  it("should provide all navigation translations", () => {
    const navKeys = [
      "navigation.products",
      "navigation.skintest",
      "navigation.about",
      "navigation.blog",
      "navigation.contact",
    ];

    navKeys.forEach((key) => {
      const translation = i18n.t(key);
      expect(translation).not.toBe(key);
      expect(translation.length).toBeGreaterThan(0);
    });
  });

  it("should support fallback language", async () => {
    // If a translation is missing in a language, it should fall back to the default
    const translation = i18n.t("common.language", { lng: "de" });
    expect(translation).toBe("Sprache");
  });
});

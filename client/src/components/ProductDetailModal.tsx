/**
 * ProductDetailModal – Pop-up mit Produktdetails für Routine-Seiten
 * Zeigt Standardprodukte oder individuelle Creme/Serum mit Wirkstoffen
 * Design: Wie auf den Konfigurator-Seiten
 */
import { useEffect, useState } from "react";
import { X, Leaf, Beaker, Heart, Droplets, ShoppingCart, ArrowRight } from "lucide-react";
import { SERUM_INGREDIENT_DETAILS } from "./IngredientDetailModal";
import { useCart } from "@/contexts/CartContext";
import ShopifyPurchaseButton from "@/components/ShopifyPurchaseButton";

export interface ProductDetail {
  id: string;
  name: string;
  subtitle?: string;
  description: string;
  image?: string;
  anwendung?: string;
  hautprobleme?: string;
  hauttypen?: string;
  wirkung?: string;
  inhaltsstoffe?: { inci: string; name: string; funktion: string }[];
  // Für individuelle Produkte
  selectedIngredients?: { id: string; name: string }[];
  baseProduct?: { inci: string; name: string; funktion: string }[];
}

interface ProductDetailModalProps {
  product: ProductDetail | null;
  onClose: () => void;
}

// Standard product data for cleanser, peeling, sunscreen
export const STANDARD_PRODUCT_DETAILS: Record<string, ProductDetail> = {
  "intensivreiniger": {
    id: "intensivreiniger",
    name: "Reinigungsgel",
    subtitle: "Tiefenwirksames Reinigungsgel",
    description: "Tiefenwirksame Reinigung für ölige und unreine Haut. Entfernt überschüssigen Talg und befreit verstopfte Poren.",
    anwendung: "Morgens und abends auf das feuchte Gesicht auftragen, einmassieren und mit Wasser abspülen.",
    hautprobleme: "Pickel, Mitesser, Unreinheiten, Hautglanz, ölige Haut",
    hauttypen: "Ölige Haut, unreine Haut, Mischhaut",
    wirkung: "Unser Reinigungsgel entfernt intensiv Make-up, überschüssigen Talg und Bakterien. Dadurch wird neuen Pickeln, Mitessern und Unreinheiten vorgebeugt und bestehende heilen schneller ab. Milde Tenside und ein hautneutraler pH-Wert schützen die Hautbarriere während der Reinigung.",
    inhaltsstoffe: [
      { inci: "Aqua", name: "Wasser", funktion: "Wasser als neutrale, gut verträgliche Basis" },
      { inci: "Coco-Glucoside", name: "Coco-Glucoside", funktion: "Natürliches und sehr mildes Tensid, welches die Haut schonend und effektiv reinigt" },
      { inci: "Pentylene Glycol", name: "Pentylene Glycol", funktion: "Natürlicher Feuchtigkeitsspender und Konservierer" },
      { inci: "Sodium Cocoamphopropionate", name: "Sodium Cocoamphopropionate", funktion: "Natürliches und mildes Tensid, welches die Haut effektiv reinigt" },
      { inci: "Dicaprylyl Ether", name: "Dicaprylyl Ether", funktion: "Rückfettend, glättend, hautpflegend, macht die Haut geschmeidig" },
      { inci: "White Willow Bark Extract", name: "Weidenrindenextrakt", funktion: "Reguliert den Talgfluss und peelt die Haut sanft, anti-oxidativ, entzündungshemmend, adstringierend, regenerierend" },
      { inci: "Decyl Glucoside", name: "Decyl Glucoside", funktion: "Besonders hautverträgliches und natürliches Tensid, welches die Haut reinigt und dabei glatt und geschmeidig hält" },
      { inci: "Glycerin", name: "Natürliches Glycerin", funktion: "Intensiver und pflanzlicher Feuchtigkeitsspender" },
      { inci: "Dehydroxanthan Gum", name: "Dehydroxanthan Gum", funktion: "Verdickungsmittel, welches feuchtigkeitsbindend und straffend auf die Haut wirkt" },
      { inci: "Citric Acid", name: "Zitronensäure", funktion: "Entfernt Hautschüppchen und raue Stellen, glättet, mindert Falten und regt die Zellerneuerung an" },
      { inci: "Glyceryl Oleate", name: "Glyceryl Oleate", funktion: "Glättet und hält die Haut weich und geschmeidig" },
      { inci: "Xanthan Gum", name: "Xanthan Gum", funktion: "Feuchtigkeitsbindend, straffend und glättend" },
      { inci: "Viola Tricolor (Pansy) Extract", name: "Stiefmütterchenextrakt", funktion: "Antibakteriell, entzündungshemmend, feuchtigkeitsspendend, reinigend hautglättend, zellschützend" },
      { inci: "Achillea Millefolium (Yarrow) Extract", name: "Schafgarbenextrakt", funktion: "Entzündungshemmend, adstringierend, fördert die Neubildung von Hautzellen" },
    ],
  },
  "reinigungsgel": {
    id: "reinigungsgel",
    name: "Reinigungsgel",
    subtitle: "Hoch effektives Reinigungsgel",
    description: "Effektive Reinigung bei Unreinheiten, Pickeln und Mitessern.",
    anwendung: "Morgens und abends auf das feuchte Gesicht auftragen, einmassieren und mit Wasser abspülen.",
    hautprobleme: "Pickel, Mitesser, Unreinheiten, Hautglanz",
    hauttypen: "Normale Haut, unreine Haut, ölige Haut, Mischhaut",
    wirkung: "Unser Reinigungsgel entfernt intensiv Make-up, überschüssigen Talg und Bakterien. Dadurch wird neuen Pickeln, Mitessern und Unreinheiten vorgebeugt und bestehende heilen schneller ab. Milde Tenside und ein hautneutraler pH-Wert schützen die Hautbarriere während der Reinigung und verhindern, dass das Reinigungsgel die Haut austrocknet.",
    inhaltsstoffe: [
      { inci: "Aqua", name: "Wasser", funktion: "Wasser als neutrale, gut verträgliche Basis" },
      { inci: "Coco-Glucoside", name: "Coco-Glucoside", funktion: "Natürliches und sehr mildes Tensid, welches die Haut schonend und effektiv reinigt" },
      { inci: "Pentylene Glycol", name: "Pentylene Glycol", funktion: "Natürlicher Feuchtigkeitsspender und Konservierer" },
      { inci: "Sodium Cocoamphopropionate", name: "Sodium Cocoamphopropionate", funktion: "Natürliches und mildes Tensid, welches die Haut effektiv reinigt" },
      { inci: "Dicaprylyl Ether", name: "Dicaprylyl Ether", funktion: "Rückfettend, glättend, hautpflegend, macht die Haut geschmeidig" },
      { inci: "White Willow Bark Extract", name: "Weidenrindenextrakt", funktion: "Reguliert den Talgfluss und peelt die Haut sanft, anti-oxidativ, entzündungshemmend, adstringierend, regenerierend" },
      { inci: "Decyl Glucoside", name: "Decyl Glucoside", funktion: "Besonders hautverträgliches und natürliches Tensid, welches die Haut reinigt und dabei glatt und geschmeidig hält" },
      { inci: "Glycerin", name: "Natürliches Glycerin", funktion: "Intensiver und pflanzlicher Feuchtigkeitsspender" },
      { inci: "Dehydroxanthan Gum", name: "Dehydroxanthan Gum", funktion: "Verdickungsmittel, welches feuchtigkeitsbindend und straffend auf die Haut wirkt" },
      { inci: "Citric Acid", name: "Zitronensäure", funktion: "Entfernt Hautschüppchen und raue Stellen, glättet, mindert Falten und regt die Zellerneuerung an" },
      { inci: "Glyceryl Oleate", name: "Glyceryl Oleate", funktion: "Glättet und hält die Haut weich und geschmeidig" },
      { inci: "Xanthan Gum", name: "Xanthan Gum", funktion: "Feuchtigkeitsbindend, straffend und glättend" },
      { inci: "Viola Tricolor Extract", name: "Stiefmütterchenextrakt", funktion: "Antibakteriell, entzündungshemmend, feuchtigkeitsspendend, reinigend hautglättend, zellschützend" },
      { inci: "Achillea Millefolium Extract", name: "Schafgarbenextrakt", funktion: "Entzündungshemmend, adstringierend, fördert die Neubildung von Hautzellen" },
    ],
  },
  "reinigungsmilch": {
    id: "reinigungsmilch",
    name: "Reinigungsmilch",
    subtitle: "Sanfte Reinigung für trockene Haut",
    description: "Für trockene, reife & normale Haut. Reinigt effektiv ohne auszutrocknen. Wirkt rückfettend & beugt frühzeitiger Hautalterung vor.",
    anwendung: "Morgens und abends auf das feuchte Gesicht auftragen, einmassieren und mit Wasser abspülen.",
    hautprobleme: "Trockenheit, Rötungen, Irritationen",
    hauttypen: "Trockene Haut, Reife Haut, Normale Haut",
    wirkung: "Die Reinigungsmilch entfernt Verschmutzungen sanft und bewahrt gleichzeitig die natürliche Feuchtigkeitsbarriere. Sie wirkt rückfettend und beugt frühzeitiger Hautalterung vor.",
    inhaltsstoffe: [
      { inci: "Aqua", name: "Wasser", funktion: "Wasser als neutrale, gut verträgliche Basis" },
      { inci: "Glycerin", name: "Pflanzliches Glycerin", funktion: "Intensiver pflanzlicher Feuchtigkeitsspender" },
      { inci: "Pentylene Glycol", name: "Pentylene Glycol", funktion: "Natürlicher Feuchtigkeitsspender und Konservierer" },
      { inci: "Glyceryl Stearate Citrate", name: "Glyceryl Stearate Citrate", funktion: "Pflanzlicher Emulgator, der für ein glattes und angenehmes Hautgefühl sorgt" },
      { inci: "Coco-Glucoside", name: "Coco-Glucoside", funktion: "Natürliches und sehr mildes Tensid, welches die Haut schonend und effektiv reinigt" },
      { inci: "Maltooligosyl Glucoside", name: "Maltooligosyl Glucoside", funktion: "Texturgeber und Feuchtigkeitsspender für ein glattes Hautgefühl" },
      { inci: "Sodium Cocoyl Glycinate", name: "Sodium Cocoyl Glycinate", funktion: "Pflanzliches Tensid, welches schonend und mild reinigt, die Haut glättet und der Textur ein cremiges Gefühl verleiht" },
      { inci: "Prunus Domestica (Plum) Seed Oil, Hydrogenated Prunus Domestica (Plum) Seed Oil", name: "Pflaumenkernbutter", funktion: "Pflegt die Haut intensiv und reichhaltig, sorgt dafür, dass die Haut schneller regeneriert und ist feuchtigkeitsspendend" },
      { inci: "Hydrogenated Starch Hydrolysate", name: "Hydrogenated Starch Hydrolysate", funktion: "Feuchthaltemittel und Feuchtigkeitsspender" },
      { inci: "Papaver Somniferum (Opium Poppy) Seed Oil", name: "Mohnöl", funktion: "Stärkt die Hautbarriere, wirkt regenerativ, lindert Rötungen und Irritationen, feuchtigkeitsspendend und gegen trockene Haut" },
      { inci: "Vitis Vinifera (Grape) Seed Oil", name: "Traubenkernöl", funktion: "Zieht schnell ein, Anti-aging Wirkstoff, reduziert die Faltentiefe, verbessert Feuchtigkeit und Elastizität, regenerierend, entzündungshemmend, hilft bei der Heilung von Akne und Entzündungen" },
      { inci: "Xanthan Gum", name: "Xanthan Gum", funktion: "Feuchtigkeitsbindend, straffend und glättend" },
      { inci: "Sodium Stearoyl Glutamate", name: "Sodium Stearoyl Glutamate", funktion: "Emulgator, der reinigend und hautpflegend wirkt" },
      { inci: "Leontopodium Alpinum (Edelweiss) Extract", name: "Edelweissextrakt", funktion: "Anti-Aging Wirkstoff der die Schutzbarriere der Haut unterstützt, ihre Widerstandsfähigkeit erhöht und hautstraffend, zellschützend, faltenglättend und hauterneuernd wirkt" },
      { inci: "Lactic Acid", name: "Milchsäure", funktion: "Entfernt abgestorbene Hautschüppchen und überschüssigen Talg, trägt zu einem normalen Verhornung sprozess bei, bindet Feuchtigkeit und stärkt die Hautschutzbarriere" },
      { inci: "Tocopherol", name: "Vitamin E", funktion: "Regt die Kollagenbildung und Zellneubildung an, stärkt die Hautschutzbarriere, wirkt antioxidativ und verlangsamt dadurch die frühzeitige Hautalterung" },
    ],
  },
  "aha-pha-peeling": {
    id: "aha-pha-peeling",
    name: "AHA & PHA Peeling",
    subtitle: "Hoch effektives AHA & PHA Peeling",
    description: "Gegen Falten und frühzeitige Hautalterung, für eine glatte, strahlende Haut.",
    anwendung: "Auf gereinigte Haut auftragen, 15 Minuten einwirken lassen, dann abspülen oder auflassen.",
    hautprobleme: "Falten, Trockenheitsschüppchen, fahler Teint",
    hauttypen: "Trockene Haut, Reife Haut, Normale Haut",
    wirkung: "AHAs lösen abgestorbene Hautzellen, regen die Zellneubildung an und unterstützen die Kollagensynthese. PHAs verbessern die Feuchtigkeitsbindung, wodurch Linien optisch geglättet werden. Durch die Exfoliation werden melaninreiche Hautzellen abgetragen, wodurch Pigmentflecken verblassen.",
    inhaltsstoffe: [
      { inci: "Aqua", name: "Wasser", funktion: "Wasser als Basis" },
      { inci: "Glycolic Acid", name: "Glykolsäure (AHA)", funktion: "Chemische Exfoliation und Zellerneuerung" },
      { inci: "Gluconolactone", name: "Gluconolacton (PHA)", funktion: "Sanftere Exfoliation mit Feuchtigkeitspflege" },
      { inci: "Pentylene Glycol", name: "Pentylene Glycol", funktion: "Natürlicher Feuchtigkeitsspender und Konservierer" },
      { inci: "Propanediol", name: "Propanediol", funktion: "Natürliches Feuchthaltemittel" },
      { inci: "Glycerin", name: "Pflanzliches Glycerin", funktion: "Intensiver pflanzlicher Feuchtigkeitsspender" },
      { inci: "Niacinamide", name: "Niacinamid (Vitamin B3)", funktion: "Reguliert Talgproduktion und verfeinert Poren" },
      { inci: "Panthenol", name: "Provitamin B5", funktion: "Beruhigend und feuchtigkeitsspendend" },
      { inci: "Allantoin", name: "Allantoin", funktion: "Hautberuhigend, pflegend, glättend, hauterneuernd" },
      { inci: "Sodium Hydroxide", name: "Natriumhydroxid", funktion: "pH-Regulator für optimale Wirkstofffreigabe" },
      { inci: "Xanthan Gum", name: "Xanthan Gum", funktion: "Feuchtigkeitsbindend, straffend und glättend" },
      { inci: "Citric Acid", name: "Zitronensäure", funktion: "pH-Puffer und Antioxidans" },
    ],
  },
  "bha-azelainsaeure-peeling": {
    id: "bha-azelainsaeure-peeling",
    name: "BHA & Azelainsäure Peeling",
    subtitle: "Hoch effektives BHA & Azelainsäure Peeling",
    description: "Für Mischhaut, ölige Haut & normale Haut. Entfernt überschüssigen Talg porentief. Sichtbar reinere Haut: Gegen Mitesser & Pickel.",
    anwendung: "Bis zu zweimal pro Woche auf gereinigte Haut auftragen und 30 Minuten einwirken lassen.",
    hautprobleme: "Pickel, Mitesser, Unreinheiten, Hautglanz",
    hauttypen: "Mischhaut, ölige Haut, normale Haut",
    wirkung: "Das BHA & Azelainsäure Peeling dringt tief in die Poren ein und reguliert die Talgproduktion. Salicylsäure ist fettlöslich und dringt tiefer in die Poren ein. Azelainsäure wirkt antibakteriell und entzündungshemmend gegen Unreinheiten.",
    inhaltsstoffe: [
      { inci: "Aqua", name: "Wasser", funktion: "Wasser als Basis" },
      { inci: "Potassium Azeloyl Diglycinate", name: "Azelainsäure und Glycine", funktion: "Mindert Pigmentflecken, gleicht den Talgfluss der Haut aus und mildert Rötungen und Irritationen" },
      { inci: "Pentylene Glycol", name: "Pentylene Glycol", funktion: "Natürlicher Feuchtigkeitsspender und Konservierer" },
      { inci: "Propanediol", name: "Propanediol", funktion: "Natürliches Feuchthaltemittel" },
      { inci: "Glycerin", name: "Pflanzliches Glycerin (Kein Mineralöl!)", funktion: "Intensiver pflanzlicher Feuchtigkeitsspender" },
      { inci: "Azelaic Acid", name: "Azelainsäure", funktion: "Befreit die Haut von überschüssigem Talg und Hautschuppen. Gegen Akne, unreine Haut, Pickelmale Rosacea und Cuperose. Verfeinert das Hautbild" },
      { inci: "White Willow Bark Extract", name: "Weidenrindenextrakt", funktion: "Reguliert den Talgfluss und peelt die Haut sanft. Wirkt antioxidativ, entzündungshemmend, adstringierend, regenerierend" },
      { inci: "Maltodextrin", name: "Maltodextrin", funktion: "Verringert Hautreizungen und verbessert die Anti-Aging Aktivität" },
      { inci: "Panthenol", name: "Provitamin B5", funktion: "Beruhigend, wundheilend und entzündungshemmend" },
      { inci: "Allantoin", name: "Allantoin", funktion: "Hautberuhigend, pflegend, glättend, hauterneuernd" },
      { inci: "Salicylic Acid", name: "Salicylsäure (BHA)", funktion: "Reguliert die Talgproduktion, reinigt verstopfte Poren gründlich, wirkt entzündungshemmend und beruhigend" },
      { inci: "Bisabolol", name: "Bisabolol", funktion: "Lindert Entzündungen, Rötungen und Reizungen, wirkt heilungsfördernd entzündungshemmend und antibakteriell" },
      { inci: "Biosaccharide Gum-1", name: "Fucogel", funktion: "Feuchtigkeitsspendend, stimuliert die Zellerneuerung, fördert die Anti-Aging Aktivität und schützt vor Austrocknung" },
      { inci: "Cucumis Sativus (Cucumber) Fruit Extract", name: "Gurkenextrakt", funktion: "Versorgt mit Feuchtigkeit und beruhigt, wirkt abschwellend, lindert Rötungen und Schwellungen" },
      { inci: "Citric Acid", name: "Zitronensäure", funktion: "Entfernt Hautschüppchen und raue Stellen, glättet die Haut, regt die Zellerneuerung an und mindert Falten" },
      { inci: "Helianthus Annuus (Sunflower) Seed Oil", name: "Sonnenblumenöl", funktion: "Beruhigt, spendet Feuchtigkeit, stärkt die Hautbarriere und beugt Hautalterung vor" },
    ],
  },
  "sonnenschutz": {
    id: "sonnenschutz",
    name: "Sonnenschutzfluid SPF 50+",
    subtitle: "UVA, UVB & Blaulicht-Schutz",
    description: "Ultraleichtes Sonnenschutzfluid mit SPF 50+ für den täglichen Schutz. Die serumartige Textur zieht schnell ein, klebt nicht und schützt zuverlässig vor UVA-, UVB- und Blaulicht-Strahlung. Ideal für die tägliche Anwendung.",
    anwendung: "Nach Serum und Creme mit der 2-Finger-Regel auf Gesicht und Hals auftragen.",
    hautprobleme: "Sonnenbrand, lichtbedingte Hautalterung, Pigmentflecken, Blaulicht-Stress",
    hauttypen: "Alle Hauttypen",
    wirkung: "Unsere Formel kombiniert modernste UV-Filter mit hoch effektiver Pflege. Die Haut ist nicht nur optimal vor UV-Strahlen, sondern auch vor Umwelteinflüssen und Feuchtigkeitsverlust geschützt. Breitband-Schutz vor UVA-, UVB- und Blaulicht mit ultraleichter Textur, kein Weißfilm.",
    inhaltsstoffe: [
      { inci: "Aqua", name: "Wasser", funktion: "Lösungsmittel, Basis der Formulierung, Feuchtigkeitsspender" },
      { inci: "Dibutyl Adipate", name: "Emollient", funktion: "Verbessert Hautgefühl, macht die Haut geschmeidig" },
      { inci: "Propylene Glycol Dicaprylate/Dicaprate", name: "Leichtes Hautöl", funktion: "Pflegt die Haut, ohne Poren zu verstopfen" },
      { inci: "Polyglyceryl-10 Oleate", name: "Natürlicher Emulgator", funktion: "Verbindet Wasser und Öl" },
      { inci: "Phenylbenzimidazole Sulfonic Acid", name: "UVB-Filter", funktion: "Schützt vor Sonnenbrand, Hautalterung und Hautkrebs" },
      { inci: "Disodium Phenyl Dibenzimidazole Tetrasulfonate", name: "UV-Filter", funktion: "Ergänzt UV-Schutzspektrum" },
      { inci: "Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine", name: "Breitband-UV-Filter (Tinosorb S)", funktion: "Schutz vor UVA- und UVB-Strahlung, sehr photostabil" },
      { inci: "Glycerin", name: "Pflanzliches Glycerin (Kein Mineralöl!)", funktion: "Intensiver pflanzlicher Feuchtigkeitsspender" },
      { inci: "Diethylamino Hydroxybenzoyl Hexyl Benzoate", name: "UVA-Filter", funktion: "Schützt vor Hautalterung durch UVA-Strahlen" },
      { inci: "Hectorite", name: "Tonmineral", funktion: "Natürliches Verdickungsmittel, stabilisiert die Textur" },
      { inci: "Pentylene Glycol", name: "Feuchthaltemittel", funktion: "Spendet Feuchtigkeit, leicht antimikrobiell" },
      { inci: "Ethylhexyl Triazone", name: "UVB-Filter", funktion: "Sehr effizienter Schutz vor UVB-Strahlen" },
      { inci: "Terephthalylidene Dicamphor Sulfonic Acid", name: "UVA/UVB-Filter", funktion: "Breitband-Schutz" },
      { inci: "Tromethamine", name: "pH-Regulator", funktion: "Stabilisiert den pH-Wert" },
      { inci: "Propanediol", name: "Feuchthaltemittel", funktion: "Spendet Feuchtigkeit, verbessert Aufnahme" },
      { inci: "1,2-Hexanediol", name: "Feuchthaltemittel", funktion: "Konservierend, feuchtigkeitsspendend" },
      { inci: "Tocopherol", name: "Vitamin E", funktion: "Antioxidativ, schützt vor freien Radikalen" },
      { inci: "Lycopene", name: "Lycopin", funktion: "Starkes Antioxidans" },
      { inci: "Helianthus Annuus Seed Oil", name: "Sonnenblumenöl", funktion: "Pflegend, antioxidativ" },
      { inci: "Buddleja Officinalis Flower Extract", name: "Schmetterlingsflieder-Extrakt", funktion: "Antioxidativ, schützt vor Umweltstress" },
      { inci: "Ceramide NP", name: "Ceramid", funktion: "Stärkt Hautbarriere" },
      { inci: "2,3-Butanediol", name: "Feuchthaltemittel", funktion: "Unterstützt Feuchtigkeitsversorgung" },
      { inci: "Sodium Hyaluronate", name: "Hyaluronsäure", funktion: "Bindet Wasser, polstert die Haut auf" },
      { inci: "Tremella Fuciformis Extract", name: "Schneepilz-Extrakt", funktion: "Spendet intensiv Feuchtigkeit, glättend" },
      { inci: "Ascorbyl Isostearate", name: "Vitamin-C-Derivat", funktion: "Antioxidativ, unterstützt Hautausgleichend" },
      { inci: "Isostearic Acid", name: "Fettsäure", funktion: "Stabilisiert Formulierung, pflegend" },
      { inci: "Malva Sylvestris Flower Extract", name: "Malvenextrakt", funktion: "Beruhigend, feuchtigkeitsspendend" },
      { inci: "Hydrogenated Lecithin", name: "Lecithin", funktion: "Unterstützt Hautbarriere, verbessert Aufnahme" },
      { inci: "Leuconostoc/Radish Root Ferment Filtrate", name: "Ferment-Extrakt", funktion: "Natürlicher Konservierer, pflegend" },
      { inci: "Glyceryl Stearate", name: "Emulgator", funktion: "Stabilisiert Emulsion" },
      { inci: "Ceramide AP", name: "Ceramid", funktion: "Stärkt Hautbarriere" },
      { inci: "Ceramide AS", name: "Ceramid", funktion: "Unterstützt Hautschutz" },
      { inci: "Ceramide NG", name: "Ceramid", funktion: "Regenerierend" },
      { inci: "Cholesterol", name: "Cholesterin", funktion: "Bestandteil der Hautbarriere" },
      { inci: "Ascorbic Acid", name: "Vitamin C", funktion: "Antioxidativ, fördert Kollagenbildung" },
      { inci: "Ceramide EOP", name: "Ceramid", funktion: "Unterstützt Hautstruktur und Feuchtigkeit" },
    ],
  },
  "sunscreen": {
    id: "sunscreen",
    name: "Sonnenschutzfluid SPF 50+",
    subtitle: "UVA, UVB & Blaulicht-Schutz",
    description: "Ultraleichtes Sonnenschutzfluid mit SPF 50+ für den täglichen Schutz. Die serumartige Textur zieht schnell ein, klebt nicht und schützt zuverlässig vor UVA-, UVB- und Blaulicht-Strahlung. Ideal für die tägliche Anwendung.",
    anwendung: "Nach Serum und Creme mit der 2-Finger-Regel auf Gesicht und Hals auftragen.",
    hautprobleme: "Sonnenbrand, lichtbedingte Hautalterung, Pigmentflecken, Blaulicht-Stress",
    hauttypen: "Alle Hauttypen",
    wirkung: "Unsere Formel kombiniert modernste UV-Filter mit hoch effektiver Pflege. Die Haut ist nicht nur optimal vor UV-Strahlen, sondern auch vor Umwelteinflüssen und Feuchtigkeitsverlust geschützt. Breitband-Schutz vor UVA-, UVB- und Blaulicht mit ultraleichter Textur, kein Weißfilm.",
    inhaltsstoffe: [
      { inci: "Aqua", name: "Wasser", funktion: "Lösungsmittel, Basis der Formulierung, Feuchtigkeitsspender" },
      { inci: "Dibutyl Adipate", name: "Emollient", funktion: "Verbessert Hautgefühl, macht die Haut geschmeidig" },
      { inci: "Propylene Glycol Dicaprylate/Dicaprate", name: "Leichtes Hautöl", funktion: "Was die Haut pflegt, ohne Poren zu verstopfen" },
      { inci: "Polyglyceryl-10 Oleate", name: "Natürlicher Emulgator", funktion: "Verbindet Wasser und Öl" },
      { inci: "Phenylbenzimidazole Sulfonic Acid", name: "UVB-Filter", funktion: "Schützt vor Sonnenbrand, Hautalterung und Hautkrebs" },
      { inci: "Disodium Phenyl Dibenzimidazole Tetrasulfonate", name: "UV-Filter", funktion: "Ergänzt UV-Schutzspektrum" },
      { inci: "Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine", name: "Breitband-UV-Filter (Tinosorb S)", funktion: "Schutz vor UVA- und UVB-Strahlung, sehr photostabil" },
      { inci: "Glycerin", name: "Glycerin", funktion: "Spendet Feuchtigkeit" },
      { inci: "Diethylamino Hydroxybenzoyl Hexyl Benzoate", name: "UVA-Filter", funktion: "Schützt vor Hautalterung durch UVA-Strahlen" },
      { inci: "Hectorite", name: "Tonmineral", funktion: "Natürliches Verdickungsmittel, stabilisiert die Textur" },
      { inci: "Pentylene Glycol", name: "Feuchthaltemittel", funktion: "Spendet Feuchtigkeit, leicht antimikrobiell" },
      { inci: "Ethylhexyl Triazone", name: "UVB-Filter", funktion: "Sehr effizienter Schutz vor UVB-Strahlen" },
      { inci: "Terephthalylidene Dicamphor Sulfonic Acid", name: "UVA/UVB-Filter", funktion: "Breitband-Schutz" },
      { inci: "Tromethamine", name: "pH-Regulator", funktion: "Stabilisiert den pH-Wert" },
      { inci: "Propanediol", name: "Feuchthaltemittel", funktion: "Spendet Feuchtigkeit, verbessert Aufnahme" },
      { inci: "1,2-Hexanediol", name: "Feuchthaltemittel", funktion: "Konservierend, feuchtigkeitsspendend" },
      { inci: "Tocopherol", name: "Vitamin E", funktion: "Antioxidativ, schützt vor freien Radikalen" },
      { inci: "Lycopene", name: "Lycopin", funktion: "Starkes Antioxidans" },
      { inci: "Helianthus Annuus Seed Oil", name: "Sonnenblumenöl", funktion: "Pflegend, antioxidativ" },
      { inci: "Buddleja Officinalis Flower Extract", name: "Schmetterlingsflieder-Extrakt", funktion: "Antioxidativ, schützt vor Umweltstress" },
      { inci: "Ceramide NP", name: "Ceramid", funktion: "Stärkt Hautbarriere" },
      { inci: "2,3-Butanediol", name: "Feuchthaltemittel", funktion: "Unterstützt Feuchtigkeitsversorgung" },
      { inci: "Sodium Hyaluronate", name: "Hyaluronsäure", funktion: "Bindet Wasser, polstert die Haut auf" },
      { inci: "Tremella Fuciformis Extract", name: "Schneepilz-Extrakt", funktion: "Spendet intensiv Feuchtigkeit, glättend" },
      { inci: "Ascorbyl Isostearate", name: "Vitamin-C-Derivat", funktion: "Antioxidativ, unterstützt Hautausgleichend" },
      { inci: "Isostearic Acid", name: "Fettsäure", funktion: "Stabilisiert Formulierung, pflegend" },
      { inci: "Malva Sylvestris Flower Extract", name: "Malvenextrakt", funktion: "Beruhigend, feuchtigkeitsspendend" },
      { inci: "Hydrogenated Lecithin", name: "Lecithin", funktion: "Unterstützt Hautbarriere, verbessert Aufnahme" },
      { inci: "Leuconostoc/Radish Root Ferment Filtrate", name: "Ferment-Extrakt", funktion: "Natürlicher Konservierer, pflegend" },
      { inci: "Glyceryl Stearate", name: "Emulgator", funktion: "Stabilisiert Emulsion" },
      { inci: "Ceramide AP", name: "Ceramid", funktion: "Stärkt Hautbarriere" },
      { inci: "Ceramide AS", name: "Ceramid", funktion: "Unterstützt Hautschutz" },
      { inci: "Ceramide NG", name: "Ceramid", funktion: "Regenerierend" },
      { inci: "Cholesterol", name: "Cholesterin", funktion: "Bestandteil der Hautbarriere" },
      { inci: "Ascorbic Acid", name: "Vitamin C", funktion: "Antioxidativ, fördert Kollagenbildung" },
      { inci: "Ceramide EOP", name: "Ceramid", funktion: "Unterstützt Hautstruktur und Feuchtigkeit" },
    ],
  },
};

export default function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();

  const detailCartItem = product
    ? {
        id: product.id,
        name: product.name,
        quantity: 1,
        description: product.selectedIngredients?.length
          ? `Wirkstoffe: ${product.selectedIngredients.map((ingredient) => ingredient.name).join(", ")}`
          : undefined,
      }
    : null;

  const handleAddToCart = async () => {
    if (!detailCartItem) return;
    setIsAdding(true);
    try {
      await addItem(detailCartItem);
    } finally {
      setIsAdding(false);
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (!product) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [product]);

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: "modalIn 200ms cubic-bezier(0.23, 1, 0.32, 1) forwards",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-150 hover:scale-105 active:scale-95"
          aria-label="Schließen"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        {/* Header with image */}
        <div className="flex flex-col gap-6 p-6 pb-0">
          {product.image && (
            <div className="w-full flex-shrink-0">
              <div className="aspect-square rounded-lg overflow-hidden bg-transparent flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          <div className="flex-1">
            {product.subtitle && (
              <p className="text-xs uppercase tracking-widest text-[#7D7D5D] mb-1">
                {product.subtitle}
              </p>
            )}
            <h2 className="font-serif text-2xl md:text-3xl text-[#2c2c2c] mb-3">
              {product.name}
            </h2>
            <p className="text-[#5a5a5a] italic leading-relaxed">
              &ldquo;{product.description}&rdquo;
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-5">
          {/* Anwendung */}
          {product.anwendung && (
            <div className="flex gap-3">
              <Droplets className="w-5 h-5 text-[#5B5B38] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm text-[#2c2c2c] mb-1">Anwendung</h4>
                <p className="text-sm text-[#5a5a5a] leading-relaxed">{product.anwendung}</p>
              </div>
            </div>
          )}

          {/* Hautprobleme & Hauttypen */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.hautprobleme && (
              <div className="flex gap-3">
                <Heart className="w-5 h-5 text-[#5B5B38] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-[#2c2c2c] mb-1">Hautprobleme</h4>
                  <p className="text-sm text-[#5a5a5a]">{product.hautprobleme}</p>
                </div>
              </div>
            )}
            {product.hauttypen && (
              <div className="flex gap-3">
                <Leaf className="w-5 h-5 text-[#5B5B38] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-[#2c2c2c] mb-1">Hauttypen</h4>
                  <p className="text-sm text-[#5a5a5a]">{product.hauttypen}</p>
                </div>
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 py-2">
            {["Vegan", "Tierversuchsfrei", "Made in Germany", "Regional"].map((badge) => (
              <span
                key={badge}
                className="text-xs px-3 py-1.5 rounded-full bg-[#5B5B38]/10 text-[#5B5B38] font-medium border border-[#5B5B38]/20"
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Wirkung */}
          {product.wirkung && (
            <div className="border-t border-[#5B5B38]/20 pt-5">
              <div className="flex items-center gap-2 mb-3">
                <Beaker className="w-5 h-5 text-[#5B5B38]" />
                <h3 className="font-serif text-lg text-[#5B5B38]">Wirkung</h3>
              </div>
              <p className="text-sm text-[#5a5a5a] leading-relaxed">{product.wirkung}</p>
            </div>
          )}

          {/* Selected Ingredients (für individuelle Produkte) */}
          {product.selectedIngredients && product.selectedIngredients.length > 0 && (
            <div className="border-t border-[#5B5B38]/20 pt-5">
              <h3 className="font-serif text-lg text-[#5B5B38] mb-3">Ausgewählte Wirkstoffe</h3>
              <div className="space-y-2">
                {product.selectedIngredients.map((ingredient) => (
                  <div key={ingredient.id} className="text-sm text-[#5a5a5a] flex items-start gap-2">
                    <span className="text-[#5B5B38] mt-1">•</span>
                    <span>{ingredient.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Base Product Ingredients (für individuelle Produkte) - mit vollständiger Inhaltsstoffliste */}
          {product.baseProduct && product.baseProduct.length > 0 && (
            <div className="border-t border-[#5B5B38]/20 pt-5">
              <h3 className="font-serif text-lg text-[#5B5B38] mb-3">Basiscreme / Basisserum - Vollständige Inhaltsstoffe</h3>
              <div className="overflow-hidden rounded-lg border border-[#5B5B38]/20 overflow-x-auto">
                <table className="w-full text-xs md:text-sm">
                  <thead>
                    <tr className="bg-[#5B5B38]/10">
                      <th className="text-left px-2 md:px-3 py-2 font-semibold text-xs md:text-sm font-body text-[#5B5B38]">INCI</th>
                      <th className="text-left px-2 md:px-3 py-2 font-semibold text-xs md:text-sm font-body text-[#5B5B38]">Name</th>
                      <th className="text-left px-2 md:px-3 py-2 font-semibold text-xs md:text-sm font-body text-[#5B5B38]">Funktion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.baseProduct.map((item, idx) => (
                      <tr key={idx} className="border-t border-[#5B5B38]/10">
                        <td className="px-2 md:px-3 py-2 text-[#5a5a5a] text-xs md:text-sm font-body">{item.inci}</td>
                        <td className="px-2 md:px-3 py-2 text-[#5a5a5a] text-xs md:text-sm font-body">{item.name}</td>
                        <td className="px-2 md:px-3 py-2 text-[#5a5a5a] text-xs md:text-sm font-body">{item.funktion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Active Ingredients Ingredient Tables (für individuelle Produkte) - mit vollständiger Inhaltsstoffliste */}
          {product.selectedIngredients && product.selectedIngredients.length > 0 && (
            <div className="border-t border-[#5B5B38]/20 pt-5">
              <h3 className="font-serif text-lg text-[#5B5B38] mb-3">Wirkstoffe - Vollständige Inhaltsstoffe</h3>
              <div className="space-y-6">
                {product.selectedIngredients.map((ingredient) => {
                  const details = SERUM_INGREDIENT_DETAILS[ingredient.id as keyof typeof SERUM_INGREDIENT_DETAILS];
                  if (!details || !details.inhaltsstoffe) return null;
                  return (
                    <div key={ingredient.id} className="space-y-2">
                      <h4 className="font-semibold text-sm text-[#5B5B38]">{ingredient.name}</h4>
                      <div className="overflow-hidden rounded-lg border border-[#5B5B38]/20 overflow-x-auto">
                        <table className="w-full text-xs md:text-sm">
                          <thead>
                            <tr className="bg-[#5B5B38]/10">
                              <th className="text-left px-2 md:px-3 py-2 font-semibold text-xs md:text-sm font-body text-[#5B5B38]">INCI</th>
                              <th className="text-left px-2 md:px-3 py-2 font-semibold text-xs md:text-sm font-body text-[#5B5B38]">Name</th>
                              <th className="text-left px-2 md:px-3 py-2 font-semibold text-xs md:text-sm font-body text-[#5B5B38]">Funktion</th>
                            </tr>
                          </thead>
                          <tbody>
                            {details.inhaltsstoffe.map((item, idx) => (
                              <tr key={idx} className="border-t border-[#5B5B38]/10">
                                <td className="px-2 md:px-3 py-2 text-[#5a5a5a] text-xs md:text-sm font-body">{item.inci}</td>
                                <td className="px-2 md:px-3 py-2 text-[#5a5a5a] text-xs md:text-sm font-body">{item.name}</td>
                                <td className="px-2 md:px-3 py-2 text-[#5a5a5a] text-xs md:text-sm font-body">{item.funktion}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Inhaltsstoffe */}
          {product.inhaltsstoffe && product.inhaltsstoffe.length > 0 && (
            <div className="border-t border-[#5B5B38]/20 pt-5">
              <h3 className="font-serif text-lg text-[#5B5B38] mb-3">Inhaltsstoffe</h3>
              <div className="overflow-hidden rounded-lg border border-[#5B5B38]/20 overflow-x-auto">
                <table className="w-full text-xs md:text-sm">
                  <thead>
                    <tr className="bg-[#5B5B38]/10">
                      <th className="text-left px-2 md:px-3 py-2 font-semibold text-xs md:text-sm font-body text-[#5B5B38]">INCI</th>
                      <th className="text-left px-2 md:px-3 py-2 font-semibold text-xs md:text-sm font-body text-[#5B5B38]">Name</th>
                      <th className="text-left px-2 md:px-3 py-2 font-semibold text-xs md:text-sm font-body text-[#5B5B38]">Funktion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.inhaltsstoffe.map((item, idx) => (
                      <tr key={idx} className="border-t border-[#5B5B38]/10">
                        <td className="px-2 md:px-3 py-2 text-[#5a5a5a] text-xs md:text-sm font-body">{item.inci}</td>
                        <td className="px-2 md:px-3 py-2 text-[#5a5a5a] text-xs md:text-sm font-body">{item.name}</td>
                        <td className="px-2 md:px-3 py-2 text-[#5a5a5a] text-xs md:text-sm font-body">{item.funktion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <div className="border-t border-[#5B5B38]/20 pt-5 mt-6">
            {detailCartItem && (
              <ShopifyPurchaseButton
                item={detailCartItem}
                onPurchase={handleAddToCart}
                disabled={isAdding}
                disabledReason={isAdding ? "Der Artikel wird dem Shopify-Warenkorb hinzugefügt …" : undefined}
                className="bg-[#5B5B38] text-[#F8F5F0] font-body text-xs lg:text-sm tracking-[0.12em] uppercase px-6 lg:px-8 py-3 lg:py-4 rounded-sm hover:bg-[#424226] transition-all duration-300 flex items-center gap-2 group shadow-sm hover:shadow-md disabled:opacity-75"
              >
                <ShoppingCart size={16} />
                {isAdding ? "Wird hinzugefügt..." : "In den Warenkorb"}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </ShopifyPurchaseButton>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

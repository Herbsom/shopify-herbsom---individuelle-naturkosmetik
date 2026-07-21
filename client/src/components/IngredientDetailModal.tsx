/**
 * IngredientDetailModal – Pop-up mit Produktdetails für Wirkstoffe und Basisprodukte
 * Öffnet sich als Overlay mit X zum Schließen
 */
import { useEffect } from "react";
import { X, Leaf, Beaker, Heart, Droplets } from "lucide-react";

export interface IngredientDetail {
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
}

interface IngredientDetailModalProps {
  ingredient: IngredientDetail | null;
  onClose: () => void;
  productType?: "serum" | "creme";
}

// Detailed data for all serum ingredients
export const SERUM_INGREDIENT_DETAILS: Record<string, Omit<IngredientDetail, "id" | "name" | "description">> = {
  baseSerum: {
    subtitle: "Basisserum für individuelle Formulierung",
    anwendung: "Das Basisserum ist die Grundlage für Ihre individuelle Hautpflege. Geben Sie Ihre gewählten Wirkstoffe hinzu und schütteln Sie gut.",
    hautprobleme: "Alle Hautprobleme",
    hauttypen: "Alle Hauttypen",
    wirkung: "Das Basisserum enthält eine sorgfältig ausgewählte Mischung aus natürlichen Feuchtigkeitsspendern, beruhigenden Wirkstoffen und antioxidativen Komponenten. Es bildet die perfekte Grundlage für die Aufnahme Ihrer individuellen Wirkstoffe und sorgt für eine optimale Hautverträglichkeit.",
    inhaltsstoffe: [
      { inci: "Aqua", name: "Gereinigtes Wasser", funktion: "Wasser als Basis" },
      { inci: "Propanediol", name: "Propanediol", funktion: "Natürlicher Rohstoff, der aus Glukose gewonnen wird. Feuchtigkeitsspender, natürlicher Konservierer, bringt die Haut zum Strahlen" },
      { inci: "Pentylene Glycol", name: "Pentylene Glycol", funktion: "Natürlicher Feuchtigkeitsspender und Konservierer" },
      { inci: "Caesalpinia Spinosa (Tara) Gum", name: "Tarakernmehl", funktion: "Natürliches, pflanzliches Verdickungsmittel, beruhigt gereizte Haut" },
      { inci: "Allantoin", name: "Allantoin", funktion: "Unterstützt den Heilungsprozess der Haut, beruhigt, glättet und regt die Zellteilung und -neubildung an" },
      { inci: "4-t-Butylcyclohexanol", name: "4-t-Butylcyclohexanol", funktion: "Hautberuhigender Wirkstoff für empfindliche Haut" },
      { inci: "Epigallocatechin Gallate", name: "Epigallocatechin Gallate", funktion: "Wirkt antioxidativ, entzündungshemmend und spendet Feuchtigkeit" },
      { inci: "Arginine", name: "Arginine", funktion: "Wirkt hautberuhigend, pH-Wert ausgleichend, feuchtigkeitsspendend und antioxidativ" },
      { inci: "Phospholipids & Sphingolipids", name: "Phospholipide & Sphingolipide", funktion: "Sind Teil der menschlichen Zellmembran und regen die Ceramide-Produktion an. Damit erhalten Sie eine intakte Hautbarriere und sorgen für geringeren Wasserverlust der Haut, was die Haut glatter, gesünder und jünger aussehen lässt" },
      { inci: "Sodium Citrate", name: "Natriumcitrat (Natriumsalz der Zitronensäure)", funktion: "Stellt den pH-Wert des Produkts optimal auf den pH-Wert der Haut ein. Es wirkt antioxidativ und ist mild zur Haut" },
      { inci: "Sodium Anisate", name: "Salz der Anissäure", funktion: "Der Stoff ist pflanzlichen Ursprungs und wirkt antibakteriell" },
      { inci: "Tocopherol", name: "Vitamin E", funktion: "Wirkt stark antioxidativ, beruhigend und glättend. Damit ist es ein besonders effektiver Slow-Aging Wirkstoff" },
    ],
  },
  willow: {
    subtitle: "Reiner Bio Weidenrindenextrakt",
    image: "/manus-storage/pasted_file_tEV7V6_Component109_0d22f905.webp",
    anwendung: "In das Basisserum geben und schütteln. Das fertige Serum morgens und abends auf das Gesicht auftragen.",
    hautprobleme: "Glanz, Mitesser, Pickel, Entzündungen",
    hauttypen: "Fettige Haut, Mischhaut",
    wirkung: "Weidenrindenextrakt ist reich an Salicin, Salicylat, Salizylsäure, Kaffeesäure und Polyphenolen. Das Salicin löst sanft überschüssigen Talg und verhornte Stellen ab und hilft der Haut, den Talg zu regulieren. Darum eignet sich der Extrakt ideal für die Pflege von fettiger und öliger Haut. Der Extrakt regt den Stoffwechsel der Haut an und zieht die Poren etwas zusammen. Er beruhigt Unreinheiten, Mitesser und Pickel und kann dabei helfen, dass aus Mitessern und verstopften Poren keine Pickel werden.",
    inhaltsstoffe: [
      { inci: "Glycerin", name: "Pflanzliches Glycerin", funktion: "Intensiver, pflanzlicher Feuchtigkeitsspender und Lösungsmittel für die Extraktion" },
      { inci: "Aqua", name: "Wasser", funktion: "Wasser als Lösemittel für die Extraktion" },
      { inci: "Salix Alba Bark Extract", name: "Weidenrindenextrakt", funktion: "Reguliert den Talgfluss und peelt die Haut sanft, anti-oxidativ, entzündungshemmend, adstringierend, erweichend, regenerierend" },
    ],
  },
  niacinamide: {
    subtitle: "Reiner Niacinamide-Komplex",
    image: "/manus-storage/pasted_file_Ta9hrm_Component110_b3c36e98.webp",
    anwendung: "In das Basisserum geben und schütteln. Das fertige Serum morgens und abends auf das Gesicht auftragen.",
    hautprobleme: "Vergrößerte Poren, Unreinheiten, ungleichmäßiger Hautton",
    hauttypen: "Alle Hauttypen, besonders Mischhaut",
    wirkung: "Niacinamid (Vitamin B3) stärkt die Hautbarriere und reguliert die Talgproduktion. Es verfeinert vergrößerte Poren, gleicht den Hautton aus und verbessert die Hautelastizität. Der Komplex wirkt entzündungshemmend und hilft, Rötungen und Unreinheiten zu reduzieren.",
    inhaltsstoffe: [
      { inci: "Aqua", name: "Wasser", funktion: "Wasser als Basis" },
      { inci: "Niacinamide", name: "Niacinamide", funktion: "Mattiert die Haut, zieht Poren zusammen, reduziert Unreinheiten, beruhigt die Haut, Anti-Aging Wirkstoff" },
      { inci: "Pentylene Glycol", name: "Pentylene Glycol", funktion: "Feuchtigkeitsspendend" },
    ],
  },
  vitaminc: {
    subtitle: "Reiner Vitamin C-Komplex",
    image: "/manus-storage/pasted_file_doaleU_Component111_8af3e786.webp",
    anwendung: "In das Basisserum geben und schütteln. Das fertige Serum morgens und abends auf das Gesicht auftragen.",
    hautprobleme: "Pigmentflecken, Hautalterung, fahle Haut",
    hauttypen: "Alle Hauttypen",
    wirkung: "Vitamin C ist ein starkes Antioxidans, das die Haut vor freien Radikalen schützt und die Kollagenproduktion anregt. Es hellt Pigmentflecken auf, gleicht den Hautton aus und verleiht der Haut einen natürlichen Glow. Zudem schützt es vor UV-bedingter Hautalterung.",
    inhaltsstoffe: [
      { inci: "Aqua", name: "Wasser", funktion: "Wasser als Basis" },
      { inci: "3-Glyceryl Ascorbate", name: "Vitamin C Derivat", funktion: "Es wirkt stark antioxidativ, gleicht Pigmentstörungen und Sonnenschäden aus und hilft bei Pickelmalen." },
      { inci: "Glycerin", name: "Glycerin", funktion: "Intensiver, pflanzlicher Feuchtigkeitsspender" },
      { inci: "Ascorbyl Glucoside", name: "ein Vitamin C Derivat", funktion: "Antioxidativ, regt die Kollagenbildung an, bekämpft freie Radikale" },
      { inci: "Pentylene Glycol", name: "Pentylene Glycol", funktion: "Feuchtigkeitsspendend" },
      { inci: "Panthenol", name: "Panthenol oder Pro-Vitamin B5", funktion: "Fördert die Produktion von neuen Hautzellen, wundheilend, regt die Kollagenbildung an" },
      { inci: "Citric Acid", name: "Zitronensäure", funktion: "Stellt den pH-Wert ein" },
    ],
  },
  retinol: {
    subtitle: "Reiner Retinolkomplex",
    image: "/manus-storage/pasted_file_newInc_Component112_f44bbc3a.webp",
    anwendung: "In das Basisserum geben und schütteln. Das fertige Serum mit Retinol nur abends auf das Gesicht auftragen, da die Haut lichtempfindlicher wird. Tagsüber unbedingt Sonnenschutz verwenden.",
    hautprobleme: "Falten, feine Linien, Hautalterung, Pigmentflecken",
    hauttypen: "Reife Haut, Normale Haut",
    wirkung: "Retinol (Vitamin A) beschleunigt die Zellerneuerung und stimuliert die Kollagenproduktion. Es glättet feine Linien und Falten, verfeinert das Hautbild und reduziert Pigmentflecken. Bei regelmäßiger Anwendung wird die Haut sichtbar straffer und ebenmäßiger.",
    inhaltsstoffe: [
      { inci: "Caprylic/Capric Triglyceride", name: "Pflanzliches Neutralöl (kein Palmöl!)", funktion: "Reizfreie ölige Basis, erleichtert das Auftragen und sorgt dafür, dass der Komplex schnell einzieht" },
      { inci: "Glycine Soja (Soybean) Oil", name: "Sojaöl", funktion: "Pflegt die Haut glatt und geschmeidig" },
      { inci: "Squalane", name: "Squalan", funktion: "Hauptbestandteil des hauteigenen Lipidfilms, Glättend, pflegend, erleichtert das Auftragen und sorgt dafür, dass die Pflege schnell einzieht" },
      { inci: "Retinol", name: "Retinol (Vitamin A)", funktion: "Reduziert Falten, macht die Haut glatter und ebenmäßiger, reduziert Pigmentflecken, porenverfeinernd" },
      { inci: "Helianthus Annuus (Sunflower) Seed Oil", name: "Sonnenblumenöl", funktion: "Macht die Haut weich und versorgt sie mit Feuchtigkeit" },
      { inci: "Retinyl Acetate", name: "Retinolester", funktion: "Reduziert Falten, macht die Haut glatter und ebenmäßiger, reduziert Pigmentflecken, porenverfeinernd" },
      { inci: "Tocopherol", name: "Vitamin E", funktion: "Beruhigend, schützt die Haut vor Umwelteinflüssen, fördert die Hauterneuerung" },
      { inci: "Beta-Carotene", name: "Beta-Carotin/Provitamin A", funktion: "Schützt vor vorzeitiger Hautalterung und Erschlaffung der Haut und regt die Mikrozirkulation der Haut an" },
      { inci: "Daucus Carota Sativa (Carrot) Root Extract", name: "Karottenöl", funktion: "Macht die Haut weich und geschmeidig und spendet Feuchtigkeit, schützt die Zellen und regt ihre Erneuerung an, gegen frühzeitige Hautalterung" },
    ],
  },
  spilanthol: {
    subtitle: "Reiner Spilantholkomplex",
    image: "/manus-storage/pasted_file_kLZtbX_Component113_4cce2ac9.webp",
    anwendung: "In das Basisserum geben und schütteln. Das fertige Serum morgens und abends auf das Gesicht auftragen.",
    hautprobleme: "Mimikfalten, Spannungsgefühl, feine Linien",
    hauttypen: "Alle Hauttypen",
    wirkung: "Spilanthol wird aus der Parakresse gewonnen und wirkt als natürlicher Muskelrelaxant. Es entspannt die Gesichtsmuskulatur sanft und reduziert so Mimikfalten. Die Haut wird sofort sichtbar glatter und fühlt sich entspannt an – ein natürlicher Botox-Effekt.",
    inhaltsstoffe: [
      { inci: "Propanediol", name: "Pflanzliches Glykol", funktion: "Feuchtigkeitsspendendes Lösungsmittel, verbessert die Hautaufnahme anderer Wirkstoffe, sanft zur Haut" },
      { inci: "Aqua (Water)", name: "Wasser", funktion: "Wasser als Lösemittel für die Extraktion" },
      { inci: "Acmella Oleracea Extract", name: "Parakresse-Extrakt", funktion: "Enthält natürliches Spilanthol - pflanzliches Botox, entspannt die Gesichtsmuskulatur, reduziert Mimikfalten sichtbar" },
    ],
  },
  mallow: {
    subtitle: "Reiner Bio Malvenextrakt",
    image: "/manus-storage/pasted_file_PMIVkd_Component114_62c2385a.webp",
    anwendung: "In das Basisserum geben und schütteln. Das fertige Serum morgens und abends auf das Gesicht auftragen.",
    hautprobleme: "Rötungen, Irritationen, empfindliche Haut, Trockenheit",
    hauttypen: "Empfindliche Haut, Trockene Haut",
    wirkung: "Malvenextrakt enthält Schleimstoffe, die einen schützenden Film auf der Haut bilden und sie vor äußeren Einflüssen bewahren. Er wirkt beruhigend, entzündungshemmend und feuchtigkeitsspendend. Rötungen und Irritationen werden sichtbar gemildert.",
    inhaltsstoffe: [
      { inci: "Glycerin", name: "Pflanzliches Glycerin", funktion: "Intensiver, pflanzlicher Feuchtigkeitsspender und Lösungsmittel für die Extraktion" },
      { inci: "Aqua", name: "Wasser", funktion: "Wasser als Lösemittel für die Extraktion" },
      { inci: "Malva Sylvestris Flower Extract", name: "Malvenextrakt", funktion: "After-Sun und Anti-aging Wirkstoff, wirkt beruhigend, glättend, feuchtigkeitsbewahrend, reizlindernd und entzündungshemmend. Lindert Rötungen und schützt vor Umwelteinflüssen" },
    ],
  },
  horsechestnut: {
    subtitle: "Reiner Bio Rosskastanienextrakt",
    anwendung: "In das Basisserum geben und schütteln. Das fertige Serum morgens und abends auf das Gesicht auftragen.",
    hautprobleme: "Couperose, Rosazea, rote Äderchen, empfindliche Haut",
    hauttypen: "Empfindliche Haut, Haut mit Couperose",
    wirkung: "Rosskastanienextrakt enthält Aescin, das die Gefäßwände stärkt und die Durchblutung reguliert. Er mindert sichtbar rote Äderchen und Couperose. Zudem wirkt er abschwellend und entzündungshemmend, was ihn ideal für empfindliche, zu Rötungen neigende Haut macht.",
    inhaltsstoffe: [
      { inci: "Glycerin", name: "Pflanzliches Glycerin", funktion: "Intensiver, pflanzlicher Feuchtigkeitsspender und Lösungsmittel für die Extraktion" },
      { inci: "Aqua", name: "Wasser", funktion: "Wasser als Lösemittel für die Extraktion" },
      { inci: "Aesculus Hippocastanum Seed Extract", name: "Rosskastanienextrakt", funktion: "Stärkt die Kapillarwände, wirkt glättend, beruhigend, abschwellend, wundheilend, erfrischend, adstringierend, entzündungshemmend und aufhellend" },
    ],
  },
  algae: {
    subtitle: "Reiner Bio Algenextrakt",
    anwendung: "In das Basisserum geben und schütteln. Das fertige Serum morgens und abends auf das Gesicht auftragen.",
    hautprobleme: "Trockenheit, Spannungsgefühl, Feuchtigkeitsmangel",
    hauttypen: "Trockene Haut, Normale Haut",
    wirkung: "Algenextrakt ist reich an Mineralien, Vitaminen und Aminosäuren. Er spendet intensiv Feuchtigkeit und bindet diese langanhaltend in der Haut. Zudem stärkt er die Hautbarriere und schützt vor Feuchtigkeitsverlust. Die Haut fühlt sich prall und geschmeidig an.",
    inhaltsstoffe: [
      { inci: "Glycerin", name: "Pflanzliches Glycerin", funktion: "Intensiver, pflanzlicher Feuchtigkeitsspender und Lösungsmittel für die Extraktion" },
      { inci: "Aqua", name: "Wasser", funktion: "Wasser als Lösungsmittel für die Extraktion" },
      { inci: "Fucus Vesiculosus Extract", name: "Blasentangextrakt", funktion: "Anti-aging Wirkstoff, stark feuchtigkeitsspendend, regenerierend, straffend, schützt vor Umwelteinflüssen und beruhigt die Haut" },
    ],
  },
  hyaluronic: {
    subtitle: "Reiner Hyaluronkomplex",
    anwendung: "In das Basisserum geben und schütteln. Das fertige Serum morgens und abends auf das Gesicht auftragen.",
    hautprobleme: "Trockenheitsfältchen, Feuchtigkeitsmangel, fahle Haut",
    hauttypen: "Alle Hauttypen",
    wirkung: "Hyaluronsäure kann das 1000-fache ihres Eigengewichts an Wasser binden. Unser Komplex enthält nieder- und hochmolekulare Hyaluronsäure, die sowohl an der Oberfläche als auch in tieferen Hautschichten wirkt. Die Haut wird sofort aufgepolstert, Trockenheitsfältchen werden geglättet.",
    inhaltsstoffe: [
      { inci: "Aqua", name: "Wasser", funktion: "Wasser als Basis" },
      { inci: "Pentylene Glycol", name: "Pentylene Glycol", funktion: "Natürlicher Konservierer und Feuchtigkeitsspender" },
      { inci: "Sodium Hyaluronate", name: "Hyaluronsäure", funktion: "Bindet Feuchtigkeit und bewahrt diese" },
      { inci: "N-Acetyl Glucosamine", name: "Glucosamin ohne Natrium und Sulfate", funktion: "Gut verträglicher körpereigener Baustein, Baustein von Hyaluronsäure" },
      { inci: "Hyaluronic Acid", name: "Hyaluronsäure", funktion: "Bindet Feuchtigkeit und bewahrt diese" },
      { inci: "Hydrolyzed Sodium Hyaluronate", name: "Hydrolisierte Hyaluronsäure", funktion: "Dringt in die untersten Hautschichten ein, spendet dort Feuchtigkeit und ist besonders langanhaltend" },
      { inci: "Tremella Fuciformis Sporocarp Extract", name: "Silberohr (ein Vitalpilz)", funktion: "Ein Heil- und Vitalpilz mit starker Anti-Aging Wirkung" },
      { inci: "Sodium Acetylated Hyaluronate", name: "Acetylierte Hyaluronsäure", funktion: "Dringt tiefer in die Haut ein als klassische Hyaluronsäure, geringerer Verdunstungseffekt, verbessert Hautelastizität und repariert die Hautbarriere" },
    ],
  },
  // Creme-specific ingredients
  rosehip: {
    subtitle: "Reines Bio Wildrosenöl",
    image: "/manus-storage/pasted_file_mAGk9C_Component103_4f97ff70.webp",
    anwendung: "In die Basiscreme einrühren. Die fertige Creme morgens und abends auf das Gesicht auftragen.",
    hautprobleme: "Trockenheit, Narben, ungleichmäßiger Hautton",
    hauttypen: "Trockene Haut, Reife Haut",
    wirkung: "Wildrosenöl ist reich an essentiellen Fettsäuren und Vitamin A. Es versorgt trockene Haut intensiv, fördert die Zellerneuerung und verbessert die Hautelastizität. Narben und Pigmentflecken werden sichtbar gemildert.",
    inhaltsstoffe: [
      { inci: "Rosa Canina Fruit Oil", name: "Wildrosenöl", funktion: "Nährend, regenerierend, zellerneuend, reich an Vitamin A und essentiellen Fettsäuren" },
      { inci: "Tocopherol", name: "Vitamin E", funktion: "Antioxidativer Schutz" },
      { inci: "Linoleic Acid", name: "Linolsäure", funktion: "Stärkt Hautbarriere, feuchtigkeitsspendend" },
      { inci: "Vitamin A", name: "Vitamin A", funktion: "Fördert Zellerneuerung, Anti-Aging" },
    ],
  },
  seabuckthorn: {
    subtitle: "Reines Bio Sanddornöl",
    image: "/manus-storage/pasted_file_B34Ixl_Component106_615ffead.webp",
    anwendung: "In die Basiscreme einrühren. Die fertige Creme morgens und abends auf das Gesicht auftragen.",
    hautprobleme: "Trockenheit, Falten, strapazierte Haut",
    hauttypen: "Trockene Haut, Reife Haut",
    wirkung: "Sanddornöl ist eines der vitaminreichsten Öle der Natur. Es enthält Vitamin A, C, E und seltene Palmitoleinsäure. Es versorgt trockene Haut intensiv, glättet Falten und unterstützt die Regeneration strapazierter Haut.",
    inhaltsstoffe: [
      { inci: "Hippophae Rhamnoides Fruit Oil", name: "Sanddornfruchtöl", funktion: "Vitaminreich, regenerierend, schützend, reich an Vitamin A, C, E" },
      { inci: "Tocopherol", name: "Vitamin E", funktion: "Antioxidativer Schutz" },
      { inci: "Palmitoleic Acid", name: "Palmitoleinsäure", funktion: "Seltene Fettsäure, nährend, regenerierend" },
      { inci: "Vitamin C", name: "Vitamin C", funktion: "Antioxidativ, aufhellend" },
    ],
  },
  grapeseed: {
    subtitle: "Reines Bio Traubenkernöl",
    image: "/manus-storage/pasted_file_4QmjxL_Component104_ca797fd6.webp",
    anwendung: "In die Basiscreme einrühren. Die fertige Creme morgens und abends auf das Gesicht auftragen.",
    hautprobleme: "Trockenheit, vorzeitige Hautalterung, freie Radikale",
    hauttypen: "Alle Hauttypen, besonders trockene Haut",
    wirkung: "Traubenkernöl ist reich an Antioxidantien und Linolsäure. Es schützt die Hautzellen vor freien Radikalen, spendet Feuchtigkeit ohne zu fetten und stärkt die Hautbarriere. Die Haut wird geschmeidig und vor vorzeitiger Alterung geschützt.",
    inhaltsstoffe: [
      { inci: "Vitis Vinifera Seed Oil", name: "Traubenkernöl", funktion: "Antioxidativ, feuchtigkeitsspendend, schützend, leicht, nicht komedogen" },
      { inci: "Tocopherol", name: "Vitamin E", funktion: "Antioxidativer Schutz" },
      { inci: "Linoleic Acid", name: "Linolsäure", funktion: "Stärkt Hautbarriere, feuchtigkeitsspendend" },
      { inci: "Proanthocyanidins", name: "Proanthocyanidine", funktion: "Starke Antioxidantien, schützen vor freien Radikalen" },
    ],
  },
  thistle: {
    subtitle: "Reines Bio Distelöl",
    image: "/manus-storage/pasted_file_v8y1VS_Component105_00a2c359.webp",
    anwendung: "In die Basiscreme einrühren. Die fertige Creme morgens und abends auf das Gesicht auftragen.",
    hautprobleme: "Trockene Stellen, verstopfte Poren, Mischhaut",
    hauttypen: "Mischhaut, Trockene Haut",
    wirkung: "Distelöl hat einen hohen Anteil an Linolsäure und zieht schnell ein, ohne die Poren zu verstopfen. Es versorgt trockene Stellen intensiv und ist dabei so leicht, dass es auch für Mischhaut und zu Unreinheiten neigende Haut geeignet ist.",
    inhaltsstoffe: [
      { inci: "Carthamus Tinctorius Seed Oil", name: "Distelöl", funktion: "Leicht, nicht komedogen, feuchtigkeitsspendend, hoher Linolsäureanteil" },
      { inci: "Tocopherol", name: "Vitamin E", funktion: "Antioxidativer Schutz" },
      { inci: "Linoleic Acid", name: "Linolsäure", funktion: "Stärkt Hautbarriere, zieht schnell ein" },
      { inci: "Oleic Acid", name: "Ölsäure", funktion: "Nährend, hautpflegend" },
    ],
  },
  // Base products
  baseserum: {
    subtitle: "Basisserum für individuelle Formulierung",
    anwendung: "Das Basisserum ist die Grundlage für Ihre individuelle Hautpflege. Geben Sie Ihre gewählten Wirkstoffe hinzu und schütteln Sie gut.",
    hautprobleme: "Alle Hautprobleme",
    hauttypen: "Alle Hauttypen",
    wirkung: "Das Basisserum enthält eine sorgfältig ausgewählte Mischung aus natürlichen Feuchtigkeitsspendern, beruhigenden Wirkstoffen und antioxidativen Komponenten. Es bildet die perfekte Grundlage für die Aufnahme Ihrer individuellen Wirkstoffe und sorgt für eine optimale Hautverträglichkeit.",
    inhaltsstoffe: [
      { inci: "Aqua", name: "Gereinigtes Wasser", funktion: "Wasser als Basis" },
      { inci: "Propanediol", name: "Propanediol", funktion: "Natürlicher Rohstoff, der aus Glukose gewonnen wird. Feuchtigkeitsspender, natürlicher Konservierer, bringt die Haut zum Strahlen" },
      { inci: "Pentylene Glycol", name: "Pentylene Glycol", funktion: "Natürlicher Feuchtigkeitsspender und Konservierer" },
      { inci: "Caesalpinia Spinosa (Tara) Gum", name: "Tarakernmehl", funktion: "Natürliches, pflanzliches Verdickungsmittel, beruhigt gereizte Haut" },
      { inci: "Allantoin", name: "Allantoin", funktion: "Unterstützt den Heilungsprozess der Haut, beruhigt, glättet und regt die Zellteilung und -neubildung an" },
      { inci: "4-t-Butylcyclohexanol", name: "4-t-Butylcyclohexanol", funktion: "Hautberuhigender Wirkstoff für empfindliche Haut" },
      { inci: "Epigallocatechin Gallate", name: "Epigallocatechin Gallate", funktion: "Wirkt antioxidativ, entzündungshemmend und spendet Feuchtigkeit" },
      { inci: "Arginine", name: "Arginine", funktion: "Wirkt hautberuhigend, pH-Wert ausgleichend, feuchtigkeitsspendend und antioxidativ" },
      { inci: "Phospholipids & Sphingolipids", name: "Phospholipide & Sphingolipide", funktion: "Sind Teil der menschlichen Zellmembran und regen die Ceramide-Produktion an. Damit erhalten Sie eine intakte Hautbarriere und sorgen für geringeren Wasserverlust der Haut, was die Haut glatter, gesünder und jünger aussehen lässt" },
      { inci: "Sodium Citrate", name: "Natriumcitrat (Natriumsalz der Zitronensäure)", funktion: "Stellt den pH-Wert des Produkts optimal auf den pH-Wert der Haut ein. Es wirkt antioxidativ und ist mild zur Haut" },
      { inci: "Sodium Anisate", name: "Salz der Anissäure", funktion: "Der Stoff ist pflanzlichen Ursprungs und wirkt antibakteriell" },
      { inci: "Tocopherol", name: "Vitamin E", funktion: "Wirkt stark antioxidativ, beruhigend und glättend. Damit ist es ein besonders effektiver Slow-Aging Wirkstoff" },
    ],
  },
  light: {
    subtitle: "Derma Membran Struktur Creme",
    image: "/manus-storage/pasted_file_NyfxqL_Component135_2a6aa513.webp",
    anwendung: "Wirkstoffe in die Basiscreme geben, mit dem mitgelieferten Holzspatel 2 Minuten umrühren. Die fertige individuelle Creme morgens und abends auf die gereinigte Haut auftragen.",
    hautprobleme: "Geschwächte Hautbarriere, Feuchtigkeitsmangel",
    hauttypen: "Alle Hauttypen, besonders Normale bis Mischhaut",
    wirkung: "Die leichte Basiscreme basiert auf der Derma Membran Struktur und ahmt den natürlichen Aufbau der Haut nach. Sie baut mit hauteigenen Lipiden die Hautbarriere auf und zieht mit ihrer leichten Textur schnell ein. Ideal als Grundlage für deine individuellen Wirkstoffe.",
    inhaltsstoffe: [
      { inci: "Aqua", name: "Wasser", funktion: "Basis" },
      { inci: "Caprylic/Capric Triglyceride", name: "Pflanzliche Triglyceride", funktion: "Hautpflegend, rückfettend, leichte Textur" },
      { inci: "Ceramide NP", name: "Ceramide NP", funktion: "Stärkt die Hautbarriere, essentiell für Hautstruktur" },
      { inci: "Glycerin", name: "Pflanzliches Glycerin", funktion: "Feuchtigkeitsspender" },
      { inci: "Sodium Hyaluronate", name: "Hyaluronsäure", funktion: "Feuchtigkeitsbindung" },
      { inci: "Panthenol", name: "Panthenol", funktion: "Beruhigend, feuchtigkeitsspendend" },
    ],
  },
  rich: {
    subtitle: "Derma Membran Struktur Creme Reichhaltig",
    image: "/manus-storage/pasted_file_9gl5S4_Component133_87058f30.webp",
    anwendung: "Wirkstoffe in die Basiscreme geben, mit dem mitgelieferten Holzspatel 2 Minuten umrühren. Die fertige individuelle Creme morgens und abends auf die gereinigte Haut auftragen.",
    hautprobleme: "Starke Trockenheit, rissige Haut, geschwächte Hautbarriere",
    hauttypen: "Trockene Haut, Sehr trockene Haut",
    wirkung: "Die reichhaltige Basiscreme basiert auf der Derma Membran Struktur und versorgt sehr trockene Haut mit extra Fetten. Sie baut mit hauteigenen Lipiden die Hautbarriere auf und schützt langanhaltend vor Feuchtigkeitsverlust. Ideal für Haut, die intensive Pflege benötigt.",
    inhaltsstoffe: [
      { inci: "Aqua", name: "Wasser", funktion: "Basis" },
      { inci: "Caprylic/Capric Triglyceride", name: "Pflanzliche Triglyceride", funktion: "Hautpflegend, rückfettend" },
      { inci: "Shea Butter", name: "Sheabutter", funktion: "Intensiv nährend, schützend, reich an Fettsäuren" },
      { inci: "Ceramide NP", name: "Ceramide NP", funktion: "Stärkt die Hautbarriere" },
      { inci: "Glycerin", name: "Pflanzliches Glycerin", funktion: "Feuchtigkeitsspender" },
      { inci: "Sodium Hyaluronate", name: "Hyaluronsäure", funktion: "Feuchtigkeitsbindung" },
      { inci: "Panthenol", name: "Panthenol", funktion: "Beruhigend, feuchtigkeitsspendend" },
      { inci: "Allantoin", name: "Allantoin", funktion: "Beruhigend, hautglättend" },
    ],
  },
};

export const CREME_INGREDIENT_DETAILS: Record<string, Omit<IngredientDetail, "id" | "name" | "description">> = {
  baseCreme: {
    subtitle: "Basiscreme",
    anwendung: "Wirkstoffe in die Basiscreme geben, mit dem mitgelieferten Holzspatel 2 Minuten umrühren. Die fertige individuelle Creme morgens und abends auf die gereinigte Haut auftragen.",
    hautprobleme: "Alle Hautprobleme",
    hauttypen: "Alle Hauttypen",
    wirkung: "Die leichte Basiscreme basiert auf der Derma Membran Struktur und ahmt den natürlichen Aufbau der Haut nach. Sie baut mit hauteigenen Lipiden die Hautbarriere auf und zieht mit ihrer leichten Textur schnell ein.",
    inhaltsstoffe: [
      { inci: "Aqua", name: "Water", funktion: "Wasser als Basis" },
      { inci: "Hydrogenated Phosphatidylcholine", name: "Phosphatidylcholin (PC)", funktion: "Hauptbestandteil menschlicher Zellmembran, stärkt die Hautbarriere, stimuliert die Hauterneuerung transportiert Vitamine in tiefere Hautschichten" },
      { inci: "Capriylic/Capric Trigylceride", name: "Pflanzliches Neutralöl (kein Palmöl!)", funktion: "Reizfreie ölige Basis, erleichtert das Auftragen und sorgt dafür, dass die Pflege schnell einzieht" },
      { inci: "Butyrospermum Parkii (Shea) Butter", name: "Shea Butter", funktion: "Stärkt die Hautbarriere, pflegt und beruhigt die Haut, wirkt entzündungshemmend" },
      { inci: "Glycerin", name: "Pflanzliches Glycerin (kein Mineralöl!)", funktion: "Intensiver, pflanzlicher Feuchtigkeitsspender" },
      { inci: "Pentylene Glycol", name: "Pentylene Glycol", funktion: "Natürlicher Feuchtigkeitsspender und Konservierer" },
      { inci: "Squalane", name: "Squalane", funktion: "Hauptbestandteil des hauteigenen Lipidfilms, Glättend, pflegend, erleichtert das Auftragen und sorgt dafür, dass die Pflege schnell einzieht" },
      { inci: "Ceramide NP", name: "Ceramide NP", funktion: "Stärken die Hautbarriere" },
    ],
  },
  baseCremeRich: {
    subtitle: "Basiscreme Reichhaltig",
    anwendung: "Wirkstoffe in die Basiscreme geben, mit dem mitgelieferten Holzspatel 2 Minuten umrühren. Die fertige individuelle Creme morgens und abends auf die gereinigte Haut auftragen.",
    hautprobleme: "Alle Hautprobleme",
    hauttypen: "Alle Hauttypen",
    wirkung: "Die reichhaltige Basiscreme basiert auf der Derma Membran Struktur und versorgt sehr trockene Haut mit extra Fetten. Sie baut mit hauteigenen Lipiden die Hautbarriere auf und schützt langanhaltend vor Feuchtigkeitsverlust.",
    inhaltsstoffe: [
      { inci: "Aqua", name: "Gereinigtes Wasser", funktion: "Wasser als Basis" },
      { inci: "Squalane", name: "Squalane", funktion: "Hauptbestandteil des hauteigenen Lipidfilms, Glättend, pflegend, erleichtert das Auftragen und sorgt dafür, dass die Pflege schnell einzieht" },
      { inci: "Capriylic/Capric Trigylceride", name: "Pflanzliches Neutralöl (kein Palmöl!)", funktion: "Reizfreie ölige Basis, erleichtert das Auftragen und sorgt dafür, dass die Pflege schnell einzieht" },
      { inci: "Hydrogenated Phosphatidylcholine", name: "Phosphatidylcholin (PC)", funktion: "Hauptbestandteil menschlicher Zellmembran, stärkt die Hautbarriere, stimuliert die Hauterneuerung transportiert Vitamine in tiefere Hautschichten" },
      { inci: "Prunus Domestica (Plum) Seed Oil, Hydrogenated Prunus Domestica (Plum) Seed Oil, Stearic Acid", name: "Pflaumenkernbutter", funktion: "Pflegt die Haut intensiv und sorgt für eine schnellere Regeneration der Haut" },
      { inci: "Butyrosperum Parkii (Shea) Butter", name: "Shea Butter", funktion: "Stärkt die Hautbarriere, pflegt und beruhigt die Haut, wirkt entzündungshemmend" },
      { inci: "Glycerin", name: "Pflanzliches Glycerin (kein Mineralöl!)", funktion: "Intensiver, pflanzlicher Feuchtigkeitsspender" },
      { inci: "Pentylene Glycol", name: "Pentylene Glycol", funktion: "Natürlicher Feuchtigkeitsspender und Konservierer" },
      { inci: "Ceramide NP", name: "Ceramide", funktion: "Stärken die Hautbarriere" },
      { inci: "Tocopherol", name: "Vitamin E", funktion: "Beruhigend, schützt die Haut vor Umwelteinflüssen, fördert die Hauterneuerung" },
    ],
  },
  willow: {
    subtitle: "Weidenrindenextrakt",
    inhaltsstoffe: [
      { inci: "Glycerin", name: "Pflanzliches Glycerin", funktion: "Intensiver, pflanzlicher Feuchtigkeitsspender und Lösungsmittel für die Extraktion" },
      { inci: "Aqua", name: "Wasser", funktion: "Wasser als Lösemittel für die Extraktion" },
      { inci: "Salix Alba Bark Extract", name: "Weidenrindenextrakt", funktion: "Reguliert den Talgfluss und peelt die Haut sanft, anti-oxidativ, entzündungshemmend, adstringierend, erweichend, regenerierend" },
    ],
  },
  niacinamide: {
    subtitle: "Niacinamide Komplex",
    inhaltsstoffe: [
      { inci: "Aqua", name: "Wasser", funktion: "Wasser als Basis" },
      { inci: "Niacinamide", name: "Niacinamide", funktion: "Mattiert die Haut, zieht Poren zusammen, reduziert Unreinheiten, beruhigt die Haut, Anti-Aging Wirkstoff" },
      { inci: "Pentylene Glycol", name: "Pentylene Glycol", funktion: "Feuchtigkeitsspendend" },
    ],
  },
  vitaminc: {
    subtitle: "Vitamin C Komplex",
    inhaltsstoffe: [
      { inci: "3-Glyceryl Ascorbate", name: "Vitamin C Derivat", funktion: "Es wirkt stark antioxidativ, gleicht Pigmentstörungen und Sonnenschäden aus und hilft bei Pickelmalen." },
      { inci: "Glycerin", name: "Glycerin", funktion: "Intensiver, pflanzlicher Feuchtigkeitsspender" },
      { inci: "Ascorbyl Glucoside", name: "ein Vitamin C Derivat", funktion: "Antioxidativ, regt die Kollagenbildung an, bekämpft freie Radikale" },
      { inci: "Pentylene Glycol", name: "Pentylene Glycol", funktion: "Feuchtigkeitsspendend" },
      { inci: "Panthenol", name: "Panthenol oder Pro-Vitamin B5", funktion: "Fördert die Produktion von neuen Hautzellen, wundheilend, regt die Kollagenbildung an" },
      { inci: "Citric Acid", name: "Zitronensäure", funktion: "Stellt den pH-Wert ein" },
    ],
  },
  retinol: {
    subtitle: "Retinol Komplex",
    anwendung: "Wirkstoffe in die Basiscreme geben, mit dem mitgelieferten Holzspatel 2 Minuten umrühren. Die fertige Creme mit Retinol bestenfalls nur abends auf die gereinigte Haut auftragen, da die Haut lichtempfindlicher wird. Tagsüber unbedingt Sonnenschutz verwenden.",
    hautprobleme: "Falten, feine Linien, Hautalterung, Pigmentflecken",
    hauttypen: "Reife Haut, Normale Haut",
    wirkung: "Retinol (Vitamin A) beschleunigt die Zellerneuerung und stimuliert die Kollagenproduktion. Es glättet feine Linien und Falten, verfeinert das Hautbild und reduziert Pigmentflecken. Bei regelmäßiger Anwendung wird die Haut sichtbar straffer und ebenimäßiger.",
    inhaltsstoffe: [
      { inci: "Glycine Soja (Soybean) Oil", name: "Sojaöl", funktion: "Pflegt die Haut glatt und geschmeidig" },
      { inci: "Squalane", name: "Squalan", funktion: "Hauptbestandteil des hauteigenen Lipidfilms, Glättend, pflegend, erleichtert das Auftragen und sorgt dafür, dass die Pflege schnell einzieht" },
      { inci: "Retinol", name: "Retinol (Vitamin A)", funktion: "Reduziert Falten, macht die Haut glatter und ebenmäßiger, reduziert Pigmentflecken, porenverfeinernd" },
      { inci: "Helianthus Annuus (Sunflower) Seed Oil", name: "Sonnenblumenöl", funktion: "Macht die Haut weich und versorgt sie mit Feuchtigkeit" },
      { inci: "Retinyl Acetate", name: "Retinolester", funktion: "Reduziert Falten, macht die Haut glatter und ebenmäßiger, reduziert Pigmentflecken, porenverfeinernd" },
      { inci: "Tocopherol", name: "Vitamin E", funktion: "Beruhigend, schützt die Haut vor Umwelteinflüssen, fördert die Hauterneuerung" },
      { inci: "Beta-Carotene", name: "Beta-Carotin/Provitamin A", funktion: "Schützt vor vorzeitiger Hautalterung und Erschlaffung der Haut und regt die Mikrozirkulation der Haut an" },
      { inci: "Daucus Carota Sativa (Carrot) Root Extract", name: "Karottenöl", funktion: "Macht die Haut weich und geschmeidig und spendet Feuchtigkeit, schützt die Zellen und regt ihre Erneuerung an, gegen frühzeitige Hautalterung" },
    ],
  },
  spilanthol: {
    subtitle: "Reiner Spilantholkomplex",
    image: "/manus-storage/pasted_file_kLZtbX_Component113_4cce2ac9.webp",
    anwendung: "Wirkstoffe in die Basiscreme geben, mit dem mitgelieferten Holzspatel 2 Minuten umrühren. Die fertige individuelle Creme morgens und abends auf die gereinigte Haut auftragen.",
    hautprobleme: "Mimikfalten, Spannungsgefühl, feine Linien",
    hauttypen: "Alle Hauttypen",
    wirkung: "Spilanthol wird aus der Parakresse gewonnen und wirkt als natürlicher Muskelrelaxant. Es entspannt die Gesichtsmuskulatur sanft und reduziert so Mimikfalten. Die Haut wird sofort sichtbar glatter und fühlt sich entspannt an – ein natürlicher Botox-Effekt.",
    inhaltsstoffe: [
      { inci: "Propanediol", name: "Pflanzliches Glykol", funktion: "Feuchtigkeitsspendendes Lösungsmittel, verbessert die Hautaufnahme anderer Wirkstoffe, sanft zur Haut" },
      { inci: "Aqua (Water)", name: "Wasser", funktion: "Wasser als Lösemittel für die Extraktion" },
      { inci: "Acmella Oleracea Extract", name: "Parakresse-Extrakt", funktion: "Enthält natürliches Spilanthol - pflanzliches Botox, entspannt die Gesichtsmuskulatur, reduziert Mimikfalten sichtbar" },
    ],
  },
  mallow: {
    subtitle: "Malvenextrakt",
    inhaltsstoffe: [
      { inci: "Aqua", name: "Wasser", funktion: "Wasser als Lösemittel für die Extraktion" },
      { inci: "Malva Sylvestris Flower Extract", name: "Malvenextrakt", funktion: "After-Sun und Anti-aging Wirkstoff, wirkt beruhigend, glättend, feuchtigkeitsbewahrend, reizlindernd und entzündungshemmend. Lindert Rötungen und schützt vor Umwelteinflüssen" },
    ],
  },
  horsechestnut: {
    subtitle: "Rosskastanienextrakt",
    inhaltsstoffe: [
      { inci: "Aqua", name: "Wasser", funktion: "Wasser als Lösemittel für die Extraktion" },
      { inci: "Aesculus Hippocastanum Seed Extract", name: "Rosskastanienextrakt", funktion: "Stärkt die Kapillarwände, wirkt glättend, beruhigend, abschwellend, wundheilend, erfrischend, adstringierend, entzündungshemmend und aufhellend" },
    ],
  },
  algae: {
    subtitle: "Algenextrakt",
    inhaltsstoffe: [
      { inci: "Aqua", name: "Wasser", funktion: "Wasser als Lösungsmittel für die Extraktion" },
      { inci: "Fucus Vesiculosus Extract", name: "Blasentangextrakt", funktion: "Anti-aging Wirkstoff, stark feuchtigkeitsspendend, regenerierend, straffend, schützt vor Umwelteinflüssen und beruhigt die Haut" },
    ],
  },
  hyaluronic: {
    subtitle: "Hyaluronkomplex",
    inhaltsstoffe: [
      { inci: "Pentylene Glycol", name: "Pentylene Glycol", funktion: "Natürlicher Konservierer und Feuchtigkeitsspender" },
      { inci: "Sodium Hyaluronate", name: "Hyaluronsäure", funktion: "Bindet Feuchtigkeit und bewahrt diese" },
      { inci: "N-Acetyl Glucosamine", name: "Glucosamin ohne Natrium und Sulfate", funktion: "Gut verträglicher körpereigener Baustein, Baustein von Hyaluronsäure" },
      { inci: "Hyaluronic Acid", name: "Hyaluronsäure", funktion: "Bindet Feuchtigkeit und bewahrt diese" },
      { inci: "Hydrolyzed Sodium Hyaluronate", name: "Hydrolisierte Hyaluronsäure", funktion: "Dringt in die untersten Hautschichten ein, spendet dort Feuchtigkeit und ist besonders langanhaltend" },
      { inci: "Tremella Fuciformis Sporocarp Extract", name: "Silberohr (ein Vitalpilz)", funktion: "Ein Heil- und Vitalpilz mit starker Anti-Aging Wirkung" },
      { inci: "Sodium Acetylated Hyaluronate", name: "Acetylierte Hyaluronsäure", funktion: "Dringt tiefer in die Haut ein als klassische Hyaluronsäure, geringerer Verdunstungseffekt, verbessert Hautelastizität und repariert die Hautbarriere" },
    ],
  },
  rosehip: {
    subtitle: "Wildrosenöl",
    inhaltsstoffe: [
      { inci: "Rosa Canina Fruit Oil", name: "Wildrosenöl", funktion: "Trägt zur Heilung von Narben bei und hellt Pigmentflecken auf, feuchtigkeitsspendend, glättend, pflegend, anti-oxidativ, sorgt für den natürlichen Glow" },
    ],
  },
  seabuckthorn: {
    subtitle: "Sanddornöl",
    inhaltsstoffe: [
      { inci: "Hippophae Rhamnoides (Seabuckthorn) Oil", name: "Sanddornöl", funktion: "Reichhaltiger anti-aging Wirkstoff, reduziert Faltentiefe, anti-oxidativ, Schutz vor Umwelteinflüssen, Schutz vor Feuchtigkeitsverlust" },
    ],
  },
  grapeseed: {
    subtitle: "Traubenkernöl",
    inhaltsstoffe: [
      { inci: "Vitis Vinifera (Grape) Seed Oil", name: "Traubenkernöl", funktion: "Zieht schnell ein, Anti-aging Wirkstoff, reduziert Faltentiefe, verbessert Feuchtigkeit und Elastizität, regenerierend, entzündungshemmend, hilft bei der Heilung von Akne und Entzündungen" },
    ],
  },
  safflower: {
    subtitle: "Distelöl",
    inhaltsstoffe: [
      { inci: "Carthamus Tinctorius (Safflower) Oil", name: "Distelöl", funktion: "Schützt den Haut vor Feuchtigkeitsverlust, wirkt talgregulierend und ausgleichend, entzündungshemmend und anti-oxidativ" },
    ],
  },
};

export default function IngredientDetailModal({ ingredient, onClose, productType = "serum" }: IngredientDetailModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };

  }, [onClose]);

  if (!ingredient) return null;

  // Map configurator IDs to creme ingredient keys
  const cremeIdMap: Record<string, string> = {
    light: "baseCreme",
    rich: "baseCremeRich",
  };
  
  const ingredientKey = productType === "creme" && cremeIdMap[ingredient.id] ? cremeIdMap[ingredient.id] : ingredient.id;
  const rawDetails = productType === "creme" ? CREME_INGREDIENT_DETAILS[ingredientKey] : SERUM_INGREDIENT_DETAILS[ingredient.id];
  // Override anwendung text for shared ingredients when used in creme context
  const details = rawDetails && productType === "creme" && !rawDetails.anwendung?.toLowerCase().includes("basiscreme")
    ? { ...rawDetails, anwendung: "Wirkstoffe in die Basiscreme geben, mit dem mitgelieferten Holzspatel 2 Minuten umrühren. Die fertige individuelle Creme morgens und abends auf die gereinigte Haut auftragen." }
    : rawDetails;

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
          {ingredient.image && (
            <div className="w-full flex-shrink-0">
              <div className="aspect-square rounded-lg overflow-hidden bg-transparent flex items-center justify-center">
                <img
                  src={ingredient.image}
                  alt={ingredient.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          <div className="flex-1">
            {details?.subtitle && (
              <p className="text-xs uppercase tracking-widest text-[#7D7D5D] mb-1">
                {details.subtitle}
              </p>
            )}
            <h2 className="font-serif text-2xl md:text-3xl text-[#2c2c2c] mb-3">
              {ingredient.name}
            </h2>
            <p className="text-[#5a5a5a] italic leading-relaxed">
              &ldquo;{ingredient.description}&rdquo;
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-5">
          {/* Anwendung */}
          {details?.anwendung && (
            <div className="flex gap-3">
              <Droplets className="w-5 h-5 text-[#5B5B38] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm text-[#2c2c2c] mb-1">Anwendung</h4>
                <p className="text-sm text-[#5a5a5a] leading-relaxed">{details.anwendung}</p>
              </div>
            </div>
          )}

          {/* Hautprobleme & Hauttypen */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {details?.hautprobleme && (
              <div className="flex gap-3">
                <Heart className="w-5 h-5 text-[#5B5B38] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-[#2c2c2c] mb-1">Hautprobleme</h4>
                  <p className="text-sm text-[#5a5a5a]">{details.hautprobleme}</p>
                </div>
              </div>
            )}
            {details?.hauttypen && (
              <div className="flex gap-3">
                <Leaf className="w-5 h-5 text-[#5B5B38] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-[#2c2c2c] mb-1">Hauttypen</h4>
                  <p className="text-sm text-[#5a5a5a]">{details.hauttypen}</p>
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
          {details?.wirkung && (
            <div className="border-t border-[#5B5B38]/20 pt-5">
              <div className="flex items-center gap-2 mb-3">
                <Beaker className="w-5 h-5 text-[#5B5B38]" />
                <h3 className="font-serif text-lg text-[#5B5B38]">Wirkung</h3>
              </div>
              <p className="text-sm text-[#5a5a5a] leading-relaxed">{details.wirkung}</p>
            </div>
          )}

          {/* Inhaltsstoffe */}
          {details?.inhaltsstoffe && details.inhaltsstoffe.length > 0 && (
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
          )}
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

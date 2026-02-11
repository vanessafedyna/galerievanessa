type ChatbotAction = "intro" | "lumiere" | "couleur" | "contexte" | "similaire" | "droits";
type PeriodeFilter = "toutes" | "1940s" | "1950s" | "1960s" | "1970s-80s" | (string & {});
type HeaderLang = "fr" | "en";
type Medium = "vitrail" | "peinture" | "dessin";

interface Oeuvre {
  id: string;
  artiste?: string;
  titre: string;
  annee: number | string;
  periode: string;
  type: string;
  tags?: string[];
  mots_cles?: string[];
  palette?: string[];
  image?: string;
  resume?: string;
  contexte?: string;
  materiaux?: string[];
  lieu?: string;
  source?: string;
  source_url?: string;
}

interface ChatbotResponse {
  ok: boolean;
  title: string;
  meta?: string;
  tags?: string[];
  text?: string;
  periode?: string;
}

const qs = <T extends Element>(selector: string): T => {
  const el = document.querySelector<T>(selector);
  if (!el) {
    throw new Error(`Élément introuvable pour le sélecteur ${selector}`);
  }
  return el;
};

const qsa = <T extends Element>(selector: string): T[] => {
  return Array.from(document.querySelectorAll<T>(selector));
};

type I18nValue = string | ((vars: Record<string, string | number>) => string);

const i18n: Record<
  HeaderLang,
  {
    strings: Record<string, I18nValue>;
    periodeLabels: Record<string, string>;
    periodeNarration: Record<string, { title: string; text: string }>;
    contextePeriode: Record<string, string>;
  }
> = {
  fr: {
    strings: {
      siteTitle: "Mur de lumière",
      langGroup: "Langue",
      headerPlace: "Centre des sciences de Montréal",
      headerEvent: "Journée des femmes en science",
      headerBack: "Retourner à l’accueil",
      heroTitle: "Mur de lumière",
      heroSubtitle:
        "Choisis une période, puis clique un morceau de vitrail. Je t’explique simplement.",
      periodMenuToggle: "Périodes",
      timelineAria: "Ligne de temps",
      timelineAll: "Toutes",
      timeline1940s: "1940s · Débuts",
      timeline1950s: "1950s · Automatistes",
      timeline1960s: "1960s · Paris & transition",
      timeline1970s: "1970–80s · Maturité",
      periodCardAria: "Contexte de la période",
      vitrailAria: "Galerie vitrail",
      mosaicEyebrow: "jeu de vitrail",
      mosaicTitle: "Choisis un morceau",
      mosaicCopy:
        "Clique un fragment pour découvrir l’œuvre et ses couleurs.",
      mosaicHint: "Astuce : clique, puis lis l’histoire à droite.",
      legendPeriodPrefix: "Période",
      legendCountPrefix: "Œuvres",
      pagerAria: "Pagination des œuvres",
      pagerPrev: "◀ Précédent",
      pagerNext: "Suivant ▶",
      pageInfo: ({ current, total }) => `Page ${current} / ${total}`,
      panelAria: "Panneau guide",
      statusDefault: "Sélectionne un fragment",
      guideLabel: "Guide Ferron",
      artMetaDefault: "Clique une œuvre pour commencer.",
      sectionDescription: "Description",
      sourceBtn: "Voir la fiche du musée",
      thumbAria: "Vignette vitrail",
      botDefault: "Je raconte ici.",
      periodFallback: "Choisis une œuvre pour commencer.",
      kidIntroFallback: "On découvre une œuvre ensemble.",
      kidPrompt: "Choisis un bouton ci-dessous pour continuer.",
      actionIntro: "Découvrir",
      actionLumiere: "Lumière",
      actionCouleur: "Couleurs",
      actionContexte: "Histoire",
      actionSimilaire: "Œuvre similaire",
      actionDroits: "Droits",
      noteToggle: "Pour les parents",
      noteHtml:
        "<strong>Note :</strong> ce prototype n’utilise pas d’IA externe. Le JavaScript génère des réponses guidées. " +
        "Plus tard, tu pourras brancher une API IA (ou un endpoint) sur la même interface." +
        "<br /><br />" +
        "<strong>Droits :</strong> les œuvres de Marcelle Ferron ne sont pas dans le domaine public (Canada) avant le 1er janvier 2072. " +
        "Ici, on affiche des vignettes générées (dégradés) et on renvoie vers les fiches officielles via le bouton « Voir la fiche du musée »." +
        "<br />" +
        "<strong>Fond d’ambiance :</strong> fichier `images/hero.jpg` (à remplacer par une illustration libre de ton choix).",
      statusSelectFirst: "Choisis d’abord un fragment",
      botSelectFirst: "Clique sur une œuvre dans le vitrail, puis je lance l’analyse.",
      botNeedSelection: "Clique sur une œuvre dans le vitrail pour que je puisse la commenter.",
      statusError: "Erreur",
      defaultTitle: "Œuvre",
      selectionLabel: ({ title }) => `Sélection : ${title}`,
      pieceAria: ({ title, year, type }) => `${title} (${year}) — ${type}`,
      materialsLabel: "Matériaux",
      placeLabel: "Lieu",
      keywordsLabel: "Mots-clés",
      tagsLabel: "Tags",
      tipLabel: "Astuce",
      tipSource: "Astuce : utilise « Voir la fiche du musée » pour l'image officielle et les détails.",
      sourceLabel: "Source",
      introAngles:
        "Angles possibles :\n" +
        "• structure (lignes sombres / ‘plomb’)\n" +
        "• lumière (zones qui ‘s’allument’)\n" +
        "• tension chaud/froid (couleurs)",
      analysisLumiereTitle: ({ title }) => `Lumière — ${title}`,
      analysisLumiereBody:
        "1) Trouve une zone très claire.\n" +
        "2) Suis les lignes sombres : elles découpent les morceaux.\n" +
        "3) Quelle zone attire tes yeux en premier ?\n\n",
      analysisCouleurTitle: ({ title }) => `Couleurs — ${title}`,
      analysisCouleurBody:
        "1) Nomme 3 couleurs que tu vois.\n" +
        "2) Laquelle est la plus forte ?\n" +
        "3) Plutôt chaud (rouge/orange) ou froid (bleu/violet) ?\n\n",
      contexteTitle: ({ title }) => `Histoire — ${title}`,
      contexteHint:
        "Indice : les lignes sombres découpent l’image, comme dans un vitrail.",
      similaireTitle: ({ title, year }) => `Œuvre ‘similaire’ suggérée : ${title} (${year})`,
      similaireWhyDefault: "Pourquoi : proximité de période / style.",
      similaireNext:
        "Tu peux cliquer une autre œuvre dans le vitrail, ou filtrer une période pour comparer.",
      similaireTip:
        "Astuce : plus tu mets de tags précis dans data/oeuvres.json, plus ce matching devient intelligent.",
      similaireNone:
        "Je n’ai pas trouvé de comparaison solide. Ajoute plus d’œuvres et de tags dans data/oeuvres.json.",
      droitsTitle: ({ title }) => `Droits & réutilisation — ${title}`,
      droitsBody:
        "• Domaine public (Canada) : Marcelle Ferron est décédée en 2001, ses œuvres n’entrent donc pas dans le domaine public avant le 1er janvier 2072.\n" +
        "• Règle d’or : “trouvé sur Google” ≠ libre. Une image est réutilisable seulement si sa licence le permet.\n" +
        "• Photos sous licence libre : privilégie Wikimedia Commons (CC BY / CC BY-SA, etc.) et copie l’attribution demandée.\n\n",
      droitsExampleCcBy:
        "Exemple d’attribution (CC BY) :\n" +
        "Photo : NOM, “TITRE”, CC BY X.Y, via Wikimedia Commons. (Modifications : recadrage.)\n\n",
      droitsExampleCcBySa:
        "Exemple d’attribution (CC BY-SA) :\n" +
        "Photo : NOM, “TITRE”, CC BY-SA X.Y, via Wikimedia Commons. (Modifications : recadrage.)\n",
      droitsNote: "Note : CC BY-SA impose de repartager toute adaptation sous la même licence.",
      unknownAction: "Action inconnue."
    },
    periodeLabels: {
      toutes: "Toutes",
      "1940s": "Années 1940",
      "1950s": "Années 1950",
      "1960s": "Années 1960",
      "1970s-80s": "Années 1970–80"
    },
    periodeNarration: {
      toutes: {
        title: "Périodes",
        text:
          "Choisis une période pour voir des œuvres différentes."
      },
      "1940s": {
        title: "1940s — Débuts",
        text:
          "Les premières formes et idées."
      },
      "1950s": {
        title: "1950s — Geste",
        text:
          "Des œuvres pleines d’énergie."
      },
      "1960s": {
        title: "1960s — Recherches",
        text:
          "On teste des matières et des formes."
      },
      "1970s-80s": {
        title: "1970–80s — Maturité",
        text:
          "Le style devient plus sûr et très coloré."
      }
    },
    contextePeriode: {
      "1940s":
        "Contexte : débuts et climat automatiste (années 1940). L’abstraction se met en place, le geste s’émancipe, la modernité s’affirme au Québec (Refus global en 1948).",
      "1950s":
        "Contexte : Automatistes / abstraction gestuelle. Le geste, l’énergie et le contraste priment sur la représentation.",
      "1960s":
        "Contexte : années 1960 (Paris et recherches). Formats, matières, papiers, et une pensée plus structurée : segmentation, plans, contrastes.",
      "1970s-80s":
        "Contexte : maturité (années 1970–80). Le style se stabilise, la couleur s’affirme, et l’œuvre dialogue avec les supports et les lieux.",
      default: "Contexte : parcours global (Automatistes → vitrail → art public)."
    }
  },
  en: {
    strings: {
      siteTitle: "Wall of Light",
      langGroup: "Language",
      headerPlace: "Montréal Science Centre",
      headerEvent: "Women in Science Day",
      headerBack: "Back to home",
      heroTitle: "Wall of Light",
      heroSubtitle:
        "Pick a period, then click a stained-glass piece. I’ll explain it simply.",
      periodMenuToggle: "Periods",
      timelineAria: "Timeline",
      timelineAll: "All",
      timeline1940s: "1940s · Early years",
      timeline1950s: "1950s · Automatists",
      timeline1960s: "1960s · Paris & transition",
      timeline1970s: "1970–80s · Maturity",
      periodCardAria: "Period context",
      vitrailAria: "Stained glass gallery",
      mosaicEyebrow: "stained-glass game",
      mosaicTitle: "Pick a piece",
      mosaicCopy:
        "Click a fragment to discover the artwork and its colors.",
      mosaicHint: "Tip: click, then read the story on the right.",
      legendPeriodPrefix: "Period",
      legendCountPrefix: "Works",
      pagerAria: "Works pagination",
      pagerPrev: "◀ Previous",
      pagerNext: "Next ▶",
      pageInfo: ({ current, total }) => `Page ${current} / ${total}`,
      panelAria: "Guide panel",
      statusDefault: "Select a fragment",
      guideLabel: "Ferron Guide",
      artMetaDefault: "Click a work to begin.",
      sectionDescription: "Description",
      sourceBtn: "View museum record",
      thumbAria: "Stained glass thumbnail",
      botDefault: "My notes show up here.",
      periodFallback: "Choose a work to start.",
      kidIntroFallback: "Let’s discover an artwork together.",
      kidPrompt: "Pick a button below to continue.",
      actionIntro: "Explore",
      actionLumiere: "Light",
      actionCouleur: "Colors",
      actionContexte: "Story",
      actionSimilaire: "Similar work",
      actionDroits: "Rights",
      noteToggle: "For parents",
      noteHtml:
        "<strong>Note:</strong> this prototype does not use external AI. JavaScript generates guided responses. " +
        "Later, you can connect an AI API (or an endpoint) on the same interface." +
        "<br /><br />" +
        "<strong>Rights:</strong> Marcelle Ferron’s works are not in the public domain (Canada) before January 1, 2072. " +
        "Here we show generated thumbnails (gradients) and link to the official records via the “View museum record” button." +
        "<br />" +
        "<strong>Backdrop:</strong> file `images/hero.jpg` (replace with a free illustration of your choice).",
      statusSelectFirst: "Choose a fragment first",
      botSelectFirst: "Click a work in the stained glass, then I’ll start the analysis.",
      botNeedSelection: "Click a work in the stained glass so I can comment on it.",
      statusError: "Error",
      defaultTitle: "Artwork",
      selectionLabel: ({ title }) => `Selection: ${title}`,
      pieceAria: ({ title, year, type }) => `${title} (${year}) — ${type}`,
      materialsLabel: "Materials",
      placeLabel: "Location",
      keywordsLabel: "Keywords",
      tagsLabel: "Tags",
      tipLabel: "Tip",
      tipSource: "Tip: use “View museum record” for the official image and details.",
      sourceLabel: "Source",
      introAngles:
        "Possible angles:\n" +
        "• structure (dark lines / ‘lead’)\n" +
        "• light (areas that ‘light up’)\n" +
        "• warm/cool tension (colors)",
      analysisLumiereTitle: ({ title }) => `Light — ${title}`,
      analysisLumiereBody:
        "1) Find the brightest area.\n" +
        "2) Follow the dark lines: they split the pieces.\n" +
        "3) What area grabs your eyes first?\n\n",
      analysisCouleurTitle: ({ title }) => `Colors — ${title}`,
      analysisCouleurBody:
        "1) Name 3 colors you see.\n" +
        "2) Which one feels the strongest?\n" +
        "3) More warm (red/orange) or cool (blue/purple)?\n\n",
      contexteTitle: ({ title }) => `Story — ${title}`,
      contexteHint:
        "Tip: dark lines cut the image into pieces, like stained glass.",
      similaireTitle: ({ title, year }) => `Suggested similar work: ${title} (${year})`,
      similaireWhyDefault: "Why: proximity of period / style.",
      similaireNext:
        "You can click another work in the stained glass, or filter a period to compare.",
      similaireTip:
        "Tip: the more precise tags you add in data/oeuvres.json, the smarter this matching becomes.",
      similaireNone:
        "I didn’t find a solid comparison. Add more works and tags in data/oeuvres.json.",
      droitsTitle: ({ title }) => `Rights & reuse — ${title}`,
      droitsBody:
        "• Public domain (Canada): Marcelle Ferron died in 2001, so her works do not enter the public domain before January 1, 2072.\n" +
        "• Golden rule: “found on Google” ≠ free. An image is reusable only if its license allows it.\n" +
        "• Free-licensed photos: prefer Wikimedia Commons (CC BY / CC BY-SA, etc.) and copy the required attribution.\n\n",
      droitsExampleCcBy:
        "Attribution example (CC BY):\n" +
        "Photo: NAME, “TITLE”, CC BY X.Y, via Wikimedia Commons. (Modifications: crop.)\n\n",
      droitsExampleCcBySa:
        "Attribution example (CC BY-SA):\n" +
        "Photo: NAME, “TITLE”, CC BY-SA X.Y, via Wikimedia Commons. (Modifications: crop.)\n",
      droitsNote: "Note: CC BY-SA requires sharing any adaptation under the same license.",
      unknownAction: "Unknown action."
    },
    periodeLabels: {
      toutes: "All",
      "1940s": "1940s",
      "1950s": "1950s",
      "1960s": "1960s",
      "1970s-80s": "1970–80s"
    },
    periodeNarration: {
      toutes: {
        title: "Periods",
        text:
          "Pick a period to see different works."
      },
      "1940s": {
        title: "1940s — Early years",
        text:
          "The first shapes and ideas."
      },
      "1950s": {
        title: "1950s — Gesture",
        text:
          "Works full of energy."
      },
      "1960s": {
        title: "1960s — Experiments",
        text:
          "Trying materials and shapes."
      },
      "1970s-80s": {
        title: "1970–80s — Maturity",
        text:
          "A confident, colorful style."
      }
    },
    contextePeriode: {
      "1940s":
        "Context: early years and Automatist climate (1940s). Abstraction takes shape, the gesture emancipates, and modernity asserts itself in Quebec (Refus global in 1948).",
      "1950s":
        "Context: Automatists / gestural abstraction. Gesture, energy, and contrast prevail over representation.",
      "1960s":
        "Context: 1960s (Paris and research). Formats, materials, papers, and a more structured thinking: segmentation, planes, contrasts.",
      "1970s-80s":
        "Context: maturity (1970–80s). Style stabilizes, color asserts itself, and the work dialogues with supports and sites.",
      default: "Context: overall path (Automatists → stained glass → public art)."
    }
  }
};

const i18nValue = (key: string, vars: Record<string, string | number> = {}): string => {
  const raw = i18n[currentLang].strings[key];
  if (typeof raw === "function") return raw(vars);
  return raw ?? "";
};

const applyI18nStatic = (): void => {
  document.title = i18nValue("siteTitle");
  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (!key) return;
    el.textContent = i18nValue(key);
  });
  document.querySelectorAll<HTMLElement>("[data-i18n-html]").forEach((el) => {
    const key = el.dataset.i18nHtml;
    if (!key) return;
    el.innerHTML = i18nValue(key);
  });
  document.querySelectorAll<HTMLElement>("[data-i18n-attr]").forEach((el) => {
    const raw = el.dataset.i18nAttr;
    if (!raw) return;
    raw.split(";").forEach((pair) => {
      const [attr, key] = pair.split(":").map((part) => part.trim());
      if (!attr || !key) return;
      el.setAttribute(attr, i18nValue(key));
    });
  });
};

const headerRoot = document.querySelector<HTMLElement>(".marcelle-header");
const headerPlace = document.querySelector<HTMLElement>("#mhPlace");
const headerEvent = document.querySelector<HTMLElement>("#mhEvent");
const headerBack = document.querySelector<HTMLAnchorElement>(".mh-back");
const headerLangButtons = qsa<HTMLButtonElement>(".mh-lang-btn");

const hero = qs<HTMLElement>(".hero");
const mosaicPieces = qs<HTMLDivElement>("#mosaicPieces");
const mosaic = qs<HTMLElement>("#mosaic");
const statusBadge = qs<HTMLElement>("#status");
const artTitle = qs<HTMLElement>("#artTitle");
const artMeta = qs<HTMLElement>("#artMeta");
const sectionDesc = qs<HTMLElement>("#sectionDesc");
const artDesc = qs<HTMLElement>("#artDesc");
const sectionLinks = qs<HTMLElement>("#sectionLinks");
const sectionThumb = qs<HTMLElement>("#sectionThumb");
const artLinks = qs<HTMLElement>("#artLinks");
const sourceBtn = qs<HTMLAnchorElement>("#sourceBtn");
const artMedia = qs<HTMLElement>("#artMedia");
const botText = qs<HTMLElement>("#botText");
const legendPeriod = qs<HTMLElement>("#legendPeriod");
const legendCount = qs<HTMLElement>("#legendCount");
const periodTitle = qs<HTMLElement>("#periodTitle");
const periodText = qs<HTMLElement>("#periodText");
const prevPage = qs<HTMLButtonElement>("#prevPage");
const nextPage = qs<HTMLButtonElement>("#nextPage");
const pageInfo = qs<HTMLElement>("#pageInfo");

let currentLang: HeaderLang = "fr";
let lastAction: ChatbotAction = "intro";

const setHeaderLang = (lang: HeaderLang): void => {
  currentLang = lang;
  if (headerPlace) headerPlace.textContent = i18nValue("headerPlace");
  if (headerEvent) headerEvent.textContent = i18nValue("headerEvent");
  if (headerBack) {
    const backLabel = i18nValue("headerBack");
    headerBack.setAttribute("aria-label", backLabel);
    headerBack.setAttribute("title", backLabel);
  }
  headerLangButtons.forEach((btn) => {
    const isActive = btn.dataset.lang === lang;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
  document.documentElement.lang = lang;
  applyI18nStatic();
  updatePeriodCard();
  renderMosaic();
  updateSelectedDescription(selectedId);
  updateSelectedLinks(selectedId);
  updateSelectedMedia(selectedId);
  if (selectedId) {
    void callChatbot(lastAction);
  } else {
    statusBadge.textContent = i18nValue("statusDefault");
    artTitle.textContent = "…";
    artMeta.textContent = i18nValue("artMetaDefault");
    botText.textContent = i18nValue("botDefault");
  }
};

let oeuvres: Oeuvre[] = [];
let periodeActive: PeriodeFilter = "toutes";
let selectedId: string | null = null;
let pageIndex = 0;

const SLOTS = [
  "slot1",
  "slot2",
  "slot3",
  "slot4",
  "slot5",
  "slot6",
  "slot7",
  "slot8",
  "slot9"
] as const;

const gradientFromPalette = (palette?: string[]): string => {
  const [a = "#2a7bff", b = "#b04aff", c = "#ffcc4a"] = palette ?? [];
  return `linear-gradient(135deg, ${a}, ${b} 55%, ${c})`;
};

const hashSeed = (input: string): number => {
  // FNV-1a 32-bit
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
};

const mulberry32 = (seed: number): (() => number) => {
  let a = seed >>> 0;
  return (): number => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const clamp = (n: number, min: number, max: number): number => Math.min(max, Math.max(min, n));

const hexToRgbSimple = (hex: string): [number, number, number] | null => {
  const cleaned = String(hex ?? "").trim().replace("#", "");
  if (cleaned.length !== 3 && cleaned.length !== 6) return null;
  const full = cleaned.length === 3
    ? cleaned
        .split("")
        .map((char) => `${char}${char}`)
        .join("")
    : cleaned;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return [r, g, b];
};

const rgba = (hex: string, alpha: number): string => {
  const rgb = hexToRgbSimple(hex);
  if (!rgb) return `rgba(255,255,255,${clamp(alpha, 0, 1)})`;
  const [r, g, b] = rgb;
  return `rgba(${r},${g},${b},${clamp(alpha, 0, 1)})`;
};

const mediumFromType = (type: string): Medium => {
  const t = String(type ?? "").toLowerCase();
  if (t.includes("vitrail")) return "vitrail";
  if (t.includes("dessin")) return "dessin";
  return "peinture";
};

const normalizePalette = (palette?: string[], rng?: () => number): string[] => {
  const base = Array.isArray(palette) ? palette.filter((x) => typeof x === "string" && x.trim() !== "") : [];
  if (base.length >= 3) return base;
  const fallback = ["#5F388F", "#6249AC", "#FEC842", "#ED575A", "#52B646"];
  if (!rng) return fallback.slice(0, 3);

  const arr = fallback.slice();
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, 3);
};

const pickColors = (colors: string[], count: number, rng: () => number): string[] => {
  const unique = Array.from(new Set(colors));
  if (unique.length <= count) {
    const out = unique.slice();
    while (out.length < count) out.push(unique[out.length % unique.length] ?? "#ffffff");
    return out;
  }
  const pool = unique.slice();
  const out: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const idx = Math.floor(rng() * pool.length);
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
};

const buildVitrailPreviewBg = (palette: string[], rng: () => number): { bg: string; blend: string } => {
  const colors = pickColors(palette, 6, rng);
  const cx = Math.round(30 + rng() * 40);
  const cy = Math.round(30 + rng() * 40);
  const from = Math.round(rng() * 360);

  const cuts: number[] = [];
  for (let i = 0; i < 5; i += 1) cuts.push(10 + rng() * 80);
  cuts.sort((a, b) => a - b);

  const segs = [
    `${colors[0]} 0% ${cuts[0]}%`,
    `${colors[1]} ${cuts[0]}% ${cuts[1]}%`,
    `${colors[2]} ${cuts[1]}% ${cuts[2]}%`,
    `${colors[3]} ${cuts[2]}% ${cuts[3]}%`,
    `${colors[4]} ${cuts[3]}% ${cuts[4]}%`,
    `${colors[5]} ${cuts[4]}% 100%`
  ].join(", ");

  const glowX = Math.round(18 + rng() * 64);
  const glowY = Math.round(14 + rng() * 66);
  const leadA = Math.round(10 + rng() * 50);
  const leadB = (leadA + 90 + Math.round(rng() * 40)) % 180;

  const bg = [
    `radial-gradient(220px 180px at ${glowX}% ${glowY}%, rgba(254,200,66,.22), transparent 65%)`,
    `radial-gradient(260px 220px at ${100 - glowX}% ${100 - glowY}%, rgba(180,92,164,.18), transparent 70%)`,
    `conic-gradient(from ${from}deg at ${cx}% ${cy}%, ${segs})`,
    `repeating-linear-gradient(${leadA}deg, rgba(10,6,20,.82) 0 2px, rgba(10,6,20,0) 2px 26px)`,
    `repeating-linear-gradient(${leadB}deg, rgba(10,6,20,.55) 0 2px, rgba(10,6,20,0) 2px 32px)`,
    `radial-gradient(120% 90% at 50% 10%, rgba(255,255,255,.10), transparent 62%)`
  ].join(", ");

  const blend = "screen, screen, normal, multiply, multiply, soft-light";
  return { bg, blend };
};

const buildPeinturePreviewBg = (palette: string[], rng: () => number): { bg: string; blend: string } => {
  const colors = pickColors(palette, 5, rng);
  const a1 = Math.round(rng() * 360);
  const a2 = (a1 + 60 + Math.round(rng() * 80)) % 360;

  const blobs: string[] = [];
  for (let i = 0; i < 4; i += 1) {
    const x = Math.round(10 + rng() * 80);
    const y = Math.round(10 + rng() * 80);
    const s1 = Math.round(140 + rng() * 220);
    const s2 = Math.round(120 + rng() * 200);
    const c = colors[i % colors.length];
    blobs.push(`radial-gradient(${s1}px ${s2}px at ${x}% ${y}%, ${rgba(c, 0.70)}, transparent 68%)`);
  }

  const streak1 = `repeating-linear-gradient(${a1}deg, rgba(255,255,255,.06) 0 7px, rgba(0,0,0,0) 7px 22px)`;
  const streak2 = `repeating-linear-gradient(${a2}deg, rgba(0,0,0,.08) 0 5px, rgba(0,0,0,0) 5px 18px)`;

  const bg = [
    `linear-gradient(${a1}deg, ${rgba(colors[0], 0.90)}, ${rgba(colors[1], 0.70)} 52%, ${rgba(colors[2], 0.80)})`,
    ...blobs,
    `linear-gradient(${a2}deg, ${rgba(colors[3], 0.25)}, transparent 65%)`,
    streak1,
    streak2,
    `radial-gradient(120% 100% at 50% 10%, rgba(255,255,255,.10), transparent 60%)`
  ].join(", ");

  const blend = "normal, screen, screen, screen, soft-light, overlay, multiply, soft-light";
  return { bg, blend };
};

const buildDessinPreviewBg = (palette: string[], rng: () => number): { bg: string; blend: string } => {
  const colors = pickColors(palette, 3, rng);
  const accent = colors[Math.floor(rng() * colors.length)];
  const hatchA = Math.round(10 + rng() * 25);
  const hatchB = (hatchA + 90) % 180;

  const bg = [
    "linear-gradient(180deg, #f7f1e8, #e9e0d3)",
    `radial-gradient(240px 190px at ${Math.round(20 + rng() * 60)}% ${Math.round(20 + rng() * 60)}%, rgba(0,0,0,.08), transparent 70%)`,
    `repeating-linear-gradient(${hatchA}deg, rgba(0,0,0,.10) 0 1px, rgba(0,0,0,0) 1px 7px)`,
    `repeating-linear-gradient(${hatchB}deg, rgba(0,0,0,.07) 0 1px, rgba(0,0,0,0) 1px 10px)`,
    `radial-gradient(120px 90px at ${Math.round(55 + rng() * 35)}% ${Math.round(15 + rng() * 50)}%, ${rgba(accent, 0.22)}, transparent 70%)`,
    "radial-gradient(120% 90% at 50% 10%, rgba(255,255,255,.10), transparent 62%)"
  ].join(", ");

  const blend = "normal, multiply, multiply, multiply, normal, soft-light";
  return { bg, blend };
};

const createArtworkPreviewCSS = (
  artwork: Pick<Oeuvre, "id" | "titre" | "type" | "palette" | "image">
): { className: string; style: Record<string, string> } => {
  const medium = mediumFromType(artwork.type);
  const seedStr = `${artwork.id ?? artwork.titre ?? ""}::${medium}`;
  const rng = mulberry32(hashSeed(seedStr));
  const palette = normalizePalette(artwork.palette, rng);

  const result =
    medium === "vitrail"
      ? buildVitrailPreviewBg(palette, rng)
      : medium === "dessin"
        ? buildDessinPreviewBg(palette, rng)
        : buildPeinturePreviewBg(palette, rng);

  return {
    className: `thumb thumb--${medium}`,
    style: {
      "--thumb-bg": result.bg,
      "--thumb-blend": result.blend
    }
  };
};

const applyArtworkPreview = (el: HTMLElement, artwork: Oeuvre): void => {
  const preview = createArtworkPreviewCSS(artwork);
  el.classList.add("thumb");
  el.classList.remove("thumb--vitrail", "thumb--peinture", "thumb--dessin");
  preview.className
    .split(" ")
    .filter(Boolean)
    .forEach((c) => el.classList.add(c));
  Object.entries(preview.style).forEach(([key, value]) => {
    el.style.setProperty(key, value);
  });
};

const setSelectedVisual = (id: string | null): void => {
  Array.from(mosaicPieces.querySelectorAll<HTMLDivElement>(".piece")).forEach((piece) => {
    const isSelected = piece.dataset.id === id;
    piece.setAttribute("aria-selected", isSelected ? "true" : "false");
  });
};

const loadOeuvres = async (): Promise<void> => {
  const response = await fetch("/data/oeuvres.json", { cache: "no-store" });
  const data = (await response.json()) as Oeuvre[];
  oeuvres = data;
};

const periodeLabel = (periode: string): string => {
  return i18n[currentLang].periodeLabels[periode] ?? periode;
};

const periodeNarration = (periode: string): { title: string; text: string } => {
  const data = i18n[currentLang].periodeNarration[periode];
  if (data) return data;
  return {
    title: `${i18nValue("legendPeriodPrefix")} : ${periode}`,
    text: i18nValue("periodFallback")
  };
};

const updatePeriodCard = (): void => {
  const card = periodeNarration(periodeActive);
  periodTitle.textContent = card.title;
  periodText.textContent = card.text;
};

const filterOeuvresByPeriode = (list: Oeuvre[], periode: string): Oeuvre[] => {
  if (periode === "toutes") {
    return list;
  }
  return list.filter((oeuvre) => oeuvre.periode === periode);
};

const resetSelectionState = (): void => {
  selectedId = null;
  document.body.classList.remove("has-selection");
  statusBadge.textContent = i18nValue("statusDefault");
  artTitle.textContent = "…";
  artMeta.textContent = i18nValue("artMetaDefault");
  artMedia.setAttribute("hidden", "true");
  artMedia.style.backgroundImage = "";
  artMedia.classList.remove("thumb", "thumb--vitrail", "thumb--peinture", "thumb--dessin");
  artMedia.style.removeProperty("--thumb-bg");
  artMedia.style.removeProperty("--thumb-blend");
  sectionDesc.setAttribute("hidden", "true");
  artDesc.textContent = "";
  sectionLinks.setAttribute("hidden", "true");
  sectionThumb.setAttribute("hidden", "true");
  sourceBtn.href = "#";
  botText.textContent = i18nValue("botDefault");
};

const buildLocalDescription = (oeuvre: Oeuvre): string => {
  const parts: string[] = [];

  if (oeuvre.contexte && oeuvre.contexte.trim()) {
    parts.push(oeuvre.contexte.trim());
  } else {
    // Fallback: narration par période si pas de contexte spécifique.
    parts.push(periodeNarration(oeuvre.periode).text);
  }

  if (oeuvre.materiaux?.length) {
    parts.push(`${i18nValue("materialsLabel")} : ${oeuvre.materiaux.join(", ")}`);
  }
  if (oeuvre.lieu) {
    parts.push(`${i18nValue("placeLabel")} : ${oeuvre.lieu}`);
  }
  if (oeuvre.mots_cles?.length) {
    parts.push(`${i18nValue("keywordsLabel")} : ${oeuvre.mots_cles.join(" • ")}`);
  }
  if (oeuvre.source_url) {
    parts.push(i18nValue("tipSource"));
  }

  return parts.join("\n\n");
};

const updateSelectedDescription = (id: string | null): void => {
  if (!id) {
    sectionDesc.setAttribute("hidden", "true");
    artDesc.textContent = "";
    return;
  }

  const oeuvre = oeuvres.find((o) => o.id === id);
  if (!oeuvre) {
    sectionDesc.setAttribute("hidden", "true");
    artDesc.textContent = "";
    return;
  }

  artDesc.textContent = buildLocalDescription(oeuvre);
  sectionDesc.removeAttribute("hidden");
};

const updateSelectedLinks = (id: string | null): void => {
  if (!id) {
    sectionLinks.setAttribute("hidden", "true");
    sourceBtn.href = "#";
    return;
  }

  const oeuvre = oeuvres.find((o) => o.id === id);
  const url = oeuvre?.source_url;
  if (url) {
    sectionLinks.removeAttribute("hidden");
    sourceBtn.href = url;
  } else {
    sectionLinks.setAttribute("hidden", "true");
    sourceBtn.href = "#";
  }
};

const updateSelectedMedia = (id: string | null): void => {
  if (!id) {
    sectionThumb.setAttribute("hidden", "true");
    artMedia.style.backgroundImage = "";
    artMedia.classList.remove("thumb", "thumb--vitrail", "thumb--peinture", "thumb--dessin");
    artMedia.style.removeProperty("--thumb-bg");
    artMedia.style.removeProperty("--thumb-blend");
    return;
  }

  const oeuvre = oeuvres.find((o) => o.id === id);
  if (!oeuvre) {
    sectionThumb.setAttribute("hidden", "true");
    artMedia.style.backgroundImage = "";
    artMedia.classList.remove("thumb", "thumb--vitrail", "thumb--peinture", "thumb--dessin");
    artMedia.style.removeProperty("--thumb-bg");
    artMedia.style.removeProperty("--thumb-blend");
    return;
  }

  // Stratégie "safe": on affiche une vignette générée (dégradé), pas la photo de l'oeuvre.
  artMedia.style.backgroundImage = "";
  applyArtworkPreview(artMedia, oeuvre);
  sectionThumb.removeAttribute("hidden");
};

const normalizeStrList = (val: unknown): string[] => {
  if (!Array.isArray(val)) return [];
  return val
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

const hexToRgb = (hex: string): [number, number, number] | null => {
  const cleaned = hex.trim().replace("#", "");
  if (cleaned.length !== 3 && cleaned.length !== 6) return null;
  const full = cleaned.length === 3
    ? cleaned
        .split("")
        .map((char) => `${char}${char}`)
        .join("")
    : cleaned;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return [r, g, b];
};

const paletteAvgRgb = (palette?: string[]): [number, number, number] | null => {
  if (!palette?.length) return null;
  let sumR = 0;
  let sumG = 0;
  let sumB = 0;
  let count = 0;
  palette.forEach((hex) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return;
    sumR += rgb[0];
    sumG += rgb[1];
    sumB += rgb[2];
    count += 1;
  });
  if (count === 0) return null;
  return [sumR / count, sumG / count, sumB / count];
};

const rgbDistance = (a: [number, number, number] | null, b: [number, number, number] | null): number | null => {
  if (!a || !b) return null;
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
};

const contextePeriode = (periode: string): string => {
  return i18n[currentLang].contextePeriode[periode] ?? i18n[currentLang].contextePeriode.default;
};

const buildChatbotResponse = (
  action: ChatbotAction,
  oeuvre: Oeuvre,
  all: Oeuvre[]
): ChatbotResponse => {
  const titre = oeuvre.titre ?? i18nValue("defaultTitle");
  const artiste = oeuvre.artiste ?? "Marcelle Ferron";
  const annee = oeuvre.annee ?? "";
  const periode = oeuvre.periode ?? "";
  const type = oeuvre.type ?? "";
  const tags = oeuvre.tags ?? [];
  const resume = oeuvre.resume ?? "";
  const contexte = oeuvre.contexte ?? "";
  const materiaux = oeuvre.materiaux ?? [];
  const lieu = oeuvre.lieu ?? "";
  const motsCles = oeuvre.mots_cles ?? [];
  const source = oeuvre.source ?? "";
  const sourceUrl = oeuvre.source_url ?? "";

  const metaParts: string[] = [];
  if (artiste) metaParts.push(artiste);
  if (annee !== "") metaParts.push(String(annee));
  if (periode) metaParts.push(periode);
  if (type) metaParts.push(type);
  if (source) metaParts.push(source);
  const meta = metaParts.join(" · ");

  const tagsStr = normalizeStrList(tags).join(" • ");
  const motsClesStr = normalizeStrList(motsCles).join(" • ");
  const materiauxStr = normalizeStrList(materiaux).join(", ");

  const ctx = contextePeriode(periode);
  const ctxLocal = typeof contexte === "string" && contexte.trim() !== "" ? contexte.trim() : ctx;

  let sourceLine = "";
  if (sourceUrl && source) {
    sourceLine = `${i18nValue("sourceLabel")} : ${source} — ${sourceUrl}`;
  } else if (sourceUrl) {
    sourceLine = `${i18nValue("sourceLabel")} : ${sourceUrl}`;
  } else if (source) {
    sourceLine = `${i18nValue("sourceLabel")} : ${source}`;
  }

  let text = "";
  switch (action) {
    case "intro": {
      const introParts: string[] = [];
      if (typeof resume === "string" && resume.trim() !== "") {
        introParts.push(resume.trim());
      } else {
        introParts.push(i18nValue("kidIntroFallback"));
      }
      introParts.push(i18nValue("kidPrompt"));
      text = `${introParts.join("\n\n")}\n`;
      break;
    }
    case "lumiere":
      text =
        `${i18nValue("analysisLumiereTitle", { title: titre })}\n\n` +
        i18nValue("analysisLumiereBody");
      break;
    case "couleur":
      text =
        `${i18nValue("analysisCouleurTitle", { title: titre })}\n\n` +
        i18nValue("analysisCouleurBody");
      break;
    case "contexte":
      text =
        `${i18nValue("contexteTitle", { title: titre })}\n\n` + `${periodeNarration(periode).text}\n`;
      break;
    case "similaire": {
      let best: Oeuvre | null = null;
      let bestScore = -1;
      let bestWhy: string[] = [];
      let bestDist: number | null = null;

      const baseTags = normalizeStrList(tags);
      const basePalette = paletteAvgRgb(oeuvre.palette);
      const baseType = typeof type === "string" ? type.trim() : "";

      all.forEach((cand) => {
        if (cand.id === oeuvre.id) return;
        const candTags = normalizeStrList(cand.tags);
        const candType = typeof cand.type === "string" ? cand.type.trim() : "";
        const candPalette = paletteAvgRgb(cand.palette);

        const samePeriode = cand.periode === periode;
        let score = samePeriode ? 2 : 0;
        const why: string[] = [];
        if (samePeriode) why.push(currentLang === "fr" ? "même période (+2)" : "same period (+2)");

        let common = 0;
        baseTags.forEach((tag) => {
          if (candTags.includes(tag)) common += 1;
        });
        score += common;
        if (common > 0)
          why.push(currentLang === "fr" ? `tags communs (+${common})` : `shared tags (+${common})`);

        if (baseType && candType && baseType === candType) {
          score += 1;
          why.push(currentLang === "fr" ? "même type (+1)" : "same type (+1)");
        }

        const dist = rgbDistance(basePalette, candPalette);
        if (dist !== null && dist <= 140) {
          score += 1;
          why.push(currentLang === "fr" ? "palette proche (+1)" : "close palette (+1)");
        }

        let isBetter = false;
        if (score > bestScore) {
          isBetter = true;
        } else if (score === bestScore) {
          let bestCommon = 0;
          if (best?.tags) {
            const bestTags = normalizeStrList(best.tags);
            baseTags.forEach((tag) => {
              if (bestTags.includes(tag)) bestCommon += 1;
            });
          }
          if (common > bestCommon) {
            isBetter = true;
          } else if (dist !== null && bestDist !== null && dist < bestDist) {
            isBetter = true;
          } else if (dist !== null && bestDist === null) {
            isBetter = true;
          }
        }

        if (isBetter) {
          bestScore = score;
          best = cand;
          bestWhy = why;
          bestDist = dist;
        }
      });

      if (best) {
        const bestItem: Oeuvre = best;
        const whyLine =
          bestWhy.length > 0
            ? `${currentLang === "fr" ? "Pourquoi" : "Why"} : ${bestWhy.join(", ")}.\n\n`
            : `${i18nValue("similaireWhyDefault")}\n\n`;
        text =
          `${i18nValue("similaireTitle", {
            title: bestItem.titre ?? "…",
            year: bestItem.annee ?? ""
          })}\n\n` +
          whyLine +
          `${i18nValue("similaireNext")}\n\n` +
          i18nValue("similaireTip");
      } else {
        text = i18nValue("similaireNone");
      }
      break;
    }
    case "droits":
      text =
        `${i18nValue("droitsTitle", { title: titre })}\n\n` +
        i18nValue("droitsBody") +
        (sourceLine ? `${sourceLine}\n\n` : "") +
        i18nValue("droitsExampleCcBy") +
        i18nValue("droitsExampleCcBySa") +
        i18nValue("droitsNote");
      break;
    default:
      text = i18nValue("unknownAction");
  }

  return {
    ok: true,
    title: titre,
    meta,
    tags,
    text,
    periode
  };
};

const renderMosaic = (): void => {
  const filtered = filterOeuvresByPeriode(oeuvres, periodeActive);

  legendPeriod.textContent = `${i18nValue("legendPeriodPrefix")} : ${periodeLabel(periodeActive)}`;
  legendCount.textContent = `${i18nValue("legendCountPrefix")} : ${filtered.length}`;

  const totalPages = Math.max(1, Math.ceil(filtered.length / 9));
  pageIndex = Math.min(pageIndex, totalPages - 1);

  const start = pageIndex * 9;
  const visible = filtered.slice(start, start + 9);
  mosaicPieces.innerHTML = "";

  prevPage.disabled = pageIndex <= 0;
  nextPage.disabled = pageIndex >= totalPages - 1;
  pageInfo.textContent = i18nValue("pageInfo", {
    current: totalPages === 0 ? 0 : pageIndex + 1,
    total: totalPages
  });

  visible.forEach((oeuvre, index) => {
    const slotName = SLOTS[index];
    const fragment = document.createElement("div");
    fragment.className = `piece ${slotName}`;
    fragment.tabIndex = 0;
    fragment.role = "button";
    fragment.dataset.id = oeuvre.id;
    fragment.dataset.titre = oeuvre.titre;
    fragment.dataset.meta = `${oeuvre.annee} · ${oeuvre.periode} · ${oeuvre.type}`;
    fragment.setAttribute(
      "aria-label",
      i18nValue("pieceAria", {
        title: oeuvre.titre,
        year: oeuvre.annee,
        type: oeuvre.type
      })
    );
    applyArtworkPreview(fragment, oeuvre);
    // Stratégie "safe": on n'utilise pas d'images d'oeuvres, uniquement des vignettes générées.
    fragment.setAttribute("aria-selected", oeuvre.id === selectedId ? "true" : "false");

    fragment.addEventListener("click", () => void onSelect(oeuvre.id));
    fragment.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        void onSelect(oeuvre.id);
      }
    });

    mosaicPieces.appendChild(fragment);
  });

  const stillVisible = visible.some((oeuvre) => oeuvre.id === selectedId);
  if (!stillVisible) {
    resetSelectionState();
  }

};

const callChatbot = async (action: ChatbotAction): Promise<void> => {
  lastAction = action;
  if (!selectedId) {
    statusBadge.textContent = i18nValue("statusSelectFirst");
    botText.textContent = i18nValue("botSelectFirst");
    return;
  }

  const oeuvre = oeuvres.find((o) => o.id === selectedId);
  if (!oeuvre) {
    statusBadge.textContent = i18nValue("statusDefault");
    botText.textContent = i18nValue("botNeedSelection");
    return;
  }

  const data = buildChatbotResponse(action, oeuvre, oeuvres);
  if (!data.ok) {
    statusBadge.textContent = i18nValue("statusError");
    botText.textContent = data.text ?? i18nValue("statusError");
    return;
  }

  statusBadge.textContent = i18nValue("selectionLabel", { title: data.title });
  artTitle.textContent = data.title;
  artMeta.textContent = data.meta ?? "";
  botText.textContent = data.text ?? "";
};

const onSelect = async (id: string): Promise<void> => {
  selectedId = id;
  document.body.classList.add("has-selection");
  setSelectedVisual(id);
  updateSelectedDescription(id);
  updateSelectedLinks(id);
  updateSelectedMedia(id);
  await callChatbot("intro");
};

const periodMenu = document.querySelector<HTMLDetailsElement>(".period-menu");
const timelineStations = qsa<HTMLButtonElement>(".station");
timelineStations.forEach((station) => {
  station.addEventListener("click", () => {
    timelineStations.forEach((btn) => {
      btn.classList.remove("active");
      btn.setAttribute("aria-pressed", "false");
    });

    station.classList.add("active");
    station.setAttribute("aria-pressed", "true");

    const periode = station.dataset.periode as PeriodeFilter | undefined;
    periodeActive = periode ?? "toutes";
    pageIndex = 0;
    updatePeriodCard();
    renderMosaic();
    if (periodMenu) periodMenu.open = false;
  });
});

prevPage.addEventListener("click", () => {
  pageIndex = Math.max(0, pageIndex - 1);
  renderMosaic();
});
nextPage.addEventListener("click", () => {
  pageIndex = pageIndex + 1;
  renderMosaic();
});

const actionButtons = qsa<HTMLButtonElement>(".btn");
actionButtons.forEach((btn) => {
  btn.addEventListener("click", async () => {
    const action = btn.dataset.action as ChatbotAction | undefined;
    if (!action) return;
    lastAction = action;

    if (!selectedId) {
      statusBadge.textContent = i18nValue("statusSelectFirst");
      botText.textContent = i18nValue("botSelectFirst");
      return;
    }

    await callChatbot(action);
  });
});

if (headerRoot && headerLangButtons.length) {
  headerLangButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = (btn.dataset.lang || "fr") as HeaderLang;
      setHeaderLang(lang);
    });
  });
  setHeaderLang("fr");
}

void (async function init(): Promise<void> {
  await loadOeuvres();
  applyI18nStatic();
  updatePeriodCard();
  renderMosaic();


  // Spotlight souris (effet "lumière")
  let rafId = 0;
  let lastX = 50;
  let lastY = 50;

  const commit = (): void => {
    rafId = 0;
    mosaic.style.setProperty("--x", `${lastX}%`);
    mosaic.style.setProperty("--y", `${lastY}%`);
  };

  mosaic.addEventListener("mousemove", (e: MouseEvent) => {
    const r = mosaic.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    lastX = Math.min(100, Math.max(0, x));
    lastY = Math.min(100, Math.max(0, y));
    if (!rafId) rafId = requestAnimationFrame(commit);
  });

  mosaic.addEventListener("mouseleave", () => {
    lastX = 50;
    lastY = 50;
    if (!rafId) rafId = requestAnimationFrame(commit);
  });
})();

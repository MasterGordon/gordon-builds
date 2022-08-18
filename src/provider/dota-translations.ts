import axios from "axios";

const baseURL =
  process.env.BASE_URL ||
  "https://raw.githubusercontent.com/dotabuff/d2vpkr/master";

const urls = {
  dotaTranslations: `${baseURL}/dota/resource/localization/dota_english.json`,
  abilityTranslations: `${baseURL}/dota/resource/localization/abilities_english.json`,
} as const;

const cache = new Map<string, { lang: { Tokens: Record<string, string> } }>();
let translations: Record<string, string> | undefined;
export const translator = {
  prewarm: async () => {
    const dotaTranslations =
      cache.get(urls.dotaTranslations) ??
      (await axios.get(urls.dotaTranslations)).data;
    const abilityTranslations =
      cache.get(urls.abilityTranslations) ??
      (await axios.get(urls.abilityTranslations)).data;

    cache.set(urls.dotaTranslations, dotaTranslations);
    cache.set(urls.abilityTranslations, abilityTranslations);

    translations = {
      ...dotaTranslations.lang.Tokens,
      ...abilityTranslations.lang.Tokens,
    };
  },

  translate: (token: string): string | undefined => {
    if (!translations) throw new Error("Translations not loaded");
    const result = translations[token];
    if (!result) console.warn(`Translation not found for ${token}`);
    return result;
  },

  getTranslations: () => {
    return translations;
  },
};

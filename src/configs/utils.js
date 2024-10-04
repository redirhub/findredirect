import { ALL_LOCALES } from "./constant";
import { LANGUAGES } from "./languages";

export const getSupportedLocales = () => {
    return ALL_LOCALES?.length > 0 ? LANGUAGES.filter(lang => ALL_LOCALES?.includes(lang.value)) : LANGUAGES;
}
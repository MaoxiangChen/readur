export const supportedLanguages = {
  chi_sim: '简体中文',
  chi_tra: '繁體中文',
  en: 'English',
  // es: 'Español',
  // de: 'Deutsch',
  // fr: 'Français',
} as const;

export type SupportedLanguage = keyof typeof supportedLanguages;

export const defaultLanguage: SupportedLanguage = 'chi_sim';

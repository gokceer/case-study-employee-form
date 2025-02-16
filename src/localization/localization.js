import {translations} from './translations.js';

export const localization = {
  getTranslation(key) {
    const lang = document.documentElement.lang || 'tr';
    return translations[lang][key] || key;
  },

  setLanguage(lang) {
    document.documentElement.lang = lang;
    window.dispatchEvent(new CustomEvent('language-changed', {detail: {lang}}));
  },
};

import { createContext } from 'react';
import type { Locale, Translations } from '../i18n';

export interface I18nContextValue {
  locale: Locale;
  t: Translations;
}

export const I18nContext = createContext<I18nContextValue | null>(null);

import React, { useMemo } from 'react';
import type { Locale } from '../i18n';
import { getTranslations } from '../i18n';
import { I18nContext } from './i18nContextValue';

interface I18nProviderProps {
  locale: Locale;
  children: React.ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ locale, children }) => {
  const value = useMemo(
    () => ({
      locale,
      t: getTranslations(locale),
    }),
    [locale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

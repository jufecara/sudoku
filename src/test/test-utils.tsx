import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { I18nProvider } from '../contexts/I18nContext';
import type { Locale } from '../i18n';

interface WrapperOptions {
  locale?: Locale;
}

function createWrapper({ locale = 'en' }: WrapperOptions = {}) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <I18nProvider locale={locale}>{children}</I18nProvider>;
  };
}

function renderWithProviders(ui: React.ReactElement, options?: RenderOptions & WrapperOptions) {
  const { locale, ...renderOptions } = options ?? {};
  return render(ui, { wrapper: createWrapper({ locale }), ...renderOptions });
}

export { renderWithProviders };

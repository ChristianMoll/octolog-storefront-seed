import { Locale, i18nConfig } from '@/project.config';

export const constructLocalizedUrl = (href: string, locale: Locale | undefined) => {
  if (href.startsWith('http') || href.startsWith('?') || href.startsWith('#') || !href.startsWith('/')) return href;
  // reason: scaffold renders without a [locale] route segment when project.config declares a single locale,
  // so useParams().locale is undefined; prefixing would produce "/undefined/..." for every link.
  if (!locale || i18nConfig.locales.length <= 1) return href;
  return `/${locale}${href}`;
};

type TranslationValues = Record<string, unknown>;

type TranslateFunction = (key: string, values?: TranslationValues) => string;

export function useTranslations(namespace?: string): TranslateFunction {
  return (key: string, _values?: TranslationValues): string => {
    return namespace ? `${namespace}.${key}` : key;
  };
}

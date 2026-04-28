// Stub: minimal API surface so scaffold imports resolve.
export function useCookies() {
  return {
    get: (_name: string): string | undefined => undefined,
    set: (_name: string, _value: string) => undefined,
    remove: (_name: string) => undefined,
  };
}

export function CookiesProvider({ children }: { children: React.ReactNode }) {
  return children as React.ReactElement;
}

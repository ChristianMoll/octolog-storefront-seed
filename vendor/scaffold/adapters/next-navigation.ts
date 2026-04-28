const noop = () => {};

export function useRouter() {
  return {
    push: noop as (href: string) => void,
    replace: noop as (href: string) => void,
    back: noop,
    forward: noop,
    refresh: noop,
    prefetch: noop as (href: string) => void,
  };
}

export function useParams(): Record<string, string | string[]> {
  return {};
}

export function usePathname(): string {
  return '/';
}

export function useSearchParams(): URLSearchParams {
  return new URLSearchParams();
}

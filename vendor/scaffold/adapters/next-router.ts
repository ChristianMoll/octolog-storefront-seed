const noop = () => {};

export function useRouter() {
  return {
    push: noop as (url: string) => void,
    replace: noop as (url: string) => void,
    back: noop,
    reload: noop,
    pathname: '/',
    query: {} as Record<string, string | string[] | undefined>,
    asPath: '/',
    route: '/',
    locale: 'en',
    isReady: true,
    events: {
      on: noop,
      off: noop,
      emit: noop,
    },
  };
}

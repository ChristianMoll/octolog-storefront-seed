// Stub: minimal commercetools SDK surface for scaffold compilation.

export type SDKResponse<T> = { isError: false; data: T } | { isError: true; error: Error };
export type ServerOptions = Record<string, unknown>;

export type PageResponse = {
  pageFolder?: { configuration?: Record<string, unknown> };
  data?: Record<string, unknown>;
};

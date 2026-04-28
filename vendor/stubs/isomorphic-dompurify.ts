// Stub: identity sanitize. Real DOMPurify should be used in production.
export default {
  sanitize: (input: string): string => input,
};

export function sanitize(input: string): string {
  return input;
}

import { DefaultLoaderProps } from './types';

function defaultLoader({ src, suffix }: DefaultLoaderProps) {
  if (!suffix) return src;

  const queryIndex = src.search(/[?#]/);
  const path = queryIndex === -1 ? src : src.substring(0, queryIndex);
  const tail = queryIndex === -1 ? '' : src.substring(queryIndex);

  const lastSlash = path.lastIndexOf('/');
  const lastDot = path.lastIndexOf('.');

  // Only inject the suffix when the dot is in the filename, not the hostname
  // or a query string. Otherwise URLs without a file extension (e.g. Scene7)
  // would have `-small` spliced into the host.
  if (lastDot <= lastSlash) return src;

  return `${path.substring(0, lastDot)}-${suffix}.${path.substring(lastDot + 1)}${tail}`;
}

export default defaultLoader;

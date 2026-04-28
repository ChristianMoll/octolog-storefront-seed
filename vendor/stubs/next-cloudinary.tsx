// Minimal stub so the seed builds without `next-cloudinary` installed.
// Only used by scaffold components that we don't render in the smoke-test path.
import type { ComponentProps } from 'react';

export function CldImage(props: ComponentProps<'img'>) {
  return <img {...props} />;
}

export function CldUploadWidget() {
  return null;
}

export function getCldImageUrl(opts: { src: string }): string {
  return opts.src;
}

import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  // The vendored scaffold uses CSS Modules + plain CSS imports; both are
  // supported out-of-the-box by Next.js 16, no special config needed.
};

export default config;

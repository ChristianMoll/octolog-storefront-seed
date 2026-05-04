import type { ReactNode } from 'react';
import './globals.css';
import Shell from './components/Shell';
import { listCategories } from '../lib/commercetools/queries';

export const metadata = {
  title: 'Ridgeline Supply — Outdoor Gear',
  description: 'Packs, layers, shelter, and tools for the trail.',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const categories = await listCategories().catch(() => []);

  return (
    <html lang="en">
      <body>
        <Shell categories={categories}>{children}</Shell>
      </body>
    </html>
  );
}

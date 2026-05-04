import type { ReactNode } from 'react';
import { listCategories } from '@lib/commercetools/queries';
import StoreLayout from './StoreLayout';
import './globals.css';

export const metadata = {
  title: 'Ridgeline Supply — Outdoor Gear',
  description:
    'Tents, packs, layers, and footwear for whatever the weather brings. Built to last, made to move.',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const categories = await listCategories();
  return (
    <html lang="en">
      <body>
        <StoreLayout categoryLinks={categories}>{children}</StoreLayout>
      </body>
    </html>
  );
}

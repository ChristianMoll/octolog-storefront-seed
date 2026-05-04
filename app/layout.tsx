import type { ReactNode } from 'react';
import { listCategories } from '@lib/commercetools/queries';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import './globals.css';

export const metadata = {
  title: 'Storefront',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const categories = await listCategories({ format: 'tree' });
  return (
    <html lang="en">
      <body>
        <SiteHeader categories={categories} />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

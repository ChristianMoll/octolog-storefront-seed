import type { ReactNode } from 'react';
import { listCategories } from '@lib/commercetools/queries';
import SiteShell from './SiteShell';
import './globals.css';

export const metadata = {
  title: 'Ridgeline Supply',
  description: 'Outdoor gear built for the long haul.',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const categories = await listCategories({ format: 'flat' });

  return (
    <html lang="en">
      <body className="bg-neutral-50 text-neutral-900">
        <SiteShell categories={categories}>{children}</SiteShell>
      </body>
    </html>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Footer, Header } from '@scaffold';
import type { Category } from '@/types/entity/category';

interface StoreLayoutProps {
  categoryLinks: Category[];
  initialQuery?: string;
  children: React.ReactNode;
}

const LOGO = {
  src: 'https://res.cloudinary.com/octolog/image/upload/v1700000000/ridgeline-supply-logo.png',
  width: 218,
  height: 56,
};

export default function StoreLayout({
  categoryLinks,
  initialQuery = '',
  children,
}: StoreLayoutProps) {
  const router = useRouter();
  const [headerSearch, setHeaderSearch] = useState(initialQuery);

  const goToSearch = () => {
    const q = headerSearch.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header
        variant="navigation"
        isAdmin={false}
        myAccountMenu={{
          categoryId: 'my-account',
          name: 'My Account',
          link: '#',
          paths: {},
          descendants: [],
        }}
        cartItems={0}
        cartLink={{ href: '#', name: 'Cart' }}
        accountLink={{ href: '#', name: 'Account' }}
        pageLinks={[]}
        categoryLinks={categoryLinks}
        logo={LOGO}
        logoLink={{ href: '/', name: 'Ridgeline Supply' }}
        businessUnits={[]}
        stores={[]}
        searchSuggestions={[]}
        quickOrderProducts={[]}
        searchPlaceholder="Search the trail — tents, packs, layers"
        quotes={0}
        csvDownloadLink="#"
        quickOrderSearch=""
        headerSearch={headerSearch}
        csvShowProducts={[]}
        csvShowProductsLoading={false}
        onHeaderSearch={setHeaderSearch}
        onHeaderSearchAction={goToSearch}
      />

      <main className="flex-1">{children}</main>

      <Footer
        variant="default"
        links={[
          { name: 'Shipping & Returns', href: '#' },
          { name: 'Help & Contact', href: '#' },
          { name: 'Sustainability', href: '#' },
          { name: 'About Ridgeline', href: '#' },
        ]}
        copyrightStatement="© Ridgeline Supply — gear for whatever the weather"
      />
    </div>
  );
}

'use client';

import { useState, type ReactNode } from 'react';
import { Header, Footer } from '@scaffold';
import type { Category } from '@/types/entity/category';

interface ShellProps {
  categories: Category[];
  children: ReactNode;
}

export default function Shell({ categories, children }: ShellProps) {
  const [headerSearch, setHeaderSearch] = useState('');

  const goToSearch = (q: string) => {
    if (typeof window === 'undefined') return;
    const trimmed = q.trim();
    window.location.href = trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search';
  };

  const myAccountMenu: Category = {
    categoryId: 'my-account',
    name: 'My Account',
    link: '/',
    paths: {},
    descendants: [],
  };

  return (
    <>
      <Header
        variant="navigation"
        isAdmin={false}
        myAccountMenu={myAccountMenu}
        cartItems={0}
        cartLink={{ href: '/', name: 'Cart' }}
        accountLink={{ href: '/', name: 'Account' }}
        pageLinks={[]}
        categoryLinks={categories}
        logo={{ src: '/logo.svg', width: 180, height: 40 }}
        logoLink={{ href: '/', name: 'Ridgeline Supply' }}
        businessUnits={[]}
        stores={[]}
        searchSuggestions={[]}
        quickOrderProducts={[]}
        searchPlaceholder="Search the trail — packs, tents, layers…"
        quotes={0}
        csvDownloadLink="#"
        quickOrderSearch=""
        headerSearch={headerSearch}
        csvShowProducts={[]}
        csvShowProductsLoading={false}
        onHeaderSearch={setHeaderSearch}
        onHeaderSearchAction={() => goToSearch(headerSearch)}
      />
      <main>{children}</main>
      <Footer
        variant="default"
        copyrightStatement="© Ridgeline Supply — built with care for the outdoors"
        links={[
          { name: 'About', href: '/' },
          { name: 'Returns', href: '/' },
          { name: 'Contact', href: '/' },
        ]}
      />
    </>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Header } from '@scaffold';
import type { Category } from '@/types/entity/category';

const EMPTY_CATEGORY: Category = {
  categoryId: 'account',
  name: 'Account',
  link: '/',
  paths: {},
  descendants: [],
};

export default function SiteHeader({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [headerSearch, setHeaderSearch] = useState('');

  return (
    <Header
      variant="navigation"
      isAdmin={false}
      myAccountMenu={EMPTY_CATEGORY}
      cartItems={0}
      cartLink={{ href: '/', name: 'Cart' }}
      accountLink={{ href: '/', name: 'Account' }}
      pageLinks={[]}
      categoryLinks={categories}
      logo={{ src: '/logo.svg', width: 120, height: 32 }}
      logoLink={{ href: '/', name: 'Home' }}
      businessUnits={[]}
      stores={[]}
      searchSuggestions={[]}
      quickOrderProducts={[]}
      searchPlaceholder="Search products"
      quotes={0}
      csvDownloadLink="/template.csv"
      quickOrderSearch=""
      headerSearch={headerSearch}
      csvShowProducts={[]}
      csvShowProductsLoading={false}
      onHeaderSearch={setHeaderSearch}
      onHeaderSearchAction={() => {
        const q = headerSearch.trim();
        router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
      }}
    />
  );
}

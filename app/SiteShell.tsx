'use client';

import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { Footer, Link, Search } from '@scaffold';
import type { Category } from '@/types/entity/category';

interface Props {
  categories: Category[];
  children: ReactNode;
}

export default function SiteShell({ categories, children }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const submitSearch = () => {
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      <header className="border-b border-neutral-300 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            Ridgeline Supply
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {categories.slice(0, 6).map((cat) => (
              <Link key={cat.categoryId} href={cat.link} className="text-sm text-neutral-700 hover:text-black">
                {cat.name}
              </Link>
            ))}
          </nav>
          <div className="w-72">
            <Search
              variant="sm"
              scrollControl={false}
              filterSearch={false}
              placeholder="Search the trail..."
              searchValue={query}
              handleOnChange={setQuery}
              handleSearchAction={submitSearch}
              suggestions={[]}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>

      <Footer
        variant="default"
        copyrightStatement="© Ridgeline Supply — Built for the long haul."
        links={[
          { name: 'About', href: '/' },
          { name: 'Shipping', href: '/' },
          { name: 'Contact', href: '/' },
        ]}
      />
    </>
  );
}

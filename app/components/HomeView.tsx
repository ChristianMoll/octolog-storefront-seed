'use client';

import { HeroTile, ProductTile, Button } from '@scaffold';
import type { Product } from '@/types/entity/product';

interface HomeViewProps {
  featured: Product[];
  heroImage?: string;
}

export default function HomeView({ featured, heroImage }: HomeViewProps) {
  return (
    <>
      <HeroTile
        image={{
          src:
            heroImage ??
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80&auto=format&fit=crop',
        }}
        title="Built for the next ridge."
        links={[
          { name: 'Shop the catalog', href: '/search' },
        ]}
        isPriority
        imageQuality={80}
      />

      <section className="px-4 md:px-6 lg:px-12 mt-12 mb-20">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-22 md:text-28 font-extrabold text-gray-800">Featured gear</h2>
          <a href="/search" className="hidden md:inline-block">
            <Button variant="underlined" size="fit">Shop everything</Button>
          </a>
        </div>

        {featured.length === 0 ? (
          <p className="text-gray-600">No products available right now. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {featured.map((p) => (
              <ProductTile key={p.id} item={p} variant="grid-item" />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

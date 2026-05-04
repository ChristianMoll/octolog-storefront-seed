'use client';

import { HeroTile, SectionHeader } from '@scaffold';
import type { Product } from '@/types/entity/product';
import ProductGrid from './ProductGrid';

export default function HomePage({ products }: { products: Product[] }) {
  return (
    <>
      <HeroTile
        title="Built for the long way home."
        image={{ src: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1800' }}
        links={[
          { name: 'Shop the catalog', href: '/search' },
          { name: 'New arrivals', href: '/search?q=new' },
        ]}
        isPriority
        imageQuality={75}
      />

      <section className="px-4 py-8 md:px-6 md:py-12 lg:px-12">
        <SectionHeader
          title="Featured gear"
          link={{ name: 'See all', href: '/search' }}
        />
        <div className="mt-6">
          <ProductGrid products={products} emptyMessage="No featured products yet." />
        </div>
      </section>
    </>
  );
}

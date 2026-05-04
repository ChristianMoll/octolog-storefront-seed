'use client';

import {
  Banner,
  HeroTile,
  ProductSlider,
  ProductTile,
  SectionHeader,
} from '@scaffold';
import type { Product } from '@/types/entity/product';
import type { Category } from '@/types/entity/category';

export default function HomePage({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const firstCategoryLink = categories[0]?.link ?? '/search';
  const visibleCategories = categories.slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-12">
      <HeroTile
        title="Welcome to the storefront"
        imageQuality={75}
        links={[
          { name: 'Shop the catalog', href: '/search' },
          { name: 'Browse categories', href: firstCategoryLink },
        ]}
      />

      {products.length > 0 && (
        <section>
          <ProductSlider headline="Featured products" products={products} />
        </section>
      )}

      {visibleCategories.length > 0 && (
        <section className="space-y-4">
          <SectionHeader
            title="Shop by category"
            link={{ name: 'View all', href: '/search' }}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visibleCategories.map((c) => (
              <Banner
                key={c.categoryId}
                title={c.name}
                buttonText="Shop now"
                buttonLink={{ type: 'link', link: c.link }}
                size="sm"
              />
            ))}
          </div>
        </section>
      )}

      {products.length > 0 && (
        <section className="space-y-4">
          <SectionHeader title="More to explore" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 8).map((p) => (
              <ProductTile key={p.id} item={p} variant="grid-item" />
            ))}
          </div>
        </section>
      )}

      {products.length === 0 && (
        <p className="text-neutral-600">
          No products are currently available.
        </p>
      )}
    </div>
  );
}

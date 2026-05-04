'use client';

import type { Product } from '@/types/entity/product';
import ProductGrid from '../ProductGrid';

export default function SearchPage({
  query,
  products,
}: {
  query: string;
  products: Product[];
}) {
  return (
    <section className="px-4 py-8 md:px-6 md:py-10 lg:px-12">
      <div className="mb-8">
        <h1 className="text-24 font-bold text-gray-800 md:text-28 lg:text-32">
          {query ? `Results for "${query}"` : 'Search'}
        </h1>
        {query && (
          <p className="mt-2 text-14 text-gray-600">
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
        )}
      </div>

      <ProductGrid
        products={products}
        emptyMessage={
          query
            ? `No matches for "${query}". Try a different keyword.`
            : 'Use the search bar above to find gear.'
        }
      />
    </section>
  );
}

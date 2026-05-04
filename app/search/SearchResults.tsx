'use client';

import { ProductTile } from '@scaffold';
import type { Product } from '@/types/entity/product';

export default function SearchResults({
  query,
  products,
}: {
  query: string;
  products: Product[];
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <h1 className="text-2xl font-semibold">
        {query ? `Search results for "${query}"` : 'Search'}
      </h1>

      {!query && (
        <p className="text-neutral-600">
          Enter a search term in the header to find products.
        </p>
      )}

      {query && products.length === 0 && (
        <p className="text-neutral-600">No products matched &ldquo;{query}&rdquo;.</p>
      )}

      {products.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductTile key={p.id} item={p} variant="grid-item" />
          ))}
        </div>
      )}
    </div>
  );
}

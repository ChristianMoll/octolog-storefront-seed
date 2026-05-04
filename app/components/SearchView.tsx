'use client';

import { ProductTile } from '@scaffold';
import type { Product } from '@/types/entity/product';

interface SearchViewProps {
  query: string;
  results: Product[];
  total: number;
}

export default function SearchView({ query, results, total }: SearchViewProps) {
  return (
    <section className="px-4 md:px-6 lg:px-12 mt-8 mb-20">
      <h1 className="text-22 md:text-28 font-extrabold text-gray-800 mb-2">
        {query ? `Results for “${query}”` : 'Search'}
      </h1>
      <p className="text-14 text-gray-600 mb-6">
        {query
          ? `${total} ${total === 1 ? 'item' : 'items'} found`
          : 'Try a search from the bar above to find gear.'}
      </p>

      {query && results.length === 0 ? (
        <p className="text-gray-700">No matches. Try different words or browse the categories.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {results.map((p) => (
            <ProductTile key={p.id} item={p} variant="grid-item" />
          ))}
        </div>
      )}
    </section>
  );
}

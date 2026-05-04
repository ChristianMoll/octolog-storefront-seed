import { searchProducts } from '@lib/commercetools/queries';
import ProductGrid from '../ProductGrid';

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = '' } = await searchParams;
  const query = q.trim();
  const products = query ? await searchProducts({ query, limit: 24 }) : [];

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">Search</p>
        <h1 className="text-3xl font-semibold">
          {query ? `Results for “${query}”` : 'Search the catalog'}
        </h1>
        {query && (
          <p className="text-sm text-neutral-500">
            {products.length} {products.length === 1 ? 'match' : 'matches'}
          </p>
        )}
      </header>
      {query ? (
        <ProductGrid products={products} emptyMessage={`No matches for “${query}”.`} />
      ) : (
        <p className="text-sm text-neutral-500">
          Type a query in the search bar to find gear by name, SKU, or description.
        </p>
      )}
    </div>
  );
}

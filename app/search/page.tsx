import SearchView from '../components/SearchView';
import { searchProducts } from '../../lib/commercetools/queries';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = '' } = await searchParams;
  const trimmed = q.trim();

  const { products, total } = trimmed
    ? await searchProducts(trimmed, { limit: 48 }).catch(() => ({ products: [], total: 0 }))
    : { products: [], total: 0 };

  return <SearchView query={trimmed} results={products} total={total} />;
}

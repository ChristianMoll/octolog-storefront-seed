import { searchProducts } from '@lib/commercetools/queries';
import SearchResults from './SearchResults';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = '' } = await searchParams;
  const products = q ? await searchProducts({ query: q, limit: 24 }) : [];
  return <SearchResults query={q} products={products} />;
}

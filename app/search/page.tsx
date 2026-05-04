import { searchProducts } from '@lib/commercetools/queries';
import SearchPage from './SearchPage';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = '' } = await searchParams;
  const trimmed = q.trim();
  const products = trimmed
    ? await searchProducts({ query: trimmed, limit: 24 })
    : [];
  return <SearchPage query={trimmed} products={products} />;
}

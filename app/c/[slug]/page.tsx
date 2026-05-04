import { notFound } from 'next/navigation';
import { getCategoryBySlug, listProducts } from '@lib/commercetools/queries';
import CategoryPage from './CategoryPage';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const products = await listProducts({
    categoryId: category.categoryId,
    limit: 24,
  });

  return <CategoryPage category={category} products={products} />;
}

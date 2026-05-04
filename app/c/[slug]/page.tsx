import { notFound } from 'next/navigation';
import { listCategories, listProducts } from '@lib/commercetools/queries';
import CategoryPage from './CategoryPage';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const target = `/c/${slug}`;

  const categories = await listCategories({ format: 'flat' });
  const category = categories.find((c) => c.link === target);
  if (!category) notFound();

  const products = await listProducts({ limit: 24, categoryId: category.categoryId });

  return <CategoryPage category={category} products={products} />;
}

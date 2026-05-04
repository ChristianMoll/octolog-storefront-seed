import { notFound } from 'next/navigation';
import { getProductBySlug } from '@lib/commercetools/queries';
import ProductPage from './ProductPage';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  return <ProductPage product={product} />;
}

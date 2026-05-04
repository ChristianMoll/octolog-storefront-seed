import { notFound } from 'next/navigation';
import { getProductBySlug } from '@lib/commercetools/queries';
import ProductView from './ProductView';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  return <ProductView product={product} />;
}

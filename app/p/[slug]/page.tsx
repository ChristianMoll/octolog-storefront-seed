import { notFound } from 'next/navigation';
import PDPView from '../../components/PDPView';
import { getProduct } from '../../../lib/commercetools/queries';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  return <PDPView product={product} />;
}

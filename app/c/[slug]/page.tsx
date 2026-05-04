import { notFound } from 'next/navigation';
import CategoryView from '../../components/CategoryView';
import { getCategoryBySlug, listProducts } from '../../../lib/commercetools/queries';

type LocalizedString = Record<string, string>;
function pickLocalized(value?: LocalizedString): string {
  if (!value) return '';
  return value['en-US'] ?? value['en'] ?? Object.values(value)[0] ?? '';
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const { products, total } = await listProducts({ categoryId: category.id, limit: 48 });

  return (
    <CategoryView
      title={pickLocalized(category.name) || slug}
      slug={slug}
      products={products}
      total={total}
    />
  );
}

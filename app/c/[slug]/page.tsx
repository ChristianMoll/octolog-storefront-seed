import { notFound } from 'next/navigation';
import { listCategories, listProducts } from '@lib/commercetools/queries';
import ProductGrid from '../../ProductGrid';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const categories = await listCategories({ format: 'flat' });
  const category = categories.find((c) => c.link === `/c/${slug}` || c.categoryKey === slug);
  if (!category) notFound();

  const products = await listProducts({ categoryId: category.categoryId, limit: 24 });

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">Category</p>
        <h1 className="text-3xl font-semibold">{category.name}</h1>
        <p className="text-sm text-neutral-500">
          {products.length} {products.length === 1 ? 'item' : 'items'}
        </p>
      </header>
      <ProductGrid products={products} emptyMessage="No products in this category yet." />
    </div>
  );
}

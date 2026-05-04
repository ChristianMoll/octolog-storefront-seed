'use client';

import { Breadcrumb, Link } from '@scaffold';
import type { Category } from '@/types/entity/category';
import type { Product } from '@/types/entity/product';
import ProductGrid from '../../ProductGrid';

export default function CategoryPage({
  category,
  products,
}: {
  category: Category;
  products: Product[];
}) {
  return (
    <section className="px-4 py-8 md:px-6 md:py-10 lg:px-12">
      <Breadcrumb>
        <Link href="/">Home</Link>
        <Link href={category.link}>{category.name}</Link>
      </Breadcrumb>

      <div className="mt-4 mb-8">
        <h1 className="text-24 font-bold text-gray-800 md:text-28 lg:text-32">
          {category.name}
        </h1>
        <p className="mt-2 text-14 text-gray-600">
          {products.length} {products.length === 1 ? 'product' : 'products'}
        </p>
      </div>

      <ProductGrid products={products} emptyMessage="Nothing in this category yet." />
    </section>
  );
}

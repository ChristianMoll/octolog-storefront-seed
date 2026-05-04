'use client';

import { Breadcrumb, Link as ScaffoldLink, ProductTile } from '@scaffold';
import type { Category } from '@/types/entity/category';
import type { Product } from '@/types/entity/product';

export default function CategoryPage({
  category,
  products,
}: {
  category: Category;
  products: Product[];
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <Breadcrumb>
        <ScaffoldLink href="/">Home</ScaffoldLink>
        <span>{category.name}</span>
      </Breadcrumb>

      <h1 className="text-2xl font-semibold">{category.name}</h1>

      {products.length === 0 ? (
        <p className="text-neutral-600">No products in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductTile key={p.id} item={p} variant="grid-item" />
          ))}
        </div>
      )}
    </div>
  );
}

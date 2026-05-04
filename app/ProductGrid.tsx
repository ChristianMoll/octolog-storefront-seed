'use client';

import { ProductTile } from '@scaffold';
import type { Product } from '@/types/entity/product';

export default function ProductGrid({
  products,
  emptyMessage = 'No products found.',
}: {
  products: Product[];
  emptyMessage?: string;
}) {
  if (!products || products.length === 0) {
    return (
      <p className="px-4 py-12 text-center text-14 text-gray-600 md:px-12">{emptyMessage}</p>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductTile key={p.id} item={p} variant="grid-item" />
      ))}
    </div>
  );
}

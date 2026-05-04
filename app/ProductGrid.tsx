'use client';

import { ProductTile } from '@scaffold';
import type { Product } from '@/types/entity/product';

interface Props {
  products: Product[];
  emptyMessage?: string;
}

export default function ProductGrid({ products, emptyMessage = 'No products found.' }: Props) {
  if (products.length === 0) {
    return <p className="text-sm text-neutral-500">{emptyMessage}</p>;
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((p) => (
        <ProductTile key={p.id} item={p} variant="grid-item" />
      ))}
    </div>
  );
}

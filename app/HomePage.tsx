'use client';

import { Button, Card, ProductTile } from '@scaffold';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import type { Product } from '@/types/entity/product';

export default function HomePage({ products }: { products: Product[] }) {
  const featured = products[0];
  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Storefront seed — smoke test</h1>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Buttons</h2>
        <div className="flex gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Card</h2>
        <Card icon={<ChatBubbleLeftRightIcon />} title="Quotes" summary="Manage quote requests" />
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">
          ProductTile{' '}
          <span className="text-sm text-gray-500">
            ({products.length} product{products.length === 1 ? '' : 's'} loaded from commercetools)
          </span>
        </h2>
        {featured ? (
          <div className="max-w-sm">
            <ProductTile item={featured} variant="grid-item" />
          </div>
        ) : (
          <p className="text-sm text-gray-500">No products returned.</p>
        )}
      </section>
    </main>
  );
}

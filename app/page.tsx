'use client';

// Smoke test page: imports a few scaffold components to prove the toolchain works.
// Real storefront pages should compose components from @scaffold per AGENTS.md.

import { Button, Card, ProductTile } from '@scaffold';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import type { Product } from '@/types/entity/product';

const sampleProduct: Product = {
  id: 'p-001',
  name: 'Smoke-test product',
  sku: 'SKU-001',
  description: 'Lorem ipsum dolor sit amet.',
  price: 29.95,
  currency: 'USD',
  inStock: true,
  maxQuantity: 10,
  images: ['/sb-assets/engine.png'],
};

export default function HomePage() {
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
        <h2 className="text-lg font-medium">ProductTile</h2>
        <div className="max-w-sm">
          <ProductTile item={sampleProduct} variant="grid-item" />
        </div>
      </section>
    </main>
  );
}

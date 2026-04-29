'use client';

import { HeroTile, ProductTile, Footer } from '@scaffold';
import type { Product } from '@/types/entity/product';

const heroLinks = [
  { name: 'Shop now', href: '/products' },
  { name: 'Browse categories', href: '/categories' },
];

const products: Product[] = [
  {
    id: 'p-001',
    name: 'Performance Brake Kit',
    sku: 'BRK-001',
    description: 'High-performance brake kit for daily driving and track use.',
    price: 249.0,
    currency: 'USD',
    inStock: true,
    maxQuantity: 10,
    images: ['/sb-assets/engine.png'],
  },
  {
    id: 'p-002',
    name: 'All-Season Tires (Set of 4)',
    sku: 'TYR-002',
    description: 'Reliable grip in rain, snow, and dry conditions.',
    price: 599.0,
    currency: 'USD',
    inStock: true,
    maxQuantity: 8,
    images: ['/sb-assets/car-front.png'],
  },
  {
    id: 'p-003',
    name: 'Hybrid Battery Pack',
    sku: 'BAT-003',
    description: 'OEM-grade replacement battery with 5-year warranty.',
    price: 1499.0,
    currency: 'USD',
    inStock: true,
    maxQuantity: 4,
    images: ['/sb-assets/category-banner.png'],
  },
  {
    id: 'p-004',
    name: 'Synthetic Engine Oil 5L',
    sku: 'OIL-004',
    description: 'Full-synthetic 5W-30 for modern engines.',
    price: 64.95,
    currency: 'USD',
    inStock: true,
    maxQuantity: 25,
    images: ['/sb-assets/engine.png'],
  },
  {
    id: 'p-005',
    name: 'LED Headlight Upgrade',
    sku: 'LIT-005',
    description: 'Brighter, whiter beams with plug-and-play install.',
    price: 129.0,
    currency: 'USD',
    inStock: false,
    maxQuantity: 12,
    images: ['/sb-assets/car-front.png'],
  },
];

const footerLinks = [
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Shipping', href: '/shipping' },
  { name: 'Returns', href: '/returns' },
  { name: 'Privacy', href: '/privacy' },
];

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <section className="px-4 py-6 md:px-8">
        <HeroTile
          title="Built for the road ahead"
          links={heroLinks}
          image={{ src: '/sb-assets/category-banner.png' }}
          imageQuality={75}
          isPriority
        />
      </section>

      <section className="px-4 py-10 md:px-8">
        <h2 className="mb-6 text-2xl font-semibold">Featured products</h2>
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {products.map((product) => (
            <li key={product.id}>
              <ProductTile item={product} variant="grid-item" />
            </li>
          ))}
        </ul>
      </section>

      <Footer
        variant="default"
        links={footerLinks}
        copyrightStatement="© 2026 The Storefront. Powered by commercetools."
      />
    </main>
  );
}

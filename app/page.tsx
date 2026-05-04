import { Footer, HeroTile, ProductTile } from '@scaffold';
import type { Product } from '@/types/entity/product';

const featuredProducts: Product[] = [
  {
    id: 'p-001',
    name: 'Performance Brake Kit',
    sku: 'BRK-001',
    description: 'High-performance ceramic brake pads with rotors.',
    price: 249.0,
    currency: 'USD',
    inStock: true,
    maxQuantity: 10,
    images: ['/sb-assets/engine.png'],
  },
  {
    id: 'p-002',
    name: 'Hybrid Battery Module',
    sku: 'BAT-002',
    description: 'Long-life hybrid battery replacement module.',
    price: 1299.0,
    currency: 'USD',
    inStock: true,
    maxQuantity: 5,
    images: ['/sb-assets/car-front.png'],
  },
  {
    id: 'p-003',
    name: 'All-Season Tire Set',
    sku: 'TIR-003',
    description: 'Set of four premium all-season tires.',
    price: 599.0,
    currency: 'USD',
    inStock: true,
    maxQuantity: 8,
    images: ['/sb-assets/category-banner.png'],
  },
];

export default function HomePage() {
  return (
    <main>
      <HeroTile
        title="Built for the road ahead"
        image={{ src: '/sb-assets/category-banner.png' }}
        links={[
          { name: 'Shop now', href: '/products' },
          { name: 'Browse categories', href: '/categories' },
        ]}
        isPriority
        imageQuality={75}
      />

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
        <h2 className="mb-6 text-22 font-extrabold md:text-28">Featured products</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductTile key={product.id} item={product} variant="grid-item" />
          ))}
        </div>
      </section>

      <Footer
        variant="default"
        copyrightStatement="© Powered by commercetools"
        links={[
          { name: 'About', href: '/about' },
          { name: 'Contact', href: '/contact' },
          { name: 'Privacy', href: '/privacy' },
          { name: 'Terms', href: '/terms' },
        ]}
      />
    </main>
  );
}

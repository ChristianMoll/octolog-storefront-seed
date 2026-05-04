'use client';

import { Button, Link, ProductTile } from '@scaffold';
import type { Product } from '@/types/entity/product';

interface Props {
  products: Product[];
  heroImage?: string;
}

export default function HomePage({ products, heroImage }: Props) {
  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-3xl bg-neutral-900 text-white">
        <div
          className="absolute inset-0 opacity-60"
          style={
            heroImage
              ? {
                  backgroundImage: `url(${heroImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : {
                  background:
                    'linear-gradient(135deg, #1f2937 0%, #047857 60%, #065f46 100%)',
                }
          }
        />
        <div className="relative flex flex-col gap-6 p-10 md:p-16">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">Ridgeline Supply</p>
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight md:text-6xl">
            Gear built for the long haul.
          </h1>
          <p className="max-w-xl text-base text-neutral-200">
            Tested in alpine wind, drenched in shoulder-season rain, and packed for the kind of
            mileage that puts seams to the test.
          </p>
          <div className="flex gap-3">
            <Link href="/search">
              <Button variant="primary" size="l">
                Shop the catalog
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold">Featured gear</h2>
          <Link href="/search" className="text-sm text-neutral-600 hover:text-black">
            See all →
          </Link>
        </div>
        {products.length === 0 ? (
          <p className="text-sm text-neutral-500">No products to feature yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <ProductTile key={p.id} item={p} variant="grid-item" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

'use client';

import { useState } from 'react';
import {
  Breadcrumb,
  Button,
  Gallery,
  Link,
  ProductAttributes,
  QuantityWidget,
  StockIndicator,
} from '@scaffold';
import type { Product } from '@/types/entity/product';

function formatPrice(amount?: number, currency?: string) {
  if (amount == null) return '';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency ?? 'USD',
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency ?? ''}`.trim();
  }
}

export default function ProductPage({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const images = product.images && product.images.length > 0 ? product.images : [];
  const category = product.categories?.[0];
  const isDiscounted =
    product.discountedPrice != null &&
    product.price != null &&
    product.discountedPrice < product.price;

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <article className="px-4 py-6 md:px-6 md:py-8 lg:px-12">
      <Breadcrumb>
        <Link href="/">Home</Link>
        {category ? <Link href={category.link}>{category.name}</Link> : <span />}
        <span className="text-gray-700">{product.name}</span>
      </Breadcrumb>

      <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-8">
          {images.length > 0 ? (
            <Gallery images={images} />
          ) : (
            <div className="flex h-[486px] w-full items-center justify-center bg-neutral-200 text-14 text-gray-600">
              No image available
            </div>
          )}
        </div>

        <aside className="space-y-6 lg:col-span-4">
          <header className="space-y-2">
            <h1 className="text-22 font-bold text-gray-800 md:text-28">{product.name}</h1>
            {product.sku && (
              <p className="text-12 uppercase tracking-wide text-gray-600">
                SKU {product.sku}
              </p>
            )}
            <StockIndicator
              inStock={product.inStock}
              restockableInDays={product.restockableInDays}
            />
          </header>

          <div className="flex items-baseline gap-3">
            {isDiscounted ? (
              <>
                <span className="text-24 font-bold text-red-500">
                  {formatPrice(product.discountedPrice, product.currency)}
                </span>
                <span className="text-16 text-gray-600 line-through">
                  {formatPrice(product.price, product.currency)}
                </span>
              </>
            ) : (
              <span className="text-24 font-semibold text-gray-800">
                {formatPrice(product.price, product.currency)}
              </span>
            )}
          </div>

          {product.description && (
            <p className="text-14 leading-relaxed text-gray-700">{product.description}</p>
          )}

          <div className="space-y-3 border-t border-neutral-400 pt-6">
            <QuantityWidget
              value={quantity}
              onChange={setQuantity}
              minValue={1}
              maxValue={product.maxQuantity ?? 99}
              disabled={!product.inStock}
            />
            <Button
              variant="primary"
              size="full"
              onClick={handleAddToCart}
              added={added}
              disabled={!product.inStock}
            >
              {added ? 'Added to cart' : 'Add to cart'}
            </Button>
          </div>

          {product.specifications && product.specifications.length > 0 && (
            <section className="space-y-3 border-t border-neutral-400 pt-6">
              <h2 className="text-16 font-semibold text-gray-800">Specifications</h2>
              <ProductAttributes
                className="grid gap-1"
                attributes={product.specifications.filter((a) => !!a.value)}
              />
            </section>
          )}
        </aside>
      </div>
    </article>
  );
}

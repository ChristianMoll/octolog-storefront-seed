'use client';

import { useState } from 'react';
import { Button, Gallery, ProductAttributes, StockIndicator, QuantityWidget } from '@scaffold';
import type { Product } from '@/types/entity/product';

interface Props {
  product: Product;
}

function formatPrice(price: number | undefined, currency: string | undefined) {
  if (price == null) return '—';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency ?? 'USD',
    }).format(price);
  } catch {
    return `${currency ?? '$'} ${price.toFixed(2)}`;
  }
}

export default function ProductView({ product }: Props) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const images = product.images?.length ? product.images : [];
  const displayPrice = product.discountedPrice ?? product.price;

  const handleAdd = () => {
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      <div className="overflow-hidden rounded-2xl bg-white">
        {images.length > 0 ? (
          <Gallery images={images} />
        ) : (
          <div className="flex aspect-square items-center justify-center text-sm text-neutral-400">
            No image
          </div>
        )}
      </div>

      <div className="flex flex-col gap-5">
        <div className="space-y-2">
          {product.categories?.[0]?.name && (
            <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
              {product.categories[0].name}
            </p>
          )}
          <h1 className="text-3xl font-semibold leading-tight">{product.name}</h1>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-semibold">
            {formatPrice(displayPrice, product.currency)}
          </span>
          {product.discountedPrice != null && product.price != null && (
            <span className="text-sm text-neutral-500 line-through">
              {formatPrice(product.price, product.currency)}
            </span>
          )}
        </div>

        <StockIndicator inStock={product.inStock ?? true} />

        {product.description && (
          <p className="text-sm leading-relaxed text-neutral-700">{product.description}</p>
        )}

        <div className="flex items-end gap-3 pt-2">
          <QuantityWidget
            showLabel
            value={qty}
            minValue={1}
            maxValue={product.maxQuantity ?? 99}
            onChange={setQty}
          />
          <Button variant="primary" size="l" onClick={handleAdd} added={added}>
            Add to cart
          </Button>
        </div>

        {product.specifications && product.specifications.length > 0 && (
          <div className="border-t border-neutral-200 pt-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-700">
              Specifications
            </h2>
            <ProductAttributes attributes={product.specifications} />
          </div>
        )}
      </div>
    </div>
  );
}

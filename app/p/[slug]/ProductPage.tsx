'use client';

import { Breadcrumb, Link as ScaffoldLink, ProductDetails } from '@scaffold';
import type { Product } from '@/types/entity/product';

export default function ProductPage({ product }: { product: Product }) {
  const category = product.categories?.[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <Breadcrumb>
        <ScaffoldLink href="/">Home</ScaffoldLink>
        {category && <ScaffoldLink href={category.link}>{category.name}</ScaffoldLink>}
        <span>{product.name}</span>
      </Breadcrumb>

      <ProductDetails
        product={product}
        description={product.description}
        specifications={product.specifications}
        addToCart={async () => {}}
        shippingMethods={[]}
        currentColor={{ label: '', value: '' }}
        currentSpecs={{ label: '', value: '' }}
        getWishlists={async () => []}
        addToWishlists={async () => []}
        removeFromWishlists={async () => []}
        addToNewWishlist={async () => null}
        onChangeVariant={() => {}}
      />
    </div>
  );
}

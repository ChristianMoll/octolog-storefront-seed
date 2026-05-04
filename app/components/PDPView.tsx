'use client';

import { ProductDetails } from '@scaffold';
import type { Product } from '@/types/entity/product';

interface PDPViewProps {
  product: Product;
}

export default function PDPView({ product }: PDPViewProps) {
  return (
    <ProductDetails
      product={product}
      description={product.description}
      specifications={product.specifications}
      currentColor={{ label: '', value: '' }}
      currentSpecs={{ label: '', value: '' }}
      shippingMethods={[
        { label: 'Standard ground', description: 'Arrives in 3–5 business days', price: 0, estimatedDeliveryDays: 5 },
        { label: 'Expedited', description: 'Arrives in 2 business days', price: 1500, estimatedDeliveryDays: 2 },
      ]}
      addToCart={async () => {}}
      getWishlists={async () => []}
      addToWishlists={async () => []}
      removeFromWishlists={async () => []}
      addToNewWishlist={async () => null}
      onChangeVariant={() => {}}
    />
  );
}

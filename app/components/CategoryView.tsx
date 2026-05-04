'use client';

import { ProductList } from '@scaffold';
import type { Product } from '@/types/entity/product';

interface CategoryViewProps {
  title: string;
  slug: string;
  products: Product[];
  total: number;
}

export default function CategoryView({ title, slug, products, total }: CategoryViewProps) {
  return (
    <ProductList
      title={title}
      products={products}
      facets={[]}
      breadcrumb={[
        { name: 'Home', link: '/' },
        { name: title, link: `/c/${slug}` },
      ]}
      currentSortValue="featured"
      currentSortVector="asc"
      sortValues={[
        { name: 'Featured', value: 'featured', vector: 'asc' },
        { name: 'Price: low to high', value: 'price', vector: 'asc' },
        { name: 'Price: high to low', value: 'price', vector: 'desc' },
        { name: 'Name', value: 'name', vector: 'asc' },
      ]}
      limit={products.length}
      total={total}
      onRefine={() => {}}
      onResetAll={() => {}}
      onSortValueChange={() => {}}
      onLoadMore={() => {}}
      onAddToCart={async () => {}}
    />
  );
}

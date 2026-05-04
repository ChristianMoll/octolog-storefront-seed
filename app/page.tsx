import { listCategories, listProducts } from '@lib/commercetools/queries';
import HomePage from './HomePage';

export default async function Page() {
  const [products, categories] = await Promise.all([
    listProducts({ limit: 12 }),
    listCategories({ format: 'flat' }),
  ]);
  return <HomePage products={products} categories={categories} />;
}

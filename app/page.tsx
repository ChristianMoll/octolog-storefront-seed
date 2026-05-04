import { listProducts } from '@lib/commercetools/queries';
import HomePage from './HomePage';

export default async function Page() {
  const products = await listProducts({ limit: 8 });
  return <HomePage products={products} />;
}

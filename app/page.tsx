import HomeView from './components/HomeView';
import { listProducts } from '../lib/commercetools/queries';

export default async function HomePage() {
  const { products } = await listProducts({ limit: 8 }).catch(() => ({ products: [], total: 0 }));
  return <HomeView featured={products} />;
}

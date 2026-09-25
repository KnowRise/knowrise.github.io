import Home from '../src/views/Home';
import { guardMenu } from '../src/lib/menu-guard';

export default async function Page() {
  await guardMenu('home');
  return <Home />;
}
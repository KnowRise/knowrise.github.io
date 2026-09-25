import Hki from '../../src/views/Hki';
import { guardMenu } from '../../src/lib/menu-guard';

export default async function Page() {
  await guardMenu('hki');
  return <Hki />;
}
import { accountSeed } from './account';
import { userSeed } from './user';

export async function baseTestpack1Seed() {
  await userSeed();
  await accountSeed();
}

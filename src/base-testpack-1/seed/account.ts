import { db } from '~/lib/drizzle/db';
import { account } from '../../base-config/drizzle/index';
import values from './account.json';

export async function accountSeed() {
  await db
    .insert(account)
    .values(values)
    .onConflictDoUpdate({
      set: { updatedAt: new Date() },
      target: account.id,
    });
}

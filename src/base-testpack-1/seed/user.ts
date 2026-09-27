import { db } from '~/lib/drizzle/db';
import { user } from '../../base-config/drizzle/index';
import values from './user.json';

export async function userSeed() {
  await db
    .insert(user)
    .values(values)
    .onConflictDoUpdate({
      set: { updatedAt: new Date() },
      target: user.id,
    });
}

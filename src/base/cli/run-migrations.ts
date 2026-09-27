import { resolve } from 'node:path';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { seed } from '~/base-config/seed';
import { delay } from '../../base/utils/delay';
import { db } from '../../lib/drizzle/db';

async function index() {
  await delay(2000);

  const isProduction = process.env.NODE_ENV === 'production';

  const migrationsFolder = resolve(isProduction ? '../drizzle/' : './drizzle/');
  const migrationConfig = {
    migrationsFolder,
  };

  console.log(`[🎬] Migrations starting using [${migrationsFolder}] ...`);

  await migrate(db, migrationConfig);

  console.log('[🎬] Migration complete, started seeding ...');

  await seed();

  console.log('[🏁] Seeding complete.');

  process.exit(0);
}

await index();

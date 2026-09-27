import { resolve } from 'node:path';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { definePlugin } from 'nitro';
import { seed } from '~/base-config/seed';
import { db } from '../../lib/drizzle/db';

export default definePlugin(async (_nitroApp) => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    console.log(
      `[🚀] Starting ${process.env.npm_package_name}:${process.env.npm_package_version} in ${isProduction ? '🏭  Production' : '🏗️  Development'} at ${new Date().toISOString()}.`
    );

    const enabledDatabaseAutomaticMigrations = process.env.DATABASE_AUTOMATIC_MIGRATIONS === 'enabled';
    if (enabledDatabaseAutomaticMigrations) {
      const migrationsFolder = resolve(isProduction ? '../drizzle/' : './drizzle/');
      const migrationConfig = {
        migrationsFolder,
      };

      console.log(`[🎬] Migrations starting using [${migrationsFolder}] ...`);

      await migrate(db, migrationConfig);

      console.log('[🎬] Migration complete, started seeding ...');

      await seed();

      console.log('[🏁] Seeding complete.');
    } else {
      console.log('[❗] Automatic migrations disabled!');
    }
  } catch (err) {
    console.error('[🚨] Migration or seeding failed! Error: ', err);
  }
});

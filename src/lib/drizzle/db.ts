import { createServerOnlyFn } from '@tanstack/react-start';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '~/lib/env.server';
// biome-ignore lint/performance/noNamespaceImport: Allow
import * as schema from '../../base-config/drizzle';

const driver = postgres(env.DATABASE_URL);

const getDatabase = createServerOnlyFn(() => drizzle({ casing: 'snake_case', client: driver, schema }));

export const db = getDatabase();

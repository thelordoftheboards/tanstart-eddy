import type { Config } from 'drizzle-kit';
import { env } from '~/lib/env.server';

const node_env = process.env.NODE_ENV || 'development';

export default {
  breakpoints: true,
  casing: 'snake_case',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  dialect: 'postgresql',
  out: './drizzle',
  schema: './src/lib/drizzle/index.ts',
  // In order to facilitate AI agenets, in development it is best to skip confirmations
  strict: node_env === 'production',
  verbose: true,
} satisfies Config;

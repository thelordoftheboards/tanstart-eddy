import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';
import { envServerParts } from '../base-config/lib/env-server-all-parts';

//

export const env = createEnv({
  runtimeEnv: process.env,
  server: {
    BETTER_AUTH_SECRET: z.string().min(1),
    DATABASE_URL: z.url(),

    // OAuth2 providers, optional, update as needed
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    SERVER_URL: z.url().default('http://localhost:8088'),

    ...envServerParts,
  },
});

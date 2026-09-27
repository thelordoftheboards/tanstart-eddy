import { createServerOnlyFn } from '@tanstack/react-start';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { type BetterAuthOptions, betterAuth } from 'better-auth/minimal';
import { admin, openAPI } from 'better-auth/plugins';
import { tanstackStartCookies } from 'better-auth/tanstack-start';
import { v7 as uuidv7 } from 'uuid';
import { sendResetPassword, sendVerificationEmail } from '~/base-nav-and-auth/server/better-auth-send';
import { ac, roles } from '~/base-nav-and-auth-config/lib/auth/permissions';
// biome-ignore lint/performance/noNamespaceImport: Allow
import * as schema from '~/lib/drizzle/auth';
import { db } from '~/lib/drizzle/db';
import { databaseHooks } from '../../base-nav-and-auth/server/better-auth-database-hooks';
import { organizationPlugin } from '../../base-nav-and-auth/server/better-auth-plugin-organization';
import { env } from '../../lib/env.server';

const authConfig = {
  advanced: {
    database: {
      // https://www.better-auth.com/docs/concepts/database#option-1-let-database-generate-ids
      generateId: () => uuidv7(),
      // https://www.better-auth.com/docs/adapters/drizzle#joins-experimental
      joins: true,
    },
  },
  baseURL: env.SERVER_URL,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),

  databaseHooks,

  // https://www.better-auth.com/docs/authentication/email-password
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword,
  },

  emailVerification: {
    sendVerificationEmail,
  },

  logger: {
    disabled: false,
    level: 'info',
  },

  // https://www.better-auth.com/docs/integrations/tanstack#usage-tips
  plugins: [
    openAPI(),

    admin({
      ac,
      adminRoles: ['admin', 'superadmin'],
      defaultRole: 'user',
      roles: {
        admin: roles.admin,
        superadmin: roles.superadmin,
        user: roles.user,
      },
    }),

    organizationPlugin,

    // TODO // Configure emailOTP plugin - Send verification email
    // emailOTP({
    //   async sendVerificationOTP({ email, otp }) {
    //     await sendEmail({
    //       subject: 'Verify your email',
    //       template: SendVerificationOTP({
    //         username: email,
    //         otp,
    //       }),
    //       to: email,
    //     });
    //   },
    // }),

    tanstackStartCookies(), // make sure this is the last plugin in the array
  ],

  // TODO // Add specific cloud flare settings if needed, rate limits for individual pages
  rateLimit: {
    enabled: true,
    max: 100,
    window: 10,
  },

  secret: env.BETTER_AUTH_SECRET,

  // https://www.better-auth.com/docs/concepts/session-management#session-caching
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  // https://www.better-auth.com/docs/concepts/oauth
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID ?? '',
      clientSecret: env.GITHUB_CLIENT_SECRET ?? '',
      enabled: env.GITHUB_CLIENT_ID !== null && env.GITHUB_CLIENT_SECRET !== null,
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: env.GOOGLE_CLIENT_SECRET ?? '',
      enabled: env.GOOGLE_CLIENT_ID !== null && env.GOOGLE_CLIENT_SECRET !== null,
    },
  },

  // https://www.better-auth.com/docs/reference/telemetry
  telemetry: {
    enabled: false,
  },
  trustedOrigins: [env.SERVER_URL],
} satisfies BetterAuthOptions;

const getAuthConfig = createServerOnlyFn(() => betterAuth(authConfig));

export const auth = getAuthConfig() as ReturnType<typeof betterAuth<typeof authConfig>>;

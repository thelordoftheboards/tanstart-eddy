import { createServerOnlyFn } from '@tanstack/react-start';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { type BetterAuthOptions, betterAuth } from 'better-auth/minimal';
import { admin, openAPI, organization } from 'better-auth/plugins';
import { tanstackStartCookies } from 'better-auth/tanstack-start';
import { v7 as uuidv7 } from 'uuid';
import { ac, roles } from '~/base-nav-and-auth-config/lib/auth/permissions';
import { db } from '~/lib/db';
// biome-ignore lint/performance/noNamespaceImport: Allow
import * as schema from '~/lib/db/schema/auth.schema';
import { env } from '~/lib/env.server';

const authConfig = {
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),

  advanced: {
    database: {
      // https://www.better-auth.com/docs/concepts/database#option-1-let-database-generate-ids
      generateId: () => uuidv7(),
    },
  },

  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.SERVER_URL,
  trustedOrigins: [env.SERVER_URL],

  // https://www.better-auth.com/docs/reference/telemetry
  telemetry: {
    enabled: false,
  },

  // TODO // Add specific cloud flare settings if needed, rate limits for individual pages
  rateLimit: {
    enabled: true,
    max: 100,
    window: 10,
  },

  logger: {
    disabled: false,
    level: 'info',
  },

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
      enabled: env.GITHUB_CLIENT_ID !== null && env.GITHUB_CLIENT_SECRET !== null,
      clientId: env.GITHUB_CLIENT_ID ?? '',
      clientSecret: env.GITHUB_CLIENT_SECRET ?? '',
    },
    google: {
      enabled: env.GOOGLE_CLIENT_ID !== null && env.GOOGLE_CLIENT_SECRET !== null,
      clientId: env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: env.GOOGLE_CLIENT_SECRET ?? '',
    },
  },

  // https://www.better-auth.com/docs/authentication/email-password
  emailAndPassword: {
    enabled: true,
  },

  experimental: {
    // https://www.better-auth.com/docs/adapters/drizzle#joins-experimental
    joins: true,
  },

  // https://www.better-auth.com/docs/integrations/tanstack#usage-tips
  plugins: [
    openAPI(),

    admin({
      defaultRole: 'user',
      adminRoles: ['admin', 'superadmin'],
      ac,
      roles: {
        user: roles.user,
        admin: roles.admin,
        superadmin: roles.superadmin,
      },
    }),

    organization({
      // TODO // Implement sending invitation email
      // async sendInvitationEmail({ role, email, organization: theOrganization, invitation }) {
      //   const url = `${env.SERVER_URL}/accept-invitation/${invitation.id}`;
      //   await sendEmail({
      //     subject: `Invitation to join ${organization.name}`,
      //     template: SendOrganizationInvitation({
      //       email,
      //       organization_name: theOrganization.name,
      //       url,
      //       role,
      //     }),
      //     to: email,
      //   });
      // },
      // async onInvitationAccepted(data) {
      //   // Handle post-acceptance logic here
      // },
    }),

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

  /*
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const member = (
            await db
              .select()
              .from(schema.member)
              .where(eq(schema.member.userId, session.userId ?? ''))
              .limit(1)
          )[0];

          return {
            data: {
              ...session,
              ...(member?.organizationId && {
                activeOrganizationId: member?.organizationId,
              }),
            },
          };
        },
      },
    },
    user: {
      create: {
        after: async (user) => {
          await sendEmail({
            subject: 'Welcome to XXXXX',
            template: WelcomeEmail({
              username: user.name || user.email,
            }),
            to: user.email,
          });
        },
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    async sendResetPassword({ url, user }) {
      await sendEmail({
        subject: 'Reset your password',
        template: ResetPasswordEmail({
          resetLink: url,
          username: user.email,
        }),
        to: user.email,
      });
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ url, user }) => {
      await sendEmail({
        subject: 'Verify your email',
        template: VerifyEmail({
          url,
          username: user.email,
        }),
        to: user.email,
      });
    },
  },
  */
} satisfies BetterAuthOptions;

const getAuthConfig = createServerOnlyFn(() => betterAuth(authConfig));

export const auth = getAuthConfig() as ReturnType<typeof betterAuth<typeof authConfig>>;

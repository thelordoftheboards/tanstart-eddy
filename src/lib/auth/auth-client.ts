import { adminClient, multiSessionClient, organizationClient, twoFactorClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { getBaseUrl } from '~/base/utils/get-base-url';
import { ac, roles } from '~/base-nav-and-auth-config/lib/auth/permissions';

export const authClient = createAuthClient({
  baseURL: getBaseUrl(), // Replaces the traditional env.VITE_SERVER_URL

  plugins: [
    twoFactorClient(),

    adminClient({
      ac,
      roles,
    }),

    organizationClient(),

    // TODO // Configure emailOTP plugin - Send verification email
    //emailOTPClient(),

    // TODO // Configure magic link client for auth
    //  magicLinkClient(),

    multiSessionClient(),
  ],
});

export type AuthClient = ReturnType<typeof createAuthClient>;

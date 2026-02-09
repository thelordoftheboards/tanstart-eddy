import { type BetterAuthOptions } from 'better-auth/minimal';
import { eq } from 'drizzle-orm';
import { sendEmail } from '~/base-email/server/send-emai';
import {
  emailFromForSystemEmails,
  serviceHumanReadableName,
} from '~/base-nav-and-auth-config/server/organization-info';
import { db } from '~/lib/db';
// biome-ignore lint/performance/noNamespaceImport: Allow
import * as schema from '~/lib/db/schema/auth.schema';
import { generateWelcome } from './email/welcome';

export const databaseHooks: BetterAuthOptions['databaseHooks'] = {
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
        sendEmail({
          from: emailFromForSystemEmails,
          to: user.email,
          subject: `Welcome to ${serviceHumanReadableName}`,
          ...(await generateWelcome(user.email)),
        });
      },
    },
  },
};

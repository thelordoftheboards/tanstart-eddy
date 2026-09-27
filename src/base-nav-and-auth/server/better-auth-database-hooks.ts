import { type BetterAuthOptions } from 'better-auth/minimal';
import { eq } from 'drizzle-orm';
import { serviceHumanReadableName } from '~/base-config/server/organization-info';
import { emailFromForSystemEmails } from '~/base-nav-and-auth-config/server/organization-info';
// biome-ignore lint/performance/noNamespaceImport: Allow
import * as schema from '~/lib/drizzle/auth';
import { db } from '~/lib/drizzle/db';
import { sendEmail } from '../../base-email/server/send-emai';
import { generateWelcome } from './email/welcome';

export const databaseHooks: BetterAuthOptions['databaseHooks'] = {
  session: {
    create: {
      before: async (session) => {
        const [member] = await db
          .select()
          .from(schema.member)
          .where(eq(schema.member.userId, session.userId ?? ''))
          .limit(1);

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
          subject: `Welcome to ${serviceHumanReadableName}`,
          to: user.email,
          ...(await generateWelcome(user.email)),
        });
      },
    },
  },
};

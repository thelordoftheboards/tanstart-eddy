import { organization } from 'better-auth/plugins';
import { sendEmail } from '~/base-email/server/send-emai';
import { emailFromForSystemEmails } from '~/base-nav-and-auth-config/server/organization-info';
import { env } from '~/lib/env.server';
import { generateOrganizationInvitation } from './email/organization-invitation';

export const organizationPlugin = organization({
  async sendInvitationEmail({ role, email, organization: theOrganization, invitation }) {
    const url = `${env.SERVER_URL}/accept-invitation/${invitation.id}`;
    sendEmail({
      from: emailFromForSystemEmails,
      to: email,
      subject: `Invitation to join ${organization.name}`,
      ...(await generateOrganizationInvitation({
        email,
        organization_name: theOrganization.name,
        url,
        role,
      })),
    });
  },
  // async onInvitationAccepted(data) {
  //   // Handle post-acceptance logic here
  // },
});

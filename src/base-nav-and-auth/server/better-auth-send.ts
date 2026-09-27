import { type User } from 'better-auth';
import { emailFromForSystemEmails } from '~/base-nav-and-auth-config/server/organization-info';
import { sendEmail } from '../../base-email/server/send-emai';
import { generateResetPassword } from './email/reset-password';
import { generateVerifyEmail } from './email/verify-email';

export async function sendResetPassword({ url, user }: { url: string; user: User }) {
  sendEmail({
    from: emailFromForSystemEmails,
    subject: 'Reset your password',
    to: user.email,
    ...(await generateResetPassword({
      resetLink: url,
      username: user.email,
    })),
  });
}

export async function sendVerificationEmail({ url, user }: { url: string; user: User }) {
  sendEmail({
    from: emailFromForSystemEmails,
    subject: 'Verify your email',
    to: user.email,
    ...(await generateVerifyEmail({
      url,
      username: user.email,
    })),
  });
}

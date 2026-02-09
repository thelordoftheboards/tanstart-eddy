import { type User } from 'better-auth';
import { sendEmail } from '~/base-email/server/send-emai';
import { emailFromForSystemEmails } from '~/base-nav-and-auth-config/server/organization-info';
import { generateResetPassword } from './email/reset-password';
import { generateVerifyEmail } from './email/verify-email';

export async function sendResetPassword({ url, user }: { url: string; user: User }) {
  sendEmail({
    from: emailFromForSystemEmails,
    to: user.email,
    subject: 'Reset your password',
    ...(await generateResetPassword({
      resetLink: url,
      username: user.email,
    })),
  });
}

export async function sendVerificationEmail({ url, user }: { url: string; user: User }) {
  sendEmail({
    from: emailFromForSystemEmails,
    to: user.email,
    subject: 'Verify your email',
    ...(await generateVerifyEmail({
      url,
      username: user.email,
    })),
  });
}

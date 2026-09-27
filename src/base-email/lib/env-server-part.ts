import { z } from 'zod';

export const envServerPartBaseEmail = {
  EMAIL_DISABLED: z.coerce.boolean().optional(),
  // Configuration for Resend (from https://resend.com/api-keys, https://resend.com/webhooks)
  RESEND_API_KEY: z.string(),
  RESEND_WEBHOOK_EMAIL_RECEIVED_SIGNING_SECRET: z.string(),
};

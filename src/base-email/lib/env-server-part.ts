import { z } from 'zod';

export const envServerPartBaseEmail = {
  // Configuration for Resend (from https://resend.com/api-keys)
  RESEND_API_KEY: z.string(),
};

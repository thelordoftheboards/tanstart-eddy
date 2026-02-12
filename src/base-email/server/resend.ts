import { Resend } from 'resend';
import { env } from '~/lib/env.server';

// Global object with API key
export const resend = new Resend(env.RESEND_API_KEY);

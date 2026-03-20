import retry from 'async-retry';
import { type CreateEmailOptions, type CreateEmailResponse } from 'resend';
import { env } from '~/lib/env.server';
import { resend } from './resend';

/**
 * Sends an email using Resend with exponential backoff retries.
 * If EMAIL_DISABLED is true does not send but rather logs to console.
 */
export async function sendEmail(payload: CreateEmailOptions): Promise<CreateEmailResponse['data']> {
  if (env.EMAIL_DISABLED) {
    console.info('sendEmail, EMAIL_DISABLED=true, payload:', payload);
    return {
      id: '11111111-1111-1111-1111-111111111111',
    };
  }

  // TODO // Look into clarifying the type for async-retry sendEmail
  // @ts-expect-error Type [void | CreateEmailResponseSuccess] is not assignable to type [CreateEmailResponseSuccess | null]
  return await retry(
    async (bail) => {
      // resend.emails.send returns a Promise<{ data: any; error: any }>
      const { data, error } = await resend.emails.send(payload);

      if (error) {
        // Stop retrying (bail) if it's a 4xx Client Error (e.g., invalid API key, bad email format)
        // biome-ignore lint/suspicious/noExplicitAny: Resend's error object often includes a 'name' or 'message'
        const statusCode = (error as any).status;

        if (statusCode >= 400 && statusCode < 500) {
          console.error(`[Resend] Permanent error: ${error.message}`);
          return bail(new Error(error.message));
        }

        // For 5xx errors or Rate Limits (429), throw to trigger a retry
        throw new Error(error.message);
      }

      return data;
    },
    {
      retries: 5,
      minTimeout: 8000, // Wait 8s, then 16s, then 32s...
      onRetry: (err, attempt) => {
        console.warn(`[Resend] Attempt ${attempt} failed: ${err}. Retrying...`);
      },
    }
  );
}

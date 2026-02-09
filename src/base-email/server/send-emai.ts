import retry from 'async-retry';
import type { CreateEmailOptions, CreateEmailResponse } from 'resend';
import { Resend } from 'resend';
import { env } from '~/lib/env.server';

// Global object with API key
const resend = new Resend(env.RESEND_API_KEY);

/**
 * Sends an email using Resend with exponential backoff retries.
 */
export async function sendEmail(payload: CreateEmailOptions): Promise<CreateEmailResponse['data']> {
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

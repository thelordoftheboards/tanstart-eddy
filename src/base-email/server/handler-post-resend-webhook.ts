import { eq } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import { OuterError } from '~/base/utils/outer-error';
import { db } from '~/lib/db';
import { env } from '~/lib/env.server';
import { receivedEmailTable } from '../db/received-email';
import {
  type WebhookPayloadEmailReceivedType,
  webhookPayloadEmailReceivedSchema,
} from '../schema/webhook-payload-email-received';
import { resend } from './resend';

/**
 * A webhook handler for POST requests from resend for when a new email is received
 * as per https://resend.com/blog/inbound-emails
 */
export async function handlerPostServiceRequestByCustomer({ request }: { request: Request }) {
  const requestDataText = await request.text();

  try {
    // Verify webhook per https://resend.com/docs/webhooks/verify-webhooks-requests
    // Throws an error if the webhook is invalid
    // Otherwise, returns the parsed payload object
    resend.webhooks.verify({
      payload: requestDataText,
      headers: {
        // @ts-expect-error The item should be present in header as per documentation
        id: request.headers['svix-id'],
        // @ts-expect-error The item should be present in header as per documentation
        timestamp: request.headers['svix-timestamp'],
        // @ts-expect-error The item should be present in header as per documentation
        signature: request.headers['svix-signature'],
      },
      webhookSecret: env.RESEND_WEBHOOK_EMAIL_RECEIVED_SIGNING_SECRET,
    });
  } catch (err) {
    console.error('handlerPostServiceRequestByCustomer failed at resend.webhooks.verify');
    console.error(err);
  }

  const requestData = JSON.parse(requestDataText);
  const parsedData: WebhookPayloadEmailReceivedType = webhookPayloadEmailReceivedSchema.parse(requestData);

  const id = uuidv7();
  const dtNow = new Date();

  await db.insert(receivedEmailTable).values({
    id,
    from: parsedData.data.from,
    emailId: parsedData.data.email_id,
    webhookPayloadEmailReceivedJson: JSON.stringify(requestData),
    processingStatus: 10,
    receivedOn: dtNow,
  });

  // Process the rest asynchronously
  setTimeout(async () => {
    // Proceeed to retrieve the emal content
    // https://resend.com/docs/api-reference/emails/retrieve-received-email
    const { data, error } = await resend.emails.receiving.get(parsedData.data.email_id);

    if (error) {
      await db.update(receivedEmailTable).set({ processingStatus: 20 }).where(eq(receivedEmailTable.id, id));

      throw new OuterError('Failed retrieving email contents from resend', error);
    }

    await db
      .update(receivedEmailTable)
      .set({
        contentJson: JSON.stringify(data),
        processingStatus: 100,
      })
      .where(eq(receivedEmailTable.id, id));
  });

  return new Response('', { status: 200 });
}

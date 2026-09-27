import { z } from 'zod';

export const webhookPayloadEmailReceivedSchema = z.object({
  created_at: z.iso.datetime(),
  data: z.object({
    email_id: z.string(),
    from: z.string(),
  }),
  type: z.literal('email.received'),
});

export type WebhookPayloadEmailReceivedType = z.infer<typeof webhookPayloadEmailReceivedSchema>;

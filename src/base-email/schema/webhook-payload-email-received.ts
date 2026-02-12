import { z } from 'zod';

export const webhookPayloadEmailReceivedSchema = z.object({
  type: z.literal('email.received'),
  created_at: z.iso.datetime(),
  data: z.object({
    email_id: z.string(),
    from: z.string(),
  }),
});

export type WebhookPayloadEmailReceivedType = z.infer<typeof webhookPayloadEmailReceivedSchema>;

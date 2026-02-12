import { index, integer, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { v7 as uuidv7 } from 'uuid';

export const receivedEmailTable = pgTable(
  'base_email_received_email',
  {
    id: uuid('id')
      .$defaultFn(() => uuidv7())
      .primaryKey(),
    from: text('from').notNull(),
    emailId: text('email_id').notNull(),
    webhookPayloadEmailReceivedJson: text('webhook_payload_email_received_json').notNull(),
    contentJson: text('content_json'),
    processingStatus: integer('processing_status').notNull(),
    receivedOn: timestamp('received_on').notNull(),
    processedOn: timestamp('processed_on'),
  },
  (table) => [
    index('base_email_received_email_from_idx').on(table.from),
    // A unique index is used so that the same email can not be somehow overwritten
    uniqueIndex('base_email_received_email_message_id_idx').on(table.emailId),
  ]
);

import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { v7 as uuidv7 } from 'uuid';

export const chunk = pgTable('bnaa_chunk', {
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),

  description: text('description'),

  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  name: text('name'),

  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

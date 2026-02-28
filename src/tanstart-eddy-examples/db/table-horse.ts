import { integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { v7 as uuidv7 } from 'uuid';
import { organization } from '~/lib/db/schema/auth.schema';
import { type HorseMarkingsType } from '../schema/horse';

export const tableHorse = pgTable('tanstart_eddy_examples_horse', {
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),

  name: text('name').notNull(),
  breed: text('breed').notNull(),
  birthYear: integer('birth-year').notNull(),
  color: text('color').notNull(),
  stallNumber: text('stall-number').notNull(),
  markings: jsonb('markings').$type<HorseMarkingsType>().notNull(),

  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

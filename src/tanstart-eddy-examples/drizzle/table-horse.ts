import { integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { v7 as uuidv7 } from 'uuid';
import { organization } from '~/lib/drizzle/auth';
import { type HorseMarkingsType } from '../schema/horse';

export const tableHorse = pgTable('tanstart_eddy_examples_horse', {
  birthYear: integer('birth-year').notNull(),
  breed: text('breed').notNull(),
  color: text('color').notNull(),

  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  markings: jsonb('markings').$type<HorseMarkingsType>().notNull(),

  name: text('name').notNull(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
  stallNumber: text('stall-number').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

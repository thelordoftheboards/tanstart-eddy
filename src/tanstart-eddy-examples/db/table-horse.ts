import { integer, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { v7 as uuidv7 } from 'uuid';
import { organization } from '~/lib/db/schema/auth.schema';

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
  colorAndMarkings: text('color-and-markings').notNull(),
  stallNumber: text('stall-number').notNull(),
});

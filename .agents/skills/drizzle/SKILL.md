---
name: drizzle
description: Use when creating, modifying, or reviewing drizzle ORM table definitions (pgTable schemas) in src/lsdm-dal/drizzle or src/neigh-assistant/drizzle. Encodes the project's table-definition conventions - id/createdAt/updatedAt trio, UUIDv7, snake_case columns, cascade FKs, chunkId linkage, alphabetical column order - for authoring new tables and verifying that existing tables and schema changes conform.
---

# Drizzle Table Definition Patterns

Applies to table definition files under `src/lsdm-dal/drizzle/` and `src/neigh-assistant/drizzle/`. Use this skill both when creating a new table and when reviewing existing tables or diffs for conformance.

## File and naming layout

- One table per file. File name is `kebab-case` of the entity (`feeding-schedule.ts` → `feedingSchedule`).
- Exported const is `camelCase` and matches the entity: `export const feedingSchedule = pgTable(...)`.
- SQL table name is prefixed by module: `lsdmdal_` for lsdm-dal, `neigh_` for neigh-assistant (`pgTable('neigh_feeding_schedule', ...)`).
- Every module has a `drizzle/index.ts` barrel re-exporting each table file, headed by:
  `/** biome-ignore-all lint/performance/noBarrelFile: Allow */`
- Barrel chain consumed by drizzle-kit: `drizzle.config.ts` → `src/lib/drizzle/index.ts` → `src/base-config/drizzle/index.ts` → module barrel. A new table is invisible to migrations until it is exported from its module barrel.

## Canonical table template

```ts
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { v7 as uuidv7 } from 'uuid';
import { chunk } from '../../base-nav-and-auth/drizzle/chunk';

export const thing = pgTable('neigh_thing', {
  // ...business columns, alphabetical, blank line between each...

  chunkId: uuid('chunk_id')
    .references(() => chunk.id, { onDelete: 'cascade' })
    .notNull(),

  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),

  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),

  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
```

The `id` / `createdAt` / `updatedAt` trio is mandatory on every table, with exactly these definitions:

- `id`: `uuid('id').$defaultFn(() => uuidv7()).primaryKey()` — UUIDv7 from the `uuid` package, generated app-side. Never serial/identity.
- `createdAt`: `timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull()`
- `updatedAt`: same as `createdAt` plus `.$onUpdate(() => new Date())`, still `.defaultNow().notNull()`

## Column conventions

- JS property names are `camelCase`; SQL column names are the `snake_case` equivalent, always given explicitly (`bodyConditionScore` → `body_condition_score`).
- Columns are listed in alphabetical order by JS property name, with a blank line between every column definition.
- Default to `.notNull()`. Omit it only for genuinely optional fields (e.g. `effectiveUntil` on `horse-barn-stall`, `completedByStaffId` on `feeding-schedule`).
- Type/mode mapping:
  - `timestamp(..., { mode: 'date', withTimezone: true })` for instants (events, timestamps, effective ranges)
  - `date(..., { mode: 'string' })` for calendar dates (birthdays, injury dates) — string mode, not Date objects
  - `integer(...)` for whole numbers (quantities, scores, lengths)
  - `text(...)` for strings, including enum-like values (comment the allowed values, e.g. `// indoor, outdoor`); no pg enum types
- No magic SQL: everything goes through `drizzle-orm/pg-core` column builders.

## Foreign keys

- Defined inline on the column, never in a separate third-array callback.
- Pattern: `uuid('<entity>_id').references(() <table>.id, { onDelete: 'cascade' }).notNull()`
- Always `onDelete: 'cascade'` for required relations. Genuinely optional references may omit `onDelete` (leave the default NO ACTION) — e.g. `completedByStaffId: uuid('completed_by_staff_id').references(() => staff.id)`.
- Import the referenced table module by relative path (`./horse`, `../../lsdm-dal/drizzle/chunk`).

## chunkId linkage

- Every `neigh-assistant` table carries `chunkId` referencing `lsdm-dal`'s `chunk.id` with cascade delete. This is the tenancy/partition anchor; do not omit it on new neigh tables.
- `chunk` itself (lsdm-dal) is the root and has no `chunkId`.

## Imports

- One grouped import from `drizzle-orm/pg-core` listing only the builders used.
- `import { v7 as uuidv7 } from 'uuid'` in every table file.
- Cross-module table imports follow the grouped relative-path style; keep them sorted.

## Verification checklist (existing tables and diffs)

Flag as violations:

1. Missing or altered `id` / `createdAt` / `updatedAt` trio (wrong type, missing `$defaultFn`/`$onUpdate`, missing `defaultNow`, nullable).
2. Table name missing the module prefix (`lsdmdal_` / `neigh_`) or not matching the file/entity.
3. SQL column name not the snake_case of the JS property (known pre-existing deviation: `feedType: text('feedType')` in `feeding-schedule.ts` — should be `feed_type`; do not replicate it, fix if touching the file).
4. Columns not alphabetical by JS property name, or missing blank-line separation.
5. FK without `onDelete: 'cascade'` on a required (notNull) relation; FK declared in the third `pgTable` argument instead of inline.
6. New neigh-assistant table without `chunkId`.
7. `date` columns in `mode: 'date'` (must be `mode: 'string'`) or timestamps without `withTimezone: true`.
8. Missing `.notNull()` on fields that are not intentionally optional.
9. New table file not exported from the module `drizzle/index.ts` barrel (drizzle-kit will not see it).
10. Serial/identity/autoincrement ids instead of UUIDv7.

When reviewing a diff, apply the checklist only to touched tables but report pre-existing violations in those files as notes (distinguish "introduced" from "pre-existing").

## After creating or changing tables

1. Export the new table from its module barrel (`src/<module>/drizzle/index.ts`).
2. `bun db:generate` — generate the migration (drizzle-kit, config at `drizzle.config.ts`, output `./drizzle/`).
3. `bun check` (biome + tsc) or `bun x ultracite fix` to format/lint.

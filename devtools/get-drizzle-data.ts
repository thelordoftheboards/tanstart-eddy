/**
 * A command line utility that accepts a drizzle table name as an argument and creates a json file with
 * the data in it, as an array of objects, named with the table name in kebab case with extension json
 * in the devtools directory.
 *
 * Usage: bun devtools/get-drizzle-data.ts <table-name>
 *   <table-name> is the pg table name (e.g. `lsdmuxd_screen`) or the drizzle export name
 *   (e.g. `screenStatus`). The output file is named after the pg table name, kebab-cased
 *   (e.g. `devtools/lsdmuxd-screen.json`). The `createdAt` and `updatedAt` fields are excluded
 *   from the output.
 */

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Column, getTableName } from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';
// biome-ignore lint/performance/noNamespaceImport: Allow
import * as schema from '~/base-config/drizzle';
import { db } from '~/lib/drizzle/db';

const EXCLUDED_COLUMN_NAMES = new Set(['createdAt', 'updatedAt']);

const CAMEL_CASE_BOUNDARY_REGEX = /([a-z0-9])([A-Z])/g;

function toKebabCase(value: string): string {
  return value.replaceAll('_', '-').replace(CAMEL_CASE_BOUNDARY_REGEX, '$1-$2').toLowerCase();
}

function collectTablesByKnownName(): Map<string, PgTable> {
  const tables = new Map<string, PgTable>();

  for (const [exportName, table] of Object.entries(schema)) {
    if (table instanceof PgTable) {
      tables.set(getTableName(table), table);
      tables.set(exportName, table);
    }
  }

  return tables;
}

async function index() {
  const [, , tableNameArg] = process.argv;
  const tables = collectTablesByKnownName();

  if (!tableNameArg) {
    console.error(
      `Usage: bun devtools/get-drizzle-data.ts <table-name>\n\nKnown tables:\n${[...new Set([...tables.keys()].filter((name) => name.includes('_')))].sort().join('\n')}`
    );
    process.exitCode = 1;
    return;
  }

  const table = tables.get(tableNameArg);

  if (!table) {
    console.error(`Table '${tableNameArg}' not found in the drizzle schema.`);
    process.exitCode = 1;
    return;
  }

  // The table proxy exposes columns keyed by their JS property names (plus non-column keys, e.g. enableRLS)
  const columnsToSelect = Object.fromEntries(
    Object.entries(table).filter(
      ([propertyName, value]) => !EXCLUDED_COLUMN_NAMES.has(propertyName) && value instanceof Column
    )
  );

  const rows = await db.select(columnsToSelect).from(table);

  const pgTableName = getTableName(table);
  const outputFileUrl = new URL(`./${toKebabCase(pgTableName)}.json`, import.meta.url);

  writeFileSync(outputFileUrl, `${JSON.stringify(rows, null, 2)}\n`);

  console.log(`Wrote ${rows.length} row(s) from '${pgTableName}' to ${fileURLToPath(outputFileUrl)}`);
}

try {
  await index();
} finally {
  await db.$client.end();
}

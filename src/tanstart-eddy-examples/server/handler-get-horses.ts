import { asc, eq } from 'drizzle-orm';
import { getOrganizationId } from '~/base-nav-and-auth/server/get-organization-id';
import { db } from '~/lib/db';
import { tableHorse } from '../db/table-horse';
import { type HorseType } from '../schema/horse';

export async function handlerGetHorses() {
  const organizationId = await getOrganizationId();

  const arrHorse: HorseType[] = await db
    .select({
      id: tableHorse.id,
      name: tableHorse.name,
      breed: tableHorse.breed,
      birthYear: tableHorse.birthYear,
      color: tableHorse.color,
      stallNumber: tableHorse.stallNumber,
      markings: tableHorse.markings,
    })
    .from(tableHorse)
    .where(eq(tableHorse.organizationId, organizationId))
    .orderBy(asc(tableHorse.name));

  return Response.json(arrHorse);
}

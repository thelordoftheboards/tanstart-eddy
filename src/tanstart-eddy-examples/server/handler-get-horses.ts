import { asc, eq } from 'drizzle-orm';
import { getOrganizationId } from '~/base-nav-and-auth/server/get-organization-id';
import { db } from '~/lib/drizzle/db';
import { tableHorse } from '../drizzle/table-horse';
import { type HorseType } from '../schema/horse';

export async function handlerGetHorses() {
  const organizationId = await getOrganizationId();

  const arrHorse: HorseType[] = await db
    .select({
      birthYear: tableHorse.birthYear,
      breed: tableHorse.breed,
      color: tableHorse.color,
      id: tableHorse.id,
      markings: tableHorse.markings,
      name: tableHorse.name,
      stallNumber: tableHorse.stallNumber,
    })
    .from(tableHorse)
    .where(eq(tableHorse.organizationId, organizationId))
    .orderBy(asc(tableHorse.name));

  return Response.json(arrHorse);
}

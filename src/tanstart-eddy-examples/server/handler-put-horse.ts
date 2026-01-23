import { and, eq } from 'drizzle-orm';
import { getOrganizationId } from '~/base-nav-and-auth/server/get-organization-id';
import { db } from '~/lib/db';
import { tableHorse } from '../db/table-horse';
import { type HorseType, horseSchema } from '../schema/horse';

export async function handlerPutHorse({ request }: { request: Request }) {
  console.info('Updating horse... @', request.url);

  const organizationId = await getOrganizationId();

  const requestData = await request.json();
  console.log('requestData:', requestData);
  const item: HorseType = horseSchema.parse(requestData);

  await db
    .update(tableHorse)
    .set({
      name: item.name,
      breed: item.breed,
      birthYear: item.birthYear,
      colorAndMarkings: item.colorAndMarkings,
      stallNumber: item.stallNumber,
    })
    .where(and(eq(tableHorse.id, item.id), eq(tableHorse.organizationId, organizationId)));

  return Response.json(item);
}

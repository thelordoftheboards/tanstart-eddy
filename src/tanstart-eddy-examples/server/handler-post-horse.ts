import { v7 as uuidv7 } from 'uuid';
import { getOrganizationId } from '~/base-nav-and-auth/server/get-organization-id';
import { db } from '~/lib/db';
import { tableHorse } from '../db/table-horse';
import { type HorseNoIdType, horseNoIdSchema } from '../schema/horse';

export async function handlerPostHorse({ request }: { request: Request }) {
  const organizationId = await getOrganizationId();

  const requestData = await request.json();
  const item: HorseNoIdType = horseNoIdSchema.parse(requestData);

  const id = uuidv7();

  await db.insert(tableHorse).values({
    id,
    organizationId,
    ...item,
  });

  return Response.json({
    id,
    ...item,
  });
}

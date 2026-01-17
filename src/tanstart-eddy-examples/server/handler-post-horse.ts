import { v7 as uuidv7 } from 'uuid';
import { getOrganizationId } from '~/base-nav-and-auth/server/get-organization-id';
import { db } from '~/lib/db';
import { tableHorse } from '~/tanstart-eddy-examples/db/table-horse';
import { HorseNoIdSchema, type HorseNoIdType } from '../schema/horse';

export async function handlerPostHorse({ request }: { request: Request }) {
  console.info('Fetching horses... @', request.url);

  const organizationId = await getOrganizationId();

  const requestData = await request.json();
  console.log('requestData:', requestData);
  const item: HorseNoIdType = HorseNoIdSchema.parse(requestData);

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

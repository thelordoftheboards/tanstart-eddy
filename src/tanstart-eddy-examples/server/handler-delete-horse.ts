import { and, eq } from 'drizzle-orm';
import { getOrganizationId } from '~/base-nav-and-auth/server/get-organization-id';
import { db } from '~/lib/db';
import { tableHorse } from '../db/table-horse';

export async function handlerDeleteHorse({ request }: { request: Request }) {
  console.info('Deleting horse... @', request.url);

  const organizationId = await getOrganizationId();

  const requestData = await request.json();
  console.log('requestData:', requestData);

  if (!requestData.id) {
    throw new Error('ID is required for deletion');
  }

  await db
    .delete(tableHorse)
    .where(and(eq(tableHorse.id, requestData.id), eq(tableHorse.organizationId, organizationId)));

  return Response.json({ success: true, id: requestData.id });
}

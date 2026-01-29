import { getOrganizationId } from '~/base-nav-and-auth/server/get-organization-id';
import { globalClientSettings } from '~/base-nav-and-auth-config/server/global-client-settings-all-parts';

export async function handlerGetGlobalClientSettings() {
  // TODO // Decide if this needs to be only for authenticated users. If yes think of better way to handle authenticated users
  const _organizationId = await getOrganizationId();

  return Response.json(globalClientSettings);
}

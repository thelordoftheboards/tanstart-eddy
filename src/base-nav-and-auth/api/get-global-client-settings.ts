import { globalClientSettings } from '~/base-nav-and-auth-config/server/global-client-settings-all-parts';
import { getUserIdFromSession } from '../server/get-user-id-from-session';

export async function getGlobalClientSettings() {
  // TODO // Decide if this needs to be only for authenticated users. If yes think of better way to handle authenticated users
  const _ = await getUserIdFromSession();

  return Response.json(globalClientSettings);
}

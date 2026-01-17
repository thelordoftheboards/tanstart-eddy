import { getRequest } from '@tanstack/react-start/server';
import { auth } from '~/lib/auth/auth';

export async function getOrganizationId(): Promise<string> {
  const request = getRequest();
  if (!request?.headers) {
    throw new Error('The user must have be logged in.');
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const organizationId = session?.session.activeOrganizationId;
  if (!organizationId) {
    throw new Error('The user must have a selected organization.');
  }

  return organizationId;
}

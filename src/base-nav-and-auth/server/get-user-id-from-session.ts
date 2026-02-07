import { getRequest } from '@tanstack/react-start/server';
import { UserReportableError } from '~/base/utils/user-reportable-error';
import { auth } from '~/lib/auth/auth';

export async function getUserIdFromSession(): Promise<string> {
  const request = getRequest();
  if (!request?.headers) {
    throw new UserReportableError('USER-REPORTABLE-ERROR-user-must-logged-in', 'The user must have be logged in.');
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    throw new UserReportableError('USER-REPORTABLE-ERROR-user-must-logged-in', 'The user must have be logged in.');
  }

  return session.user.id;
}

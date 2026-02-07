import { getUserIdFromSession } from './get-user-id-from-session';

export async function handlerGetAbout() {
  const _ = await getUserIdFromSession();

  return Response.json({ npm_package_version: process.env.npm_package_version });
}

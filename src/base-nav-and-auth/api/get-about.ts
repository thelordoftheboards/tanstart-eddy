import { getUserIdFromSession } from '../server/get-user-id-from-session';

export async function getAbout() {
  const _ = await getUserIdFromSession();

  return Response.json({
    npm_package_name: process.env.npm_package_name,
    npm_package_version: process.env.npm_package_version,
  });
}

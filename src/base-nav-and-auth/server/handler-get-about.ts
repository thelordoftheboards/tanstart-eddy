import { getOrganizationId } from '~/base-nav-and-auth/server/get-organization-id';

export async function handlerGetAbout() {
  const _organizationId = await getOrganizationId();

  return Response.json({ npm_package_version: process.env.npm_package_version });
}

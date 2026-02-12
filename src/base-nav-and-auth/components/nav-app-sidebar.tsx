import React from 'react';
import { canManageUsers, type UserRole } from '~/base-nav-and-auth-config/lib/auth/permissions';
import { Sidebar, SidebarFooter, SidebarHeader, SidebarRail } from '~/components/ui/sidebar';
import { authClient } from '~/lib/auth/auth-client';
import { NavAppSidebarContent } from '../../base-nav-and-auth-config/components/nav-app-sidebar-content';
import { NavOrganizationSwitcher } from './nav-organization-switcher';
import { NavUser } from './nav-user';

export function NavAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = authClient.useSession();

  const currentUserRole = (session?.user?.role as UserRole) || 'user';

  const user = session?.user
    ? {
        name: session.user.name || session.user.email,
        email: session.user.email,
        avatar: session.user.image ?? null,
      }
    : undefined;
  const userCanManageUsers = canManageUsers(currentUserRole);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavOrganizationSwitcher />
      </SidebarHeader>

      <NavAppSidebarContent />

      <SidebarFooter>{user && <NavUser user={user} userCanManageUsers={userCanManageUsers} />}</SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

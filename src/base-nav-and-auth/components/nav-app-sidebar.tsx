import { GalleryVerticalEnd } from 'lucide-react';
import React from 'react';
import { canManageUsers, type UserRole } from '~/base-nav-and-auth-config/lib/auth/permissions';
import { Sidebar, SidebarFooter, SidebarHeader, SidebarRail } from '~/components/ui/sidebar';
import { authClient } from '~/lib/auth/auth-client';
import { NavAppSidebarContent } from '../../base-nav-and-auth-config/components/nav-app-sidebar-content';
import { useOrganizations } from '../hooks/organization-hooks';
import { NavOrganizationSwitcher } from './nav-organization-switcher';
import { NavUser } from './nav-user';

export function NavAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = authClient.useSession();
  const { data: organizations } = useOrganizations();

  const currentUserRole = (session?.user?.role as UserRole) || 'user';

  const user = session?.user
    ? {
        name: session.user.name || session.user.email,
        email: session.user.email,
        avatar: session.user.image || '/placeholder-user.jpg',
      }
    : undefined;
  const userCanManageUsers = canManageUsers(currentUserRole);

  const organization =
    organizations?.map((org) => ({
      name: org.name,
      logo: GalleryVerticalEnd,
      plan: 'Free', // TODO // Add plan information to organization data
    })) || [];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavOrganizationSwitcher organizations={organization} />
      </SidebarHeader>

      <NavAppSidebarContent />

      <SidebarFooter>{user && <NavUser user={user} userCanManageUsers={userCanManageUsers} />}</SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

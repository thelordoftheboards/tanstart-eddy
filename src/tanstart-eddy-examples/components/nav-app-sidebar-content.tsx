import { IconFerry, IconHorse } from '@tabler/icons-react';
import { MenuItemType } from '~/base-nav-and-auth/schema/menu-item';
import { SidebarContent } from '~/components/ui/sidebar';
import { arrNavAppSidebarItemMenu as arrNavAppSidebarItemMenuCumberland } from '~/tanstart-cumberland-examples/components/nav-app-sidebar-content';
import { NavAppSidebarItemMenu } from '../../base-nav-and-auth/components/nav-app-side-bar-item-menu';

export const arrNavAppSidebarItemMenu: MenuItemType[] = [
  ...arrNavAppSidebarItemMenuCumberland,
  {
    title: 'Eddy',
    icon: IconFerry,
    items: [
      {
        icon: IconHorse,
        title: 'Horses',
        url: '/dashboard/tanstart-eddy-examples/horses/horse-list',
        requiresOrganization: true,
      },
      {
        title: 'Example Layout 4',
        url: '/dashboard/tanstart-eddy-examples/example-layout-4',
      },
      {
        title: 'Example Layout 5',
        url: '/dashboard/tanstart-eddy-examples/example-layout-5',
      },
      {
        title: 'Example Layout 6',
        url: '/dashboard/tanstart-eddy-examples/example-layout-6',
      },
    ],
  },
];

export function NavAppSidebarContent() {
  return (
    <SidebarContent>
      <NavAppSidebarItemMenu items={arrNavAppSidebarItemMenu} />
    </SidebarContent>
  );
}

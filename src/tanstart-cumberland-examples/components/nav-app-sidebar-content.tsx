import { IconFerry } from '@tabler/icons-react';
import { MenuItemType } from '~/base-nav-and-auth/schema/menu-item';
import { SidebarContent } from '~/components/ui/sidebar';
import { NavAppSidebarItemMenu } from '../../base-nav-and-auth/components/nav-app-side-bar-item-menu';

export const arrNavAppSidebarItemMenu: MenuItemType[] = [
  {
    title: 'Cumberland',
    icon: IconFerry,
    isActive: true,
    items: [
      {
        title: 'Website Index',
        url: '/',
      },
      {
        title: 'Dashboard Index',
        url: '/dashboard/',
      },
      {
        title: 'Example Layout 1',
        url: '/dashboard/tanstart-cumberland-examples/example-layout-1',
      },
      {
        title: 'Example Layout 2',
        url: '/dashboard/tanstart-cumberland-examples/example-layout-2',
      },
      {
        title: 'Example Layout 3',
        url: '/dashboard/tanstart-cumberland-examples/example-layout-3',
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

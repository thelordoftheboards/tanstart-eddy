import { IconFerry, IconHorse } from '@tabler/icons-react';
import { BookOpen, Bot, Frame, Map as IconMap, PieChart, Settings2, SquareTerminal } from 'lucide-react';
import { SidebarContent } from '~/components/ui/sidebar';
import { NavAppSidebarItemMenu } from '../../base-nav-and-auth/components/nav-app-side-bar-item-menu';
import { NavAppSidebarItemProject } from '../../base-nav-and-auth/components/nav-app-side-bar-item-project';

const arrNavAppSidebarItemMenu = [
  {
    title: 'Documentation',
    icon: BookOpen,
    items: [
      {
        title: 'Introduction',
        url: '/dashboard/',
      },
      {
        title: 'Get Started',
        url: '/dashboard/',
      },
      {
        title: 'Tutorials',
        url: '/dashboard/',
      },
      {
        title: 'Changelog',
        url: '/dashboard/',
      },
    ],
  },
  {
    title: 'Sub icons',
    icon: Bot,
    items: [
      {
        icon: SquareTerminal,
        title: 'Square Terminal',
        url: '/dashboard/',
      },
      {
        icon: IconMap,
        title: 'Map',
        url: '/dashboard/',
      },
    ],
  },
  {
    title: 'Settings',
    icon: Settings2,
    items: [
      {
        title: 'General',
        url: '/dashboard/',
      },
      {
        title: 'Team',
        url: '/dashboard/',
      },
      {
        title: 'Billing',
        url: '/dashboard/',
      },
      {
        title: 'Limits',
        url: '/dashboard/',
      },
    ],
  },
  {
    title: 'Main Level Link',
    icon: Bot,
    url: '/dashboard/',
  },
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
        url: '/dashboard/cumberland/example-layout-1',
      },
      {
        title: 'Example Layout 2',
        url: '/dashboard/cumberland/example-layout-2',
      },
      {
        title: 'Example Layout 3',
        url: '/dashboard/cumberland/example-layout-3',
      },
    ],
  },
  {
    title: 'Eddy',
    icon: IconFerry,
    items: [
      {
        Icon: IconHorse,
        title: 'Horses',
        url: '/dashboard/eddy/horses/horse-list',
      },
    ],
  },
];

const arrNavAppSidebarItemProject = [
  {
    name: 'Design Engineering',
    url: '/dashboard/',
    icon: Frame,
  },
  {
    name: 'Sales & Marketing',
    url: '/dashboard/',
    icon: PieChart,
  },
  {
    name: 'Travel',
    url: '/dashboard/',
    icon: IconMap,
  },
];

export function NavAppSidebarContent() {
  return (
    <SidebarContent>
      <NavAppSidebarItemMenu items={arrNavAppSidebarItemMenu} />
      <NavAppSidebarItemProject projects={arrNavAppSidebarItemProject} />
    </SidebarContent>
  );
}

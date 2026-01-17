import { BookOpen, Bot, Frame, Map as IconMap, PieChart, Settings2, SquareTerminal } from 'lucide-react';
import { SidebarContent } from '~/components/ui/sidebar';
import { NavAppSidebarItemMenu } from '../../base-nav-and-auth/components/nav-app-side-bar-item-menu';
import { NavAppSidebarItemProject } from '../../base-nav-and-auth/components/nav-app-side-bar-item-project';

const arrNavAppSidebarItemMenu = [
  {
    title: 'Cumberland',
    icon: SquareTerminal,
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
        title: 'Layout Example',
        url: '/dashboard/cumberland/example-layout',
      },
    ],
  },
  {
    title: 'Menu w sub icons',
    icon: Bot,
    items: [
      {
        icon: SquareTerminal,
        title: 'Dashboard Index',
        url: '/dashboard/',
      },
      {
        icon: IconMap,
        title: 'Layout Example',
        url: '/dashboard/cumberland/example-layout',
      },
    ],
  },
  {
    title: 'Dashboard',
    url: '/dashboard/',
    icon: PieChart,
  },
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
];

const arrNavAppSidebarItemProject = [
  {
    name: 'Design Engineering',
    url: '/dashboard/',
    icon: Frame,
  },
  {
    name: 'Sales & Marketing',
    url: '#',
    icon: PieChart,
  },
  {
    name: 'Travel',
    url: '#',
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

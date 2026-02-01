import { createFileRoute } from '@tanstack/react-router';
import { PageAbout } from '~/base-nav-and-auth/features/page-about';

export const Route = createFileRoute('/(authenticated)/dashboard/account/about')({
  component: PageAbout,
  ssr: false,
});

import { createFileRoute } from '@tanstack/react-router';
import { PageAdminOverview } from '~/base-nav-and-auth/components/page-admin-overview';

export const Route = createFileRoute('/(authenticated)/dashboard/admin/')({
  component: PageAdminOverview,
});

import { createFileRoute } from '@tanstack/react-router';
import { PageAdminOverview } from '~/base-nav-and-auth/features/page-admin-overview';

export const Route = createFileRoute('/(authenticated)/dashboard/admin/')({
  component: PageAdminOverview,
});

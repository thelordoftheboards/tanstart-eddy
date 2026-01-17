import { createFileRoute } from '@tanstack/react-router';
import { PageAdminUsers } from '~/base-nav-and-auth/components/page-admin-users';

export const Route = createFileRoute('/(authenticated)/dashboard/admin/users')({
  component: PageAdminUsers,
});

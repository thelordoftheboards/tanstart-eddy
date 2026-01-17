import { createFileRoute } from '@tanstack/react-router';
import { PageAccount } from '~/base-nav-and-auth/components/page-account';

export const Route = createFileRoute('/(authenticated)/dashboard/account/')({
  component: PageAccount,
});

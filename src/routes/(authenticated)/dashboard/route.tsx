import { createFileRoute, Outlet } from '@tanstack/react-router';
import { LayoutWithSidebar } from '~/base-nav-and-auth/components/layout-with-sidebar';

export const Route = createFileRoute('/(authenticated)/dashboard')({
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <LayoutWithSidebar>
      <Outlet />
    </LayoutWithSidebar>
  );
}

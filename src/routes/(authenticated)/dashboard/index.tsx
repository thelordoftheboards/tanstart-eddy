import { createFileRoute } from '@tanstack/react-router';
import { PageDashboardIndex } from '~/tanstart-cumberland-examples/components/page-dashboard-index';

export const Route = createFileRoute('/(authenticated)/dashboard/')({
  component: DashboardIndex,
});

function DashboardIndex() {
  const { user } = Route.useRouteContext();

  return <PageDashboardIndex user={user} />;
}

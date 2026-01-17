import { createFileRoute } from '@tanstack/react-router';
import { PageExampleLayout1 } from '~/tanstart-cumberland-examples/components/page-example-layout-1';

export const Route = createFileRoute('/(authenticated)/dashboard/cumberland/example-layout-1')({
  component: DashboardIndex,
});

function DashboardIndex() {
  return <PageExampleLayout1 />;
}

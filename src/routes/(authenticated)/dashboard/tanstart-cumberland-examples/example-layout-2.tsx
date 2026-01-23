import { createFileRoute } from '@tanstack/react-router';
import { PageExampleLayout2 } from '~/tanstart-cumberland-examples/components/page-example-layout-2';

export const Route = createFileRoute('/(authenticated)/dashboard/tanstart-cumberland-examples/example-layout-2')({
  component: DashboardIndex,
});

function DashboardIndex() {
  return <PageExampleLayout2 />;
}

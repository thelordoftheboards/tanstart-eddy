import { createFileRoute } from '@tanstack/react-router';
import { PageExampleLayout3 } from '~/tanstart-cumberland-examples/components/page-example-layout-3';

export const Route = createFileRoute('/(authenticated)/dashboard/tanstart-cumberland-examples/example-layout-3')({
  component: DashboardIndex,
});

function DashboardIndex() {
  return <PageExampleLayout3 />;
}

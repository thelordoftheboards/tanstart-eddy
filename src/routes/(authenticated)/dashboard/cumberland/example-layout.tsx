import { createFileRoute } from '@tanstack/react-router';
import { PageExampleLayout } from '~/tanstart-cumberland-examples/components/page-example-layout';

export const Route = createFileRoute('/(authenticated)/dashboard/cumberland/example-layout')({
  component: DashboardIndex,
});

function DashboardIndex() {
  return <PageExampleLayout />;
}

import { createFileRoute } from '@tanstack/react-router';
import { PageExampleLayout6 } from '~/tanstart-eddy-examples/components/page-example-layout-6';

export const Route = createFileRoute('/(authenticated)/dashboard/eddy/example-layout-6')({
  component: DashboardIndex,
  ssr: false,
});

function DashboardIndex() {
  return <PageExampleLayout6 />;
}

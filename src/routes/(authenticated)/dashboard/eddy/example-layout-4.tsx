import { createFileRoute } from '@tanstack/react-router';
import { PageExampleLayout4 } from '~/tanstart-eddy-examples/components/page-example-layout-4';

export const Route = createFileRoute('/(authenticated)/dashboard/eddy/example-layout-4')({
  component: DashboardIndex,
  ssr: false,
});

function DashboardIndex() {
  return <PageExampleLayout4 />;
}

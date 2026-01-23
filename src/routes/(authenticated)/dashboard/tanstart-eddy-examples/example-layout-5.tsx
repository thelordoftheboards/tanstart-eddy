import { createFileRoute } from '@tanstack/react-router';
import { PageExampleLayout5 } from '~/tanstart-eddy-examples/components/page-example-layout-5';

export const Route = createFileRoute('/(authenticated)/dashboard/tanstart-eddy-examples/example-layout-5')({
  component: DashboardIndex,
  ssr: false,
});

function DashboardIndex() {
  return <PageExampleLayout5 />;
}

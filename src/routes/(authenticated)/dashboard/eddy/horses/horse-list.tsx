import { createFileRoute } from '@tanstack/react-router';
import { PageHorseList } from '~/tanstart-eddy-examples/components/page-horse-list';

export const Route = createFileRoute('/(authenticated)/dashboard/eddy/horses/horse-list')({
  component: RouteComponent,
  ssr: false,
});

function RouteComponent() {
  return <PageHorseList />;
}

import { NavHeaderBreadcrumbs } from '~/base-nav-and-auth/components/layout-elements';

export function PageExampleLayout() {
  return (
    <>
      <NavHeaderBreadcrumbs
        arrBreadcrumbs={[
          { title: 'Website', url: '/' },
          { title: 'Dashboard', url: '/dashboard' },
          { title: 'Layout' },
        ]}
      />
      <div className="flex flex-col bg-green-900">
        <div className="my-4 w-full bg-yellow-800 px-4">
          content
          <br />
          content
          <br />
          content
          <br />
          content
          <br />
        </div>
        <div className="my-4 grid w-full auto-rows-min gap-4 px-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>
        <div className="my-4 w-full bg-muted/50 px-4">
          <div className="w-full overflow-scroll bg-muted/50">
            <div className="w-700 border border-yellow-400 bg-linear-to-r from-blue-800 to-blue-500">
              content
              <br />
              content
              <br />
              content
              <br />
              content
              <br />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

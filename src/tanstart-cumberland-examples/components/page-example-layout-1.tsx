import { NavHeaderBreadcrumbs } from '~/base-nav-and-auth/components/layout-elements';
import { arrLoremIpsum } from '../utils/lorem-ipsum';

export function PageExampleLayout1() {
  return (
    <>
      <NavHeaderBreadcrumbs
        arrBreadcrumbs={[
          { title: 'Website', url: '/' },
          { title: 'Dashboard', url: '/dashboard' },
          { title: 'Layout' },
        ]}
      />
      <div className="flex flex-col">
        <div className="my-4 w-full bg-muted/50 p-2">{arrLoremIpsum[3]}</div>

        <div className="my-4 grid w-full auto-rows-min gap-4 px-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50 p-2">{arrLoremIpsum[2]}</div>
          <div className="aspect-video rounded-xl bg-muted/50 p-2">{arrLoremIpsum[2]}</div>
          <div className="aspect-video rounded-xl bg-muted/50 p-2">{arrLoremIpsum[2]}</div>
        </div>

        <div className="my-4 w-full bg-muted/50 px-4">
          <div className="w-full overflow-scroll bg-muted/50 p-2">
            <div className="w-[150vw] border border-primary bg-muted/50">{arrLoremIpsum[5]}</div>
          </div>
        </div>
      </div>
    </>
  );
}

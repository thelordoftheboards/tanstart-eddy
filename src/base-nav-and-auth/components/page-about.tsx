import { useSuspenseQuery } from '@tanstack/react-query';
import { InsetContainerWithFloatingTriggerAndTitle } from '~/base-nav-and-auth/components/layout-elements';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { queryOptionsAbout } from '../client/query-options-about';

function Versions() {
  //const about_app = useQuery(trpc.about_app.get.queryOptions());
  const about = useSuspenseQuery(queryOptionsAbout()).data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Versions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex grow flex-col gap-2">
            <p className="border-b-2 border-b-foreground/10 font-medium">Client Version</p>
            {/** biome-ignore lint/correctness/noUndeclaredVariables: Defined in vite.config.ts */}
            <div className="flex flex-col gap-2">{APP_VERSION}</div>
          </div>
          <div className="flex grow flex-col gap-2">
            <p className="border-b-2 border-b-foreground/10 font-medium">Server Version</p>
            <div className="flex flex-col gap-2">{about.npm_package_version ?? 'fetching ...'}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PageAbout() {
  return (
    <InsetContainerWithFloatingTriggerAndTitle subTitle="Software version" title="About">
      <Versions />
    </InsetContainerWithFloatingTriggerAndTitle>
  );
}

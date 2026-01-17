import { InsetContainerWithFloatingTriggerAndTitle } from '~/base-nav-and-auth/components/layout-elements';
import { Button } from '~/components/ui/button';
import { ScrollArea } from '~/components/ui/scroll-area';
import { arrLoremIpsum } from '../utils/lorem-ipsum';

export function PageExampleLayout2() {
  return (
    <InsetContainerWithFloatingTriggerAndTitle
      subTitle="Ut enim ad minima veniam."
      title="Duis aute"
      titleExtraElements={
        <div className="mx-2 flex grow flex-row-reverse flex-wrap items-center gap-2">
          <Button>Excepteur</Button>
          <Button>Vestibulum</Button>
        </div>
      }
    >
      <div className="flex flex-col overflow-hidden">
        <div className="my-4 w-full bg-muted/50 p-2">{arrLoremIpsum[2]}</div>
        <div className="flex-1 overflow-hidden p-4">
          <ScrollArea className="h-full w-full">
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
          </ScrollArea>
        </div>
      </div>
    </InsetContainerWithFloatingTriggerAndTitle>
  );
}

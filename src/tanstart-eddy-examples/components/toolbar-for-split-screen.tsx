import {
  IconLayoutBottombarFilled,
  IconLayoutColumns,
  IconLayoutNavbarFilled,
  IconLayoutRows,
} from '@tabler/icons-react';
import { Home, Settings, User } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { cn } from '~/lib/utils';

export function ToolbarForSplitScreen({
  paddingLeft,
  position,
  setPosition,
  direction,
  setDirection,
}: {
  paddingLeft: boolean;
  position: 'top' | 'bottom';
  setPosition: React.Dispatch<React.SetStateAction<'top' | 'bottom'>>;
  direction: string;
  setDirection: React.Dispatch<React.SetStateAction<'horizontal' | 'vertical'>>;
}) {
  return (
    <div className={cn('flex items-center gap-1 border-b bg-background p-2', paddingLeft ? 'pl-16' : '')}>
      <Button size="sm" variant="outline">
        <Home className="h-4 w-4" />
      </Button>
      <Button size="sm" variant="outline">
        <Settings className="h-4 w-4" />
      </Button>
      <Button size="sm" variant="outline">
        <User className="h-4 w-4" />
      </Button>
      <Tabs onValueChange={(value) => setPosition(value)} value={position}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger className="gap-2" value="top">
            <IconLayoutNavbarFilled className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger className="gap-2" value="bottom">
            <IconLayoutBottombarFilled className="h-4 w-4" />
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Tabs onValueChange={(value) => setDirection(value)} value={direction}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger className="gap-2" value="horizontal">
            <IconLayoutColumns className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger className="gap-2" value="vertical">
            <IconLayoutRows className="h-4 w-4" />
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}

import { IconLayoutColumns, IconLayoutRows } from '@tabler/icons-react';
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';

export function OrientationToggle({
  direction,
  setDirection,
}: {
  direction: string;
  setDirection: React.Dispatch<React.SetStateAction<'horizontal' | 'vertical'>>;
}) {
  return (
    <Tabs className="w-50" onValueChange={(value) => setDirection(value)} value={direction}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger className="gap-2" value="horizontal">
          <IconLayoutColumns className="h-4 w-4" />
          Horizontal
        </TabsTrigger>
        <TabsTrigger className="gap-2" value="vertical">
          <IconLayoutRows className="h-4 w-4" />
          Vertical
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

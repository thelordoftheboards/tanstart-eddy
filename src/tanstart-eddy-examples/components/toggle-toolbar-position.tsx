import { IconLayoutColumns, IconLayoutRows } from '@tabler/icons-react';
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';

export function ToggleToolbarPosition({
  position,
  setPosition,
}: {
  position: 'top' | 'bottom';
  setPosition: React.Dispatch<React.SetStateAction<'top' | 'bottom'>>;
}) {
  return (
    <div className="flex items-center gap-2">
      Toolbar position:
      <Tabs className="w-50" onValueChange={(value) => setPosition(value)} value={position}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger className="gap-2" value="top">
            <IconLayoutColumns className="h-4 w-4" />
            Top
          </TabsTrigger>
          <TabsTrigger className="gap-2" value="bottom">
            <IconLayoutRows className="h-4 w-4" />
            Bottom
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}

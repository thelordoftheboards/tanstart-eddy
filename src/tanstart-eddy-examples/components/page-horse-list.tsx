import { IconDotsVertical } from '@tabler/icons-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Table } from '~/base/components/table';
import { sortArrayBySortField, TableSortableHeader } from '~/base/components/table-sortable-header';
import { InsetContainerWithFloatingTriggerAndTitle } from '~/base-nav-and-auth/components/layout-elements';
import { Button } from '~/components/ui/button';
import { TableBody, TableCell, TableHeader, TableRow } from '~/components/ui/table';
import { queryOptionsHorses } from '../client/query-options-horses';
import { type HorseType } from '../schema/horse';
import { DialogHorseEdit } from './dialog-horse-edit';

type SortField = keyof HorseType;
type SortDirection = 'asc' | 'desc';

export function PageHorseList() {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [editingHorse, setEditingHorse] = useState<HorseType | undefined>(undefined);

  const arrHorse = useSuspenseQuery(queryOptionsHorses()).data;

  const handleSort = (field: SortField): void => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedHorses = sortArrayBySortField(arrHorse, sortField, sortDirection);

  return (
    <InsetContainerWithFloatingTriggerAndTitle
      subTitle="List of horses on the ranch"
      title="Horses"
      titleExtraElements={
        <div className="mx-2 flex grow flex-row-reverse flex-wrap items-center gap-2">
          <DialogHorseEdit />
          {editingHorse && (
            <DialogHorseEdit
              horse={editingHorse}
              isOpen={!!editingHorse}
              setOpen={(open) => !open && setEditingHorse(undefined)}
            />
          )}
        </div>
      }
    >
      <Table containerClassName="flex-1 overflow-y-auto">
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow>
            <TableSortableHeader field="name" onSort={handleSort} sortDirection={sortDirection} sortField={sortField}>
              Name
            </TableSortableHeader>
            <TableSortableHeader field="breed" onSort={handleSort} sortDirection={sortDirection} sortField={sortField}>
              Breed
            </TableSortableHeader>
            <TableSortableHeader
              field="birthYear"
              onSort={handleSort}
              sortDirection={sortDirection}
              sortField={sortField}
            >
              Birth Year
            </TableSortableHeader>
            <TableSortableHeader
              field="colorAndMarkings"
              onSort={handleSort}
              sortDirection={sortDirection}
              sortField={sortField}
            >
              Color & Markings
            </TableSortableHeader>
            <TableSortableHeader
              field="stallNumber"
              onSort={handleSort}
              sortDirection={sortDirection}
              sortField={sortField}
            >
              Stall Number
            </TableSortableHeader>
            <TableHeader className="sticky right-0 w-12 border-l bg-background" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedHorses.map((horse) => (
            <TableRow key={horse.id}>
              <TableCell>{horse.name}</TableCell>
              <TableCell>{horse.breed}</TableCell>
              <TableCell>{horse.birthYear}</TableCell>
              <TableCell>{horse.colorAndMarkings}</TableCell>
              <TableCell>{horse.stallNumber}</TableCell>
              <TableCell className="sticky right-0 w-12 border-l bg-background">
                <Button onClick={() => setEditingHorse(horse)} size="sm" variant="ghost">
                  <IconDotsVertical className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </InsetContainerWithFloatingTriggerAndTitle>
  );
}

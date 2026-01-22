import { IconDotsVertical } from '@tabler/icons-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Table } from '~/base/components/table';
import { sortArrayBySortField, TableSortableHeader } from '~/base/components/table-sortable-header';
import { Button } from '~/components/ui/button';
import { TableBody, TableCell, TableHeader, TableRow } from '~/components/ui/table';

type SortField = keyof HorseType;
type SortDirection = 'asc' | 'desc';

type HorseType = {
  id: string;
  name: string;
  breed: string;
  birthYear: number;
  colorAndMarkings: string;
  stallNumber: string;
};

const arrHorse: HorseType[] = [
  {
    id: '1234',
    name: 'Horse 1234',
    breed: 'Breed 1234',
    birthYear: 2020,
    colorAndMarkings: 'roan',
    stallNumber: '11A',
  },
];

(() => {
  const arrFirstName = ['Sea', 'Air', 'Brave', 'Fast', 'Lovely', 'Strong', 'Great'];
  const arrLastName = [
    'Biscuit',
    'Donut',
    'Crape',
    'Pancake',
    'Starlight',
    'Midnight',
    'Thunderbolt',
    'Willow',
    'Maverick',
    'Cinnamon',
    'Shadow',
    'Spirit',
    'Honey',
    'Apollo',
    'Dakota',
    'Blue',
    'Ranger',
    'Clover',
    'Ace',
    'Sierra',
    'Blaze',
    'Juniper',
    'Outlaw',
    'Belle',
  ];
  const arrBreed = ['Quarter', 'Arabian', 'Thoroughbred', 'Fresian', 'Persheron', 'Clydesdale'];
  const arrColor = ['Bay', 'Chestnut', 'Black', 'Gray', 'Dun', 'Roan'];
  const arrMarkings = ['Star', null, null, 'Stripe', null, 'Blaze', null, null, 'Stocking'];

  for (let ix = 0; ix < 100; ix++) {
    const id = `horse-${ix}`;
    const name = `${arrFirstName[ix % arrFirstName.length]} ${arrLastName[ix % arrLastName.length]}`;
    const breed = arrBreed[ix % arrBreed.length];
    const birthYear = 2015 + (ix % 10);
    const colorAndMarkings = `${arrColor[ix % arrColor.length]} ${arrMarkings[ix % arrMarkings.length] ?? ''}`;
    const stallNumber = `${Math.ceil(ix + 1 / 2)}${ix % 2 === 0 ? 'A' : 'B'}`;

    arrHorse.push({
      id,
      name,
      breed,
      birthYear,
      colorAndMarkings,
      stallNumber,
    });
  }
})();

export function TableHorse() {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

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
              <Button onClick={() => toast.success(`Horse: ${horse.name}`)} size="sm" variant="ghost">
                <IconDotsVertical className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

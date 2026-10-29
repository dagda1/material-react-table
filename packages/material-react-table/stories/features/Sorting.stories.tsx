import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react-vite';
import { useState } from 'react';

import { MaterialReactTable, type MRT_ColumnDef, type MRT_SortingState } from '../../src';

const meta: Meta = {
  title: 'Features/Sorting Examples',
};

export default meta;

const columns: MRT_ColumnDef<(typeof data)[0]>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
  {
    accessorKey: 'state',
    header: 'State',
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
  },
];

const data = [...Array(100)].map(() => ({
  address: faker.location.streetAddress(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
}));

export const SortingEnabledDefault = (): JSX.Element => <MaterialReactTable columns={columns} data={data} />;

export const DisableSorting = (): JSX.Element => (
  <MaterialReactTable columns={columns} data={data} enableSorting={false} />
);

export const DisableSortingForSpecificColumns = (): JSX.Element => (
  <MaterialReactTable
    columns={[
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'address',
        enableSorting: false,
        header: 'Address',
      },
      {
        accessorKey: 'state',
        header: 'State',
      },
      {
        accessorKey: 'phoneNumber',
        enableSorting: false,
        header: 'Phone Number',
      },
    ]}
    data={data}
  />
);

export const DisableMultiSorting = (): JSX.Element => (
  <MaterialReactTable columns={columns} data={data} enableMultiSort={false} />
);

export const DisableSortingRemoval = (): JSX.Element => (
  <MaterialReactTable columns={columns} data={data} enableSortingRemoval={false} />
);

export const SortRanking = (): JSX.Element => (
  <MaterialReactTable
    columns={[
      {
        accessorKey: 'firstName',
        header: 'First Name',
        sortFn: 'fuzzy',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
      {
        accessorKey: 'state',
        header: 'State',
      },
      {
        accessorKey: 'phoneNumber',
        header: 'Phone Number',
      },
    ]}
    data={data}
    enableRowNumbers
    initialState={{ sorting: [{ desc: false, id: 'firstName' }] }}
  />
);

export const SortingStateManaged = (): JSX.Element => {
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  return <MaterialReactTable columns={columns} data={data} onSortingChange={setSorting} state={{ sorting }} />;
};

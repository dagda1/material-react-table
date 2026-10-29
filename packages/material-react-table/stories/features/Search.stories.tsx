import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react-vite';
import { useState } from 'react';

import { MaterialReactTable, type MRT_ColumnDef } from '../../src';

const meta: Meta = {
  title: 'Features/Search Examples',
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
    accessorKey: 'age',
    header: 'Age',
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

const data = [...Array(200)].map(() => ({
  address: faker.location.streetAddress(),
  age: +faker.number.float({ max: 100, min: 0 }),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
}));

export const SearchEnabledDefault = (): JSX.Element => <MaterialReactTable columns={columns} data={data} />;

export const SearchInitialState = (): JSX.Element => (
  <MaterialReactTable columns={columns} data={data} initialState={{ globalFilter: 'John' }} />
);

export const SearchInitializedState = (): JSX.Element => {
  const [globalFilter, setGlobalFilter] = useState('John');

  return (
    <MaterialReactTable columns={columns} data={data} onGlobalFilterChange={setGlobalFilter} state={{ globalFilter }} />
  );
};

export const SearchContains = (): JSX.Element => (
  <MaterialReactTable columns={columns} data={data} globalFilterFn="contains" />
);

export const CustomGlobalFilterFn = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    filterFns={{
      myCustomFilterFn: (row, id, filterValue) => row.getValue<string>(id).startsWith(filterValue as string),
    }}
    globalFilterFn="myCustomFilterFn"
  />
);

export const SearchGlobalFilterModes = (): JSX.Element => (
  <MaterialReactTable columns={columns} data={data} enableGlobalFilterModes />
);

export const SearchGlobalFilterModeOptions = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enableGlobalFilterModes
    globalFilterModeOptions={['asfd', 'contains', 'fuzzy']}
  />
);

export const SearchRankedResultsEnabledByDefault = (): JSX.Element => (
  <MaterialReactTable columns={columns} data={data} enableRowNumbers />
);

export const SearchDisableRankedResults = (): JSX.Element => (
  <MaterialReactTable columns={columns} data={data} enableGlobalFilterRankedResults={false} enableRowNumbers />
);

export const ShowSearchRightBoxByDefault = (): JSX.Element => (
  <MaterialReactTable columns={columns} data={data} initialState={{ showGlobalFilter: true }} />
);

export const ShowSearchBoxLeftByDefault = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    initialState={{ showGlobalFilter: true }}
    positionGlobalFilter="left"
  />
);

export const ShowSearchBoxLeftByDefaultWithSelection = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enableRowSelection
    initialState={{ showGlobalFilter: true }}
    positionGlobalFilter="left"
  />
);

export const JustASearchBox = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enableToolbarInternalActions={false}
    initialState={{ showGlobalFilter: true }}
  />
);

export const SearchDisabled = (): JSX.Element => (
  <MaterialReactTable columns={columns} data={data} enableGlobalFilter={false} />
);

export const CustomizeSearchTextBox = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    initialState={{ showGlobalFilter: true }}
    muiSearchTextFieldProps={{
      label: 'Search',
      placeholder: 'Search 100 rows',
      slotProps: { inputLabel: { shrink: true } },
      variant: 'outlined',
    }}
  />
);

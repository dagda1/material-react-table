import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react-vite';

import { MaterialReactTable, type MRT_ColumnDef } from '../../src';

const meta: Meta = {
  title: 'Features/Column Pinning Examples',
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
    accessorKey: 'email',
    header: 'Email Address',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
  {
    accessorKey: 'city',
    header: 'City',
  },
  {
    accessorKey: 'state',
    header: 'State',
  },
];

const data = [...Array(100)].map(() => ({
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  state: faker.location.state(),
}));

export const ColumnPinningEnabled = (): JSX.Element => (
  <MaterialReactTable columns={columns} data={data} enableColumnPinning />
);

export const ColumnPinningInitial = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enableColumnPinning
    initialState={{ columnPinning: { end: ['state'], start: ['email'] } }}
  />
);

export const ColumnPinningDisabledPerColumn = (): JSX.Element => (
  <MaterialReactTable
    columns={[
      {
        accessorKey: 'firstName',
        enablePinning: false,
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'email',
        header: 'Email Address',
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
      {
        accessorKey: 'city',
        header: 'City',
      },
      {
        accessorKey: 'state',
        header: 'State',
      },
    ]}
    data={data}
    enableColumnPinning
  />
);

export const ColumnPinningWithSelect = (): JSX.Element => (
  <MaterialReactTable columns={columns} data={data} enableColumnPinning enableRowSelection />
);

export const ColumnPinningWithDetailPanel = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enableColumnPinning
    enableExpanding
    renderDetailPanel={({ row: _row }) => <h1>Hi</h1>}
  />
);

import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react-vite';

import { MaterialReactTable, type MRT_ColumnDef } from '../../src';

const meta: Meta = {
  title: 'Styling/Table Alignment Examples',
};

export default meta;

const columns: MRT_ColumnDef<(typeof data)[0]>[] = [
  {
    accessorKey: 'firstName',
    footer: 'First Name',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    footer: 'Last Name',
    header: 'Last Name',
  },
  {
    accessorKey: 'age',
    footer: 'Age',
    header: 'Age',
  },
  {
    accessorKey: 'address',
    footer: 'Address',
    header: 'Address',
  },
  {
    accessorKey: 'state',
    footer: 'State',
    header: 'State',
  },
  {
    accessorKey: 'phoneNumber',
    footer: 'Phone Number',
    header: 'Phone Number',
  },
];

const data = [...Array(25)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int({ max: 60, min: 20 }),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
}));

export const DefaultLeft = (): JSX.Element => <MaterialReactTable columns={columns} data={data} />;

export const DefaultLeftGrid = (): JSX.Element => (
  <MaterialReactTable columns={columns} data={data} layoutMode="grid" />
);

export const RightCells = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    defaultColumn={{
      muiTableBodyCellProps: {
        align: 'right',
      },
      muiTableFooterCellProps: {
        align: 'right',
      },
      muiTableHeadCellProps: {
        align: 'right',
      },
    }}
  />
);

export const RightCellsGrid = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    defaultColumn={{
      muiTableBodyCellProps: {
        align: 'right',
      },
      muiTableFooterCellProps: {
        align: 'right',
      },
      muiTableHeadCellProps: {
        align: 'right',
      },
    }}
    layoutMode="grid"
  />
);

export const CenterCells = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    defaultColumn={{
      muiTableBodyCellProps: {
        align: 'center',
      },
      muiTableFooterCellProps: {
        align: 'center',
      },
      muiTableHeadCellProps: {
        align: 'center',
      },
    }}
  />
);

export const CenterCellsGrid = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    defaultColumn={{
      muiTableBodyCellProps: {
        align: 'center',
      },
      muiTableFooterCellProps: {
        align: 'center',
      },
      muiTableHeadCellProps: {
        align: 'center',
      },
    }}
    layoutMode="grid"
  />
);

export const CenterCellsWithGrabHandle = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    defaultColumn={{
      muiTableBodyCellProps: {
        align: 'center',
      },
      muiTableFooterCellProps: {
        align: 'center',
      },
      muiTableHeadCellProps: {
        align: 'center',
      },
    }}
    enableColumnDragging
  />
);

export const CenterCellsWithGrabHandleNoSorting = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    defaultColumn={{
      muiTableBodyCellProps: {
        align: 'center',
      },
      muiTableFooterCellProps: {
        align: 'center',
      },
      muiTableHeadCellProps: {
        align: 'center',
      },
    }}
    enableColumnDragging
    enableSorting={false}
  />
);

export const CenterCellsNoColumnActions = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    defaultColumn={{
      muiTableBodyCellProps: {
        align: 'center',
      },
      muiTableFooterCellProps: {
        align: 'center',
      },
      muiTableHeadCellProps: {
        align: 'center',
      },
    }}
    enableColumnActions={false}
  />
);

export const RightAlignNumberColumn = (): JSX.Element => (
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
        accessorKey: 'age',
        header: 'Age',
        muiTableBodyCellProps: {
          align: 'right',
        },
        muiTableHeadCellProps: {
          align: 'right',
        },
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
  />
);

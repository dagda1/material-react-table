import { faker } from '@faker-js/faker';
import Button from '@mui/material/Button';
import { type Meta } from '@storybook/react-vite';
import { useState } from 'react';

import { MaterialReactTable, type MRT_ColumnDef } from '../../src';

const meta: Meta = {
  title: 'Features/Row Pinning Examples',
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

const data = [...Array(50)].map(() => ({
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  state: faker.location.state(),
}));

export const RowPinningStickyDefaultEnabled = (): JSX.Element => (
  <MaterialReactTable columns={columns} data={data} enableRowPinning />
);

export const RowPinningEnabledConditionally = (): JSX.Element => {
  const [enableRowPinning, setEnableRowPinning] = useState(false);
  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      enableRowPinning={enableRowPinning}
      renderTopToolbarCustomActions={() => (
        <Button onClick={() => setEnableRowPinning(!enableRowPinning)}>Toggle Row Pinning</Button>
      )}
    />
  );
};

export const RowPinningStickyNoPagination = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    muiTableContainerProps={{
      sx: {
        maxHeight: '600px',
      },
    }}
  />
);

export const RowPinningStickyCustomRowHeight = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    muiTableBodyRowProps={{
      sx: {
        height: '100px',
      },
    }}
    muiTableContainerProps={{
      sx: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="sticky"
  />
);

export const RowPinningSelectStickyMode = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableRowSelection
    muiTableContainerProps={{
      sx: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="select-sticky"
  />
);

export const RowPinningTopAndBottomMode = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    muiTableContainerProps={{
      sx: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="top-and-bottom"
  />
);

export const RowPinningTopMode = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    keepPinnedRows={false}
    muiTableContainerProps={{
      sx: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="top"
  />
);

export const RowPinningSelectTopMode = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableRowSelection
    muiTableContainerProps={{
      sx: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="select-top"
  />
);

export const RowPinningBottomMode = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    muiTableContainerProps={{
      sx: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="bottom"
  />
);

export const RowPinningSelectBottomMode = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableRowSelection
    muiTableContainerProps={{
      sx: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="select-bottom"
  />
);

export const RowPinningWithStickyHeader = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableStickyFooter
    enableStickyHeader
    muiTableContainerProps={{
      sx: {
        maxHeight: '600px',
      },
    }}
  />
);

export const RowPinningWithGridLayout = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    layoutMode="grid"
    muiTableContainerProps={{
      sx: {
        maxHeight: '600px',
      },
    }}
  />
);

export const RowPinningStickyWithVirtualization = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableRowVirtualization
    muiTableContainerProps={{
      sx: {
        maxHeight: '600px',
      },
    }}
  />
);

export const RowPinningTopWithVirtualization = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableRowVirtualization
    muiTableContainerProps={{
      sx: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="top"
  />
);

export const RowAndColumnPinning = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enableColumnPinning
    enablePagination={false}
    enableRowPinning
    initialState={{
      columnPinning: {
        end: ['lastName'],
        start: ['firstName'],
      },
      rowPinning: {
        bottom: [],
        top: ['3', '5'],
      },
    }}
    muiTableContainerProps={{
      sx: {
        maxHeight: '600px',
      },
    }}
  />
);

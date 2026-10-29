import { faker } from '@faker-js/faker';
import Remove from '@mui/icons-material/Remove';
import Send from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { type Meta } from '@storybook/react-vite';
import { useCallback, useEffect, useState } from 'react';

import {
  getMRT_RowSelectionHandler,
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_RowSelectionState,
  MRT_SelectCheckbox,
  useMaterialReactTable,
} from '../../src';

const meta: Meta = {
  title: 'Features/Selection Examples',
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
];

const data = [...Array(15)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int(80),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
}));

export const SelectionEnabled = (): JSX.Element => (
  <MaterialReactTable columns={columns} data={data} enableRowNumbers enableRowSelection />
);

export const DisableSelectAll = (): JSX.Element => (
  <MaterialReactTable columns={columns} data={data} enableRowSelection enableSelectAll={false} />
);

export const SelectionEnabledGrid = (): JSX.Element => (
  <MaterialReactTable columns={columns} data={data} enableRowNumbers enableRowSelection layoutMode="grid" />
);

export const SelectionEnabledGridNoGrow = (): JSX.Element => (
  <MaterialReactTable columns={columns} data={data} enableRowNumbers enableRowSelection layoutMode="grid-no-grow" />
);

export const BatchSelectionDisabled = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enableBatchRowSelection={false}
    enableRowNumbers
    enableRowSelection
  />
);

export const SelectionEnabledConditionally = (): JSX.Element => (
  <MaterialReactTable columns={columns} data={data} enableRowSelection={(row) => row.original.age >= 21} />
);

export const SelectionEnabledConditionallyWithInitial = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enableRowSelection={(row) => row.original.age >= 21}
    initialState={{
      rowSelection: {
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true,
      },
    }}
  />
);

export const SelectionEnabledWithRowClick = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enableRowSelection
    muiTableBodyRowProps={({ row, staticRowIndex, table }) => ({
      onClick: (event) => getMRT_RowSelectionHandler({ row, staticRowIndex, table })(event),
      style: {
        cursor: 'pointer',
        userSelect: 'none',
      },
    })}
  />
);

export const ManualSelection = (): JSX.Element => {
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  console.info(rowSelection);

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      muiTableBodyRowProps={({ row }) => ({
        onClick: () =>
          setRowSelection(({ [row.id]: selected, ...rest }) => (selected ? rest : { ...rest, [row.id]: true })),
        selected: rowSelection[row.id],
        sx: {
          cursor: 'pointer',
        },
      })}
      state={{ rowSelection }}
    />
  );
};

export const SelectAllModeAll = (): JSX.Element => (
  <MaterialReactTable columns={columns} data={data} enableRowSelection selectAllMode="all" />
);

export const SelectAllModeAllConditionally = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enableRowSelection={(row) => row.original.age >= 21}
    selectAllMode="all"
  />
);

export const SelectAllModePage = (): JSX.Element => (
  <MaterialReactTable columns={columns} data={data} enableRowSelection selectAllMode="page" />
);

export const SelectAllDisabledCustomHeader = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    displayColumnDefOptions={{
      'mrt-row-select': { header: 'Your Custom Header' },
    }}
    enableRowSelection
    enableSelectAll={false}
  />
);

export const SingleSelectionRadio = (): JSX.Element => (
  <MaterialReactTable columns={columns} data={data} enableMultiRowSelection={false} enableRowSelection />
);

export const SingleSelectionRadioWithRowClick = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enableMultiRowSelection={false}
    enableRowSelection
    muiTableBodyRowProps={({ row }) => ({
      onClick: row.getToggleSelectedHandler(),
      sx: {
        cursor: 'pointer',
      },
    })}
  />
);

export const SelectCheckboxSecondaryColor = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enableRowSelection
    muiSelectCheckboxProps={{ color: 'secondary' }}
  />
);

export const AlertBannerBottom = (): JSX.Element => (
  <MaterialReactTable columns={columns} data={data} enableRowSelection positionToolbarAlertBanner="bottom" />
);

export const AlertBannerHeadOverlay = (): JSX.Element => (
  <MaterialReactTable columns={columns} data={data} enableRowSelection positionToolbarAlertBanner="head-overlay" />
);

export const CustomAlertBannerHeadOverlay = (): JSX.Element => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enableRowSelection
    muiToolbarAlertBannerProps={{
      color: 'info',
    }}
    positionToolbarAlertBanner="head-overlay"
    renderToolbarAlertBannerContent={({ selectedAlert, table }) => (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            gap: '6px',
            p: '4px 12px',
            width: '100%',
          }}
        >
          <MRT_SelectCheckbox table={table} /> {selectedAlert}{' '}
        </Box>
        <Box sx={{ display: 'flex', gap: '6px' }}>
          <Button color="success" startIcon={<Send />} variant="contained">
            Email
          </Button>
          <Button color="error" startIcon={<Remove />} variant="contained">
            Remove
          </Button>
        </Box>
      </Box>
    )}
  />
);

export const MultiSelectRowWithHoldShift = (): JSX.Element => {
  const [prevSelectedStaticRowIndex, setPrevSelectedStaticRowIndex] = useState<number>();

  //--------------------------------------------------
  const table = useMaterialReactTable({
    columns,
    data,
    enablePagination: false,
    enableRowSelection: (row) => row.original.age > 10,
    enableRowVirtualization: true,
    getRowId: (row) => row.firstName,
    muiSelectAllCheckboxProps: {
      onClick: () => setPrevSelectedStaticRowIndex(undefined),
    },
    muiSelectCheckboxProps: ({ row, staticRowIndex }) => ({
      onClick: (e) => {
        if (e.shiftKey) {
          if (!row.getCanSelect() || staticRowIndex === undefined) {
            return;
          }
          handleMultiRowSelectionWithShiftKey({
            rowId: row.id,
            rowIndex: staticRowIndex,
          });
          return;
        }
        setPrevSelectedStaticRowIndex(staticRowIndex);
      },
    }),
    muiTableBodyCellProps: { style: { userSelect: 'none' } },
    muiTableBodyRowProps: ({ row, staticRowIndex }) => ({
      onClick: (e) => {
        if (!e.shiftKey || !row.getCanSelect()) {
          return;
        }
        handleMultiRowSelectionWithShiftKey({
          rowId: row.id,
          rowIndex: staticRowIndex,
        });
      },
      sx: { cursor: 'pointer' },
    }),
    muiTableContainerProps: { sx: { height: '600px' } },
  });

  //--------------------------------------------------
  const handleMultiRowSelection = useCallback(
    (opts: { end: number; start: number }) => {
      const { end, start } = opts;
      const rows = table.getRowModel().rows;
      const res: MRT_RowSelectionState = {};
      for (let i = end; i >= start; i--) {
        if (!rows[i]?.getCanSelect()) {
          continue;
        }
        res[rows[i]['id']] = true;
      }
      table.setRowSelection((updater) => {
        return { ...updater, ...res };
      });
    },
    [table],
  );

  //--------------------------------------------------
  const handleMultiRowSelectionWithShiftKey = useCallback(
    (opts: { rowId: string; rowIndex: number }) => {
      const { rowId, rowIndex } = opts;
      if (prevSelectedStaticRowIndex === undefined) {
        table.setRowSelection((updater) => {
          return { ...updater, [rowId]: true };
        });
      } else {
        const start = Math.min(prevSelectedStaticRowIndex, rowIndex);
        const end = Math.max(prevSelectedStaticRowIndex, rowIndex);
        handleMultiRowSelection({ end, start });
      }
      setPrevSelectedStaticRowIndex(rowIndex);
    },
    [handleMultiRowSelection, prevSelectedStaticRowIndex, table],
  );

  // TODO: Reset prevSelectedStaticRowIndex when sorting changes
  useEffect(() => {
    setPrevSelectedStaticRowIndex(undefined);
  }, [table.state.sorting]);

  return <MaterialReactTable table={table} />;
};

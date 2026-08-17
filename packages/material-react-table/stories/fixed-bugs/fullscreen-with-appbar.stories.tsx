import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import { type Meta } from '@storybook/react-vite';

import {
  MaterialReactTable,
  type MRT_ColumnDef,
  useMaterialReactTable,
} from '../../src';

const meta: Meta = {
  title: 'Fixed Bugs/AppBar overlaps with Fullscreen Modal',
};

export default meta;

//example data type
type Person = {
  address: string;
  city: string;
  name: {
    firstName: string;
    lastName: string;
  };
  state: string;
};

//nested data is ok, see accessorKeys in ColumnDef below
const data: Person[] = [
  {
    address: '261 Erdman Ford',
    city: 'East Daphne',
    name: {
      firstName: 'John',
      lastName: 'Doe',
    },
    state: 'Kentucky',
  },
  {
    address: '769 Dominic Grove',
    city: 'Columbus',
    name: {
      firstName: 'Jane',
      lastName: 'Doe',
    },
    state: 'Ohio',
  },
  {
    address: '566 Brakus Inlet',
    city: 'South Linda',
    name: {
      firstName: 'Joe',
      lastName: 'Doe',
    },
    state: 'West Virginia',
  },
  {
    address: '722 Emie Stream',
    city: 'Lincoln',
    name: {
      firstName: 'Kevin',
      lastName: 'Vandy',
    },
    state: 'Nebraska',
  },
  {
    address: '32188 Larkin Turnpike',
    city: 'Omaha',
    name: {
      firstName: 'Joshua',
      lastName: 'Rolluffs',
    },
    state: 'Nebraska',
  },
];

const columns: MRT_ColumnDef<Person>[] = [
  {
    accessorKey: 'name.firstName', //access nested data with dot notation
    header: 'First Name',
    size: 150,
  },
  {
    accessorKey: 'name.lastName',
    header: 'Last Name',
    size: 150,
  },
  {
    accessorKey: 'address', //normal accessorKey
    header: 'Address',
    size: 200,
  },
  {
    accessorKey: 'city',
    header: 'City',
    size: 150,
  },
  {
    accessorKey: 'state',
    header: 'State',
    size: 150,
  },
];

export const FullscreenIsAboveAppbar = () => {
  const table = useMaterialReactTable({
    columns,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
  });

  return (
    <>
      <CssBaseline />
      <AppBar position="sticky">
        <Toolbar>
          <p>App</p>
        </Toolbar>
      </AppBar>
      <Box sx={{ padding: 2 }}>
        <MaterialReactTable table={table} />
      </Box>
    </>
  );
};

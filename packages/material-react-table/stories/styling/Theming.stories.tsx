import { faker } from '@faker-js/faker';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { type Meta } from '@storybook/react';

import { MaterialReactTable, type MRT_ColumnDef } from '../../src';

const meta: Meta = {
  title: 'Styling/Theming',
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

const data = [...Array(21)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int(80),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
}));

export const DefaultTheme = () => (
  <MaterialReactTable columns={columns} data={data} enableRowSelection />
);

export const CustomLightTheme = () => {
  const theme = createTheme({
    palette: {
      background: {
        default: '#ffffef',
      },
      primary: {
        main: '#ff9800',
      },
      secondary: {
        main: '#00bcd4',
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <MaterialReactTable columns={columns} data={data} enableRowSelection />
    </ThemeProvider>
  );
};

export const CustomDarkTheme = () => {
  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#81980f',
      },
      secondary: {
        main: '#00bcd4',
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <MaterialReactTable columns={columns} data={data} enableRowSelection />
    </ThemeProvider>
  );
};

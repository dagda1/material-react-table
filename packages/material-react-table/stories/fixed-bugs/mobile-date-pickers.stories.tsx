import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react-vite';

import { MaterialReactTable } from '../../src';

const meta: Meta = {
  title: 'Fixed Bugs/mobile date pickers',
};

export default meta;

const data = [...Array(120)].map(() => ({
  arrivalTime: faker.date.recent(),
  birthDate: faker.date.birthdate({ max: 2020, min: 1980, mode: 'age' }),
  deliverySlot: faker.date.recent(),
  departureTime: faker.date.recent(),
  hireDate: faker.date.birthdate({ max: 2024, min: 2011, mode: 'age' }),
  startTime: faker.date.recent(),
}));

export const MobileDateTimePickers = (): JSX.Element => (
  <MaterialReactTable
    columns={[
      {
        accessorFn: (row) => new Date(row.birthDate),
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleDateString(),
        filterFn: 'lessThan',
        filterVariant: 'date',
        header: 'Birth Date',
        id: 'birthDate',
      },
      {
        accessorFn: (row) => new Date(row.hireDate),
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleDateString(),
        filterVariant: 'date-range',
        header: 'Hire Date',
        id: 'hireDate',
      },
      {
        accessorFn: (row) => new Date(row.departureTime),
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleString(),
        filterVariant: 'datetime',
        header: 'Departure',
        id: 'departureTime',
      },
      {
        accessorFn: (row) => new Date(row.arrivalTime),
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleString(),
        filterVariant: 'datetime-range',
        header: 'Arrival time',
        id: 'arrivalTime',
      },
      {
        accessorFn: (row) => new Date(row.startTime),
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleString(),
        filterVariant: 'time',
        header: 'Start Time',
        id: 'startTime',
      },
      {
        accessorFn: (row) => new Date(row.deliverySlot),
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleString(),
        filterVariant: 'time-range',
        header: 'Delivery Slot',
        id: 'deliverySlot',
      },
    ]}
    data={data}
    initialState={{ showColumnFilters: true }}
  />
);

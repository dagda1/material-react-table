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

export const MobileDateTimePickers = () => (
  <MaterialReactTable
    columns={[
      {
        accessorFn: (row) => new Date(row.birthDate), //transform data before processing so sorting works
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleDateString(), //transform data to readable format for cell render
        filterFn: 'lessThan',
        filterVariant: 'date',
        header: 'Birth Date',
        id: 'birthDate',
      },
      {
        accessorFn: (row) => new Date(row.hireDate), //transform data before processing so sorting works
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleDateString(), //transform data to readable format for cell render
        filterVariant: 'date-range',
        header: 'Hire Date',
        id: 'hireDate',
      },
      {
        accessorFn: (row) => new Date(row.departureTime), //transform data before processing so sorting works
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleString(), //transform data to readable format for cell render
        filterVariant: 'datetime',
        header: 'Departure',
        id: 'departureTime',
      },
      {
        accessorFn: (row) => new Date(row.arrivalTime), //transform data before processing so sorting works
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleString(), //transform data to readable format for cell render
        filterVariant: 'datetime-range',
        header: 'Arrival time',
        id: 'arrivalTime',
      },
      {
        accessorFn: (row) => new Date(row.startTime), //transform data before processing so sorting works
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleString(), //transform data to readable format for cell render
        filterVariant: 'time',
        header: 'Start Time',
        id: 'startTime',
      },
      {
        accessorFn: (row) => new Date(row.deliverySlot), //transform data before processing so sorting works
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleString(), //transform data to readable format for cell render
        filterVariant: 'time-range',
        header: 'Delivery Slot',
        id: 'deliverySlot',
      },
    ]}
    data={data}
    initialState={{ showColumnFilters: true }}
  />
);

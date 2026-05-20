import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';

import { MaterialReactTable } from './components/table/MaterialReactTable';
import { type MRT_ColumnDef } from './types';

interface Person {
  age: number;
  name: string;
}

const data: Person[] = [
  { age: 30, name: 'John' },
  { age: 25, name: 'Sara' },
  { age: 42, name: 'Aaron' },
];

const columns: MRT_ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'age', header: 'Age' },
];

describe('MaterialReactTable smoke', () => {
  test('renders headers and rows from props', () => {
    render(<MaterialReactTable columns={columns} data={data} />);

    expect(
      screen.getByRole('columnheader', { name: /name/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /age/i }),
    ).toBeInTheDocument();

    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Sara')).toBeInTheDocument();
    expect(screen.getByText('Aaron')).toBeInTheDocument();
  });

  test('sorts rows when a sortable header is clicked', async () => {
    const user = userEvent.setup();

    render(<MaterialReactTable columns={columns} data={data} />);

    const nameHeader = screen.getByRole('columnheader', { name: /name/i });
    const sortButton = within(nameHeader).getByRole('button');

    await user.click(sortButton);

    const rows = screen.getAllByRole('row');
    const firstDataRow = rows[1];
    expect(within(firstDataRow).getByText('Aaron')).toBeInTheDocument();
  });
});

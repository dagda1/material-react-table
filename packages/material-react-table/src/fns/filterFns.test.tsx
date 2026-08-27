import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { MaterialReactTable } from '../components/MaterialReactTable';
import { type MRT_ColumnDef } from '../types';

interface Person {
  name: string;
}

const data: Person[] = [
  { name: 'Jonathan' },
  { name: 'John' },
  { name: 'Sara' },
  { name: 'Aaron' },
];

const columns: MRT_ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
];

const renderedNames = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('tbody tr')).map(
    (row) => row.textContent,
  );

describe('fuzzy global filter', () => {
  test('keeps rows whose value matches the term and drops the rest', () => {
    render(
      <MaterialReactTable
        columns={columns}
        data={data}
        initialState={{ globalFilter: 'john' }}
      />,
    );

    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Jonathan')).toBeInTheDocument();
    expect(screen.queryByText('Sara')).not.toBeInTheDocument();
    expect(screen.queryByText('Aaron')).not.toBeInTheDocument();
  });

  test('orders matches by rank rather than by source order', () => {
    const { container } = render(
      <MaterialReactTable
        columns={columns}
        data={data}
        initialState={{ globalFilter: 'john' }}
      />,
    );

    expect(renderedNames(container)).toEqual(['John', 'Jonathan']);
  });

  test('falls back to source order when ranked results are disabled', () => {
    const { container } = render(
      <MaterialReactTable
        columns={columns}
        data={data}
        enableGlobalFilterRankedResults={false}
        initialState={{ globalFilter: 'john' }}
      />,
    );

    expect(renderedNames(container)).toEqual(['Jonathan', 'John']);
  });

  test('drops every row when no value matches the term', () => {
    const { container } = render(
      <MaterialReactTable
        columns={columns}
        data={data}
        initialState={{ globalFilter: 'zzz' }}
      />,
    );

    expect(renderedNames(container)).toEqual(['No results found']);
  });
});

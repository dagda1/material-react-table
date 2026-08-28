import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { MaterialReactTable } from '../components/MaterialReactTable';
import { type MRT_ColumnDef } from '../types';

interface Person {
  name: string;
}

const data: Person[] = [
  { name: 'Jonathan' },
  { name: 'Aaron' },
  { name: 'Sara' },
];

const columns: MRT_ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
];

const renderedNames = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('tbody tr')).map(
    (row) => row.textContent,
  );

describe('server-side options suppress client-side row models', () => {
  test('manualPagination renders the whole server page, ignoring pageSize', () => {
    const { container } = render(
      <MaterialReactTable
        columns={columns}
        data={data}
        manualPagination
        rowCount={300}
        state={{ pagination: { pageIndex: 0, pageSize: 2 } }}
      />,
    );

    expect(renderedNames(container)).toEqual(['Jonathan', 'Aaron', 'Sara']);
  });

  test('manualFiltering keeps every row when a global filter is set', () => {
    const { container } = render(
      <MaterialReactTable
        columns={columns}
        data={data}
        manualFiltering
        state={{ globalFilter: 'zzz' }}
      />,
    );

    expect(renderedNames(container)).toEqual(['Jonathan', 'Aaron', 'Sara']);
  });

  test('manualSorting preserves server order when a sort is set', () => {
    const { container } = render(
      <MaterialReactTable
        columns={columns}
        data={data}
        enableSorting
        manualSorting
        state={{ sorting: [{ desc: false, id: 'name' }] }}
      />,
    );

    expect(renderedNames(container)).toEqual(['Jonathan', 'Aaron', 'Sara']);
  });
});

describe('client-side row models stay active by default', () => {
  test('pagination slices to pageSize', () => {
    const { container } = render(
      <MaterialReactTable
        columns={columns}
        data={data}
        state={{ pagination: { pageIndex: 0, pageSize: 2 } }}
      />,
    );

    expect(renderedNames(container)).toEqual(['Jonathan', 'Aaron']);
  });

  test('global filter drops non-matching rows', () => {
    const { container } = render(
      <MaterialReactTable
        columns={columns}
        data={data}
        state={{ globalFilter: 'zzz' }}
      />,
    );

    expect(renderedNames(container)).toEqual(['No results found']);
  });

  test('sorting reorders rows', () => {
    const { container } = render(
      <MaterialReactTable
        columns={columns}
        data={data}
        enableSorting
        state={{ sorting: [{ desc: false, id: 'name' }] }}
      />,
    );

    expect(renderedNames(container)).toEqual(['Aaron', 'Jonathan', 'Sara']);
  });
});

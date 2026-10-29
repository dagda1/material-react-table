import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { MaterialReactTable } from '../components/MaterialReactTable';
import { type MRT_ColumnDef } from '../types';

interface Person {
  age: number;
  name: string;
}

const data: Person[] = [
  { age: 30, name: 'John' },
  { age: 25, name: 'Sara' },
];

const columns: MRT_ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'age', header: 'Age' },
];

describe('pinned rows', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('the table stops re-rendering after mount', () => {
    const muiTablePaperProps = vi.fn(() => ({}));

    render(
      <MaterialReactTable
        columns={columns}
        data={data}
        enableRowPinning
        initialState={{ rowPinning: { bottom: [], top: ['0'] } }}
        muiTablePaperProps={muiTablePaperProps}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    const settledRenders = muiTablePaperProps.mock.calls.length;

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(muiTablePaperProps).toHaveBeenCalledTimes(settledRenders);
  });
});

describe('controlled state effects', () => {
  test('does not reset the column order again when the table re-renders', () => {
    const onColumnOrderChange = vi.fn();
    const table = (isLoading: boolean) => (
      <MaterialReactTable
        columns={columns}
        data={data}
        onColumnOrderChange={onColumnOrderChange}
        state={{ columnOrder: ['name'], isLoading }}
      />
    );
    const { rerender } = render(table(false));
    const mountCalls = onColumnOrderChange.mock.calls.length;

    rerender(table(true));
    rerender(table(false));

    expect(onColumnOrderChange).toHaveBeenCalledTimes(mountCalls);
  });

  test('does not clamp the page index again when the table re-renders', () => {
    const onPaginationChange = vi.fn();
    const table = (showProgressBars: boolean) => (
      <MaterialReactTable
        columns={columns}
        data={data}
        onPaginationChange={onPaginationChange}
        state={{ pagination: { pageIndex: 5, pageSize: 10 }, showProgressBars }}
      />
    );
    const { rerender } = render(table(false));
    const mountCalls = onPaginationChange.mock.calls.length;

    rerender(table(true));
    rerender(table(false));

    expect(onPaginationChange).toHaveBeenCalledTimes(mountCalls);
  });

  test('does not clear the sorting again when the table re-renders', () => {
    const onSortingChange = vi.fn();
    const table = (showProgressBars: boolean) => (
      <MaterialReactTable
        columns={columns}
        data={data}
        onSortingChange={onSortingChange}
        state={{ globalFilter: 'John', showProgressBars, sorting: [] }}
      />
    );
    const { rerender } = render(table(false));
    const mountCalls = onSortingChange.mock.calls.length;

    rerender(table(true));
    rerender(table(false));

    expect(onSortingChange).toHaveBeenCalledTimes(mountCalls);
  });
});

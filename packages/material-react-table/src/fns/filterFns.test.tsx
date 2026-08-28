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

interface Employee {
  age: number;
  name: string;
}

const employees: Employee[] = [
  { age: 30, name: 'Alice' },
  { age: 20, name: 'Bob' },
  { age: 40, name: 'alice' },
];

const employeeColumns = (): MRT_ColumnDef<Employee>[] => [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'age', header: 'Age' },
];

const renderFiltered = (
  columnId: string,
  filterFn: string,
  value: unknown,
) => {
  const { container } = render(
    <MaterialReactTable
      columns={employeeColumns()}
      data={employees}
      initialState={{
        columnFilterFns: { [columnId]: filterFn },
        columnFilters: [{ id: columnId, value }],
      }}
    />,
  );
  return Array.from(container.querySelectorAll('tbody tr')).map(
    (row) => row.querySelector('td')?.textContent,
  );
};

describe('column filter fns', () => {
  test.each([
    ['contains', 'ali', ['Alice', 'alice']],
    ['startsWith', 'al', ['Alice', 'alice']],
    ['endsWith', 'ce', ['Alice', 'alice']],
    ['equals', 'alice', ['Alice', 'alice']],
    ['notEquals', 'alice', ['Bob']],
    ['fuzzy', 'bob', ['Bob']],
    ['includesString', 'ali', ['Alice', 'alice']],
    ['includesStringSensitive', 'ali', ['alice']],
    ['equalsString', 'alice', ['Alice', 'alice']],
    ['equalsStringSensitive', 'alice', ['alice']],
  ])('%s filters the name column', (filterFn, value, expected) => {
    expect(renderFiltered('name', filterFn, value)).toEqual(expected);
  });

  test.each([
    ['greaterThan', 25, ['Alice', 'alice']],
    ['greaterThanOrEqualTo', 30, ['Alice', 'alice']],
    ['lessThan', 30, ['Bob']],
    ['lessThanOrEqualTo', 20, ['Bob']],
  ])('%s filters the age column', (filterFn, value, expected) => {
    expect(renderFiltered('age', filterFn, value)).toEqual(expected);
  });

  test.each([
    ['between', [25, 45], ['Alice', 'alice']],
    ['betweenInclusive', [20, 30], ['Alice', 'Bob']],
    ['inNumberRange', [20, 30], ['Alice', 'Bob']],
  ])('%s filters the age column by range', (filterFn, value, expected) => {
    expect(renderFiltered('age', filterFn, value)).toEqual(expected);
  });

  test.each([
    ['empty', ['No results found']],
    ['notEmpty', ['Alice', 'Bob', 'alice']],
  ])('%s applies to the name column', (filterFn, expected) => {
    expect(renderFiltered('name', filterFn, 'x')).toEqual(expected);
  });
});

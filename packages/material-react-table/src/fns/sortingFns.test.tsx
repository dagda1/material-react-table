import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { MaterialReactTable } from '../components/MaterialReactTable';
import { type MRT_ColumnDef } from '../types';

interface Item {
  code: string;
  count: number;
}

const items: Item[] = [
  { code: 'item10', count: 100 },
  { code: 'item9', count: 9 },
  { code: 'item100', count: 10 },
];

const renderSorted = (columnId: keyof Item, sortFn: string) => {
  const columns: MRT_ColumnDef<Item>[] = [
    { accessorKey: 'code', header: 'Code' },
    { accessorKey: 'count', header: 'Count' },
  ].map((column) => (column.accessorKey === columnId ? { ...column, sortFn } : column));

  const { container } = render(
    <MaterialReactTable columns={columns} data={items} initialState={{ sorting: [{ desc: false, id: columnId }] }} />,
  );

  return Array.from(container.querySelectorAll('tbody tr')).map((row) => row.querySelector('td')?.textContent);
};

describe('sort fns', () => {
  test('alphanumericCaseSensitive sorts the numbers inside the code', () => {
    expect(renderSorted('code', 'alphanumericCaseSensitive')).toEqual(['item9', 'item10', 'item100']);
  });

  test('textCaseSensitive sorts the count as text', () => {
    expect(renderSorted('count', 'textCaseSensitive')).toEqual(['item100', 'item10', 'item9']);
  });
});

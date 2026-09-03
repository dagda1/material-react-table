import { fireEvent, render } from '@testing-library/react';
import { expect, test } from 'vitest';
import { type MRT_ColumnDef } from '../../types';
import { MaterialReactTable } from '../MaterialReactTable';
interface P { city: string; name: string }
const data: P[] = [{ city: 'Glasgow', name: 'Alice' }];
const cols: MRT_ColumnDef<P>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'city', header: 'City' },
];
test('dbg', () => {
  const { container } = render(<MaterialReactTable columns={cols} data={data} enableColumnResizing />);
  const th = container.querySelector('thead th') as HTMLElement;
  console.log('TH', { style: th.getAttribute('style'), cls: th.className, computed: getComputedStyle(th).width });
  console.log('HANDLES', container.querySelectorAll('thead [class*=ResizeHandle]').length);
  expect(true).toBe(true);
});

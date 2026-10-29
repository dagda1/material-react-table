import { fireEvent, render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { type MRT_ColumnDef } from '../../types';
import { MaterialReactTable } from '../MaterialReactTable';

interface Person {
  city: string;
  name: string;
}

const data: Person[] = [{ city: 'Glasgow', name: 'Alice' }];

const columns = (): MRT_ColumnDef<Person>[] => [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'city', header: 'City' },
];

const nameColumnSize = (container: HTMLElement) =>
  (container.querySelector('table') as HTMLElement).style.getPropertyValue('--header-name-size');

describe('column resizing', () => {
  test('dragging the resize handle widens the column', () => {
    const { container } = render(<MaterialReactTable columns={columns()} data={data} enableColumnResizing />);

    const before = nameColumnSize(container);
    const handle = container.querySelector('thead .Mui-TableHeadCell-ResizeHandle-Wrapper') as HTMLElement;

    fireEvent.mouseDown(handle, { clientX: 0 });
    fireEvent.mouseMove(document, { clientX: 120 });
    fireEvent.mouseUp(document, { clientX: 120 });

    expect(nameColumnSize(container)).not.toBe(before);
  });
});

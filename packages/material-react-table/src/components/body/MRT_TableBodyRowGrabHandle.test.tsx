import { fireEvent, render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { type MRT_ColumnDef } from '../../types';
import { MaterialReactTable } from '../MaterialReactTable';

interface Person {
  name: string;
}

const data: Person[] = [{ name: 'Alice' }, { name: 'Bob' }];

const columns = (): MRT_ColumnDef<Person>[] => [{ accessorKey: 'name', header: 'Name' }];

describe('row ordering', () => {
  test('dragging a row over another reports both rows to the drop handler', () => {
    const muiRowDragHandleProps = { onDragEnd: vi.fn() };
    const { container } = render(
      <MaterialReactTable
        columns={columns()}
        data={data}
        enableRowOrdering
        muiRowDragHandleProps={muiRowDragHandleProps}
      />,
    );

    const handles = container.querySelectorAll<HTMLElement>('tbody button[aria-label="Move"]');
    const rows = container.querySelectorAll<HTMLElement>('tbody tr');

    fireEvent.dragStart(handles[0], {
      dataTransfer: { setDragImage: () => {} },
    });
    fireEvent.dragEnter(rows[1]);
    fireEvent.dragEnd(handles[0]);

    expect(muiRowDragHandleProps.onDragEnd).toHaveBeenCalled();
  });
});

import { fireEvent, render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { type MRT_ColumnDef } from '../../types';
import { MaterialReactTable } from '../MaterialReactTable';

interface Person {
  city: string;
  name: string;
}

const data: Person[] = [
  { city: 'Glasgow', name: 'Alice' },
  { city: 'Glasgow', name: 'Bob' },
];

const columns = (): MRT_ColumnDef<Person>[] => [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'city', header: 'City' },
];

describe('grouping drop zone', () => {
  test('dropping a column on it groups by that column', () => {
    const { container } = render(<MaterialReactTable columns={columns()} data={data} enableGrouping />);

    const handle = container.querySelector('thead button[aria-label="Move"]') as HTMLElement;

    fireEvent.dragStart(handle, {
      dataTransfer: { setDragImage: () => {} },
    });
    fireEvent.dragEnter(container.querySelector('[class*="ToolbarDropZone"]') as HTMLElement);
    fireEvent.dragEnd(handle);

    expect(container.textContent).toContain('Grouped by');
  });
});

describe('controlled drop zone', () => {
  test('does not call onShowToolbarDropZoneChange when the table re-renders', () => {
    const onShowToolbarDropZoneChange = vi.fn();
    const table = (isLoading: boolean) => (
      <MaterialReactTable
        columns={columns()}
        data={data}
        enableGrouping
        onShowToolbarDropZoneChange={(showToolbarDropZone) => onShowToolbarDropZoneChange(showToolbarDropZone)}
        state={{ isLoading, showToolbarDropZone: false }}
      />
    );
    const { rerender } = render(table(false));
    onShowToolbarDropZoneChange.mockClear();

    rerender(table(true));
    rerender(table(false));

    expect(onShowToolbarDropZoneChange).not.toHaveBeenCalled();
  });
});

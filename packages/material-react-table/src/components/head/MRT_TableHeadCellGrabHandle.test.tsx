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

const headerOrder = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('thead th')).map((th) =>
    th.textContent?.replace(/[^A-Za-z]/g, ''),
  );

const dragColumnOnto = (container: HTMLElement, from: string, to: string) => {
  const handles = Array.from(
    container.querySelectorAll<HTMLElement>('thead [aria-label="Move"]'),
  );
  const headerCells = Array.from(
    container.querySelectorAll<HTMLElement>('thead th'),
  );
  const fromIndex = headerCells.findIndex((th) =>
    th.textContent?.includes(from),
  );
  const toIndex = headerCells.findIndex((th) => th.textContent?.includes(to));

  fireEvent.dragStart(handles[fromIndex], {
    dataTransfer: { setDragImage: () => {} },
  });
  fireEvent.dragEnter(headerCells[toIndex]);
  fireEvent.dragOver(headerCells[toIndex]);
  fireEvent.drop(headerCells[toIndex]);
  fireEvent.dragEnd(handles[fromIndex]);
};

describe('column dragging', () => {
  test('reorders columns when one is dragged onto another', () => {
    const { container } = render(
      <MaterialReactTable
        columns={columns()}
        data={data}
        enableColumnOrdering
      />,
    );

    expect(headerOrder(container)).toEqual(['Name', 'City']);

    dragColumnOnto(container, 'Name', 'City');

    expect(headerOrder(container)).toEqual(['City', 'Name']);
  });
});

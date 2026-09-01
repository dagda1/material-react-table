import { act, fireEvent, render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { type MRT_ColumnDef } from '../../types';
import { MaterialReactTable } from '../MaterialReactTable';

interface Person {
  name: string;
}

const data: Person[] = [{ name: 'Alice' }];

const columns = (): MRT_ColumnDef<Person>[] => [
  { accessorKey: 'name', header: 'Name' },
];

describe('row editing', () => {
  test('opens the edit modal when the edit button is clicked', () => {
    const { baseElement, container } = render(
      <MaterialReactTable
        columns={columns()}
        data={data}
        editDisplayMode="modal"
        enableEditing
      />,
    );

    act(() => {
      fireEvent.click(
        container.querySelector('[aria-label="Edit"]') as HTMLElement,
      );
    });

    expect(baseElement.querySelectorAll('input').length).toBeGreaterThan(0);
  });

  test('opens inline inputs when editDisplayMode is row', () => {
    const { container } = render(
      <MaterialReactTable
        columns={columns()}
        data={data}
        editDisplayMode="row"
        enableEditing
      />,
    );

    act(() => {
      fireEvent.click(
        container.querySelector('[aria-label="Edit"]') as HTMLElement,
      );
    });

    expect(container.querySelectorAll('tbody input').length).toBeGreaterThan(0);
  });
});

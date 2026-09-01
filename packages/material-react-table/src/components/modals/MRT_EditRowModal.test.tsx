import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
  test('opens the edit modal when the edit button is clicked', async () => {
    const user = userEvent.setup();
    const { baseElement, container } = render(
      <MaterialReactTable
        columns={columns()}
        data={data}
        editDisplayMode="modal"
        enableEditing
      />,
    );

    await user.click(
      container.querySelector('[aria-label="Edit"]') as HTMLElement,
    );

    expect(baseElement.querySelectorAll('input').length).toBeGreaterThan(0);
  });

  test('opens inline inputs when editDisplayMode is row', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <MaterialReactTable
        columns={columns()}
        data={data}
        editDisplayMode="row"
        enableEditing
      />,
    );

    await user.click(
      container.querySelector('[aria-label="Edit"]') as HTMLElement,
    );

    expect(container.querySelectorAll('tbody input').length).toBeGreaterThan(0);
  });
});

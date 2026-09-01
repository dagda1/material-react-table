import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { type MRT_ColumnDef, type MRT_TableInstance } from '../../types';
import { MaterialReactTable } from '../MaterialReactTable';

interface Person {
  name: string;
}

const data: Person[] = [{ name: 'Alice' }];

const columns = (): MRT_ColumnDef<Person>[] => [
  { accessorKey: 'name', header: 'Name' },
];

describe('creating a row', () => {
  test('calls onCreatingRowSave when save is clicked', async () => {
    const user = userEvent.setup();
    const onCreatingRowSave = vi.fn();
    let table: MRT_TableInstance<Person> | undefined;

    const { container } = render(
      <MaterialReactTable
        columns={columns()}
        createDisplayMode="row"
        data={data}
        enableEditing
        onCreatingRowSave={onCreatingRowSave}
        renderTopToolbarCustomActions={({ table: t }) => {
          table = t;
          return null;
        }}
      />,
    );

    act(() => {
      table?.setCreatingRow(true);
    });

    expect(container.querySelectorAll('tbody input').length).toBeGreaterThan(0);

    await user.click(
      container.querySelector('[aria-label="Save"]') as HTMLElement,
    );

    expect(onCreatingRowSave).toHaveBeenCalled();
  });
});

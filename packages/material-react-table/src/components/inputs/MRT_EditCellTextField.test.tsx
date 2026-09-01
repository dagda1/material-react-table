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

describe('cell editing', () => {
  test('opens a text field in the cell that was clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <MaterialReactTable
        columns={columns()}
        data={data}
        editDisplayMode="cell"
        enableEditing
      />,
    );

    expect(container.querySelectorAll('tbody input')).toHaveLength(0);

    await user.dblClick(container.querySelector('tbody td') as HTMLElement);

    expect(container.querySelectorAll('tbody input')).toHaveLength(1);
  });
});

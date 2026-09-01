import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
];

describe('detail panel', () => {
  test('reveals the panel content when the expand button is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <MaterialReactTable
        columns={columns()}
        data={data}
        renderDetailPanel={({ row }) => (
          <span>Lives in {row.original.city}</span>
        )}
      />,
    );

    expect(container.textContent).not.toContain('Lives in Glasgow');

    await user.click(
      container.querySelector('tbody button[aria-label="Expand"]') as HTMLElement,
    );

    expect(container.textContent).toContain('Lives in Glasgow');
  });
});

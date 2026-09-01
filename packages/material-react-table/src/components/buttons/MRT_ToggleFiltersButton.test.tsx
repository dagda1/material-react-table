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

const filterInputCount = (container: HTMLElement) =>
  container.querySelectorAll('thead input').length;

describe('filters toggle', () => {
  test('reveals the column filter inputs when clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <MaterialReactTable columns={columns()} data={data} />,
    );

    expect(filterInputCount(container)).toBe(0);

    await user.click(
      container.querySelector(
        '[aria-label="Show/Hide filters"]',
      ) as HTMLElement,
    );

    expect(filterInputCount(container)).toBeGreaterThan(0);
  });
});

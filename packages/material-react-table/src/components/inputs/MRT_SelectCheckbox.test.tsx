import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';

import { type MRT_ColumnDef } from '../../types';
import { MaterialReactTable } from '../MaterialReactTable';

interface Person {
  name: string;
}

const data: Person[] = [{ name: 'Alice' }, { name: 'Bob' }];

const columns = (): MRT_ColumnDef<Person>[] => [
  { accessorKey: 'name', header: 'Name' },
];

const selectAll = (container: HTMLElement) =>
  container.querySelector('thead input[type="checkbox"]') as HTMLInputElement;

const rowBoxes = (container: HTMLElement) =>
  Array.from(
    container.querySelectorAll<HTMLInputElement>(
      'tbody input[type="checkbox"]',
    ),
  );

const renderTable = () =>
  render(<MaterialReactTable columns={columns()} data={data} enableRowSelection />);

describe('row selection checkboxes', () => {
  test('select all checks every row', async () => {
    const user = userEvent.setup();
    const { container } = renderTable();

    await user.click(selectAll(container));

    expect(rowBoxes(container).map((box) => box.checked)).toEqual([true, true]);
    expect(selectAll(container).checked).toBe(true);
  });

  test('select all is indeterminate when only some rows are selected', async () => {
    const user = userEvent.setup();
    const { container } = renderTable();

    await user.click(rowBoxes(container)[0]);

    expect(selectAll(container).checked).toBe(false);
    expect(selectAll(container).dataset.indeterminate).toBe('true');
  });

  test('select all is not indeterminate when every row is selected', async () => {
    const user = userEvent.setup();
    const { container } = renderTable();

    await user.click(selectAll(container));

    expect(selectAll(container).dataset.indeterminate).toBe('false');
  });

  test('clicking a row checkbox toggles only that row', async () => {
    const user = userEvent.setup();
    const { container } = renderTable();

    await user.click(rowBoxes(container)[0]);

    expect(rowBoxes(container).map((box) => box.checked)).toEqual([true, false]);
  });
});

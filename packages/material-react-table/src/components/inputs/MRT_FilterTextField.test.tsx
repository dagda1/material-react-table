import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';

import { type MRT_ColumnDef } from '../../types';
import { MaterialReactTable } from '../MaterialReactTable';

interface Person {
  city: string;
  name: string;
}

const data: Person[] = [
  { city: 'Glasgow', name: 'Alice' },
  { city: 'Dundee', name: 'Bob' },
  { city: 'Glasgow', name: 'Cara' },
];

const columns = (): MRT_ColumnDef<Person>[] => [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'city', filterVariant: 'select', header: 'City' },
];

describe('faceted select filter', () => {
  test('offers the distinct values present in the data', async () => {
    const user = userEvent.setup();
    const { baseElement, container } = render(
      <MaterialReactTable
        columns={columns()}
        data={data}
        enableFacetedValues
        initialState={{ showColumnFilters: true }}
      />,
    );

    const selects = container.querySelectorAll<HTMLElement>(
      'thead [role="combobox"]',
    );

    await user.click(selects[selects.length - 1]);

    const options = Array.from(
      baseElement.querySelectorAll<HTMLElement>('li[role="option"]'),
    ).map((li) => li.textContent);

    expect(options).toContain('Glasgow (2)');
    expect(options).toContain('Dundee (1)');
  });

  test('picking an option filters the rows', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <MaterialReactTable
        columns={columns()}
        data={data}
        enableFacetedValues
        initialState={{ showColumnFilters: true }}
      />,
    );

    const selects = container.querySelectorAll<HTMLElement>(
      'thead [role="combobox"]',
    );

    await user.click(selects[selects.length - 1]);
    await user.keyboard('{ArrowDown}{Enter}');

    await waitFor(() => {
      const names = Array.from(container.querySelectorAll('tbody tr')).map(
        (tr) => tr.querySelector('td')?.textContent,
      );
      expect(names).toEqual(['Alice', 'Cara']);
    });
  });
});

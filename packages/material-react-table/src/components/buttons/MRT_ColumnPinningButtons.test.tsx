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
  { accessorKey: 'city', header: 'City' },
];

const headerOrder = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('thead th')).map((th) =>
    th.textContent?.replace(/[^A-Za-z]/g, ''),
  );

describe('column pinning', () => {
  test('pinning to start moves the column to the front', async () => {
    const user = userEvent.setup();
    const { baseElement, container } = render(
      <MaterialReactTable
        columns={columns()}
        data={data}
        enableColumnPinning
      />,
    );

    expect(headerOrder(container)).toEqual(['Name', 'City']);

    const cityHeader = Array.from(
      container.querySelectorAll<HTMLElement>('thead th'),
    ).find((th) => th.textContent?.includes('City'));

    await user.click(
      cityHeader?.querySelector(
        'button[aria-label="Column Actions"]',
      ) as HTMLElement,
    );

    await user.click(
      Array.from(baseElement.querySelectorAll<HTMLElement>('li')).find((li) =>
        li.textContent?.includes('Pin to left'),
      ) as HTMLElement,
    );

    expect(headerOrder(container)).toEqual(['City', 'Name']);
  });

  test('start and end pinning both apply from initial state', () => {
    const { container } = render(
      <MaterialReactTable
        columns={columns()}
        data={data}
        enableColumnPinning
        initialState={{ columnPinning: { end: ['name'], start: ['city'] } }}
      />,
    );

    expect(headerOrder(container)).toEqual(['City', 'Name']);
  });
});

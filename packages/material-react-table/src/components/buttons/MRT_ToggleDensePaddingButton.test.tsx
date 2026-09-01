import { fireEvent, render } from '@testing-library/react';
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

const bodyCellPadding = (container: HTMLElement) =>
  getComputedStyle(
    container.querySelector('tbody td') as HTMLElement,
  ).getPropertyValue('padding');

describe('density toggle', () => {
  test('changes body cell padding when clicked', () => {
    const { container } = render(
      <MaterialReactTable columns={columns()} data={data} />,
    );

    const before = bodyCellPadding(container);

    fireEvent.click(
      container.querySelector('[aria-label="Toggle density"]') as HTMLElement,
    );

    expect(bodyCellPadding(container)).not.toBe(before);
  });
});

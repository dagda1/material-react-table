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

describe('full screen toggle', () => {
  test('fixes the table paper to the viewport when clicked', () => {
    const { container } = render(
      <MaterialReactTable columns={columns()} data={data} />,
    );

    const paper = container.firstElementChild as HTMLElement;
    expect(getComputedStyle(paper).position).not.toBe('fixed');

    fireEvent.click(
      container.querySelector(
        '[aria-label="Toggle full screen"]',
      ) as HTMLElement,
    );

    expect(getComputedStyle(paper).position).toBe('fixed');
  });
});

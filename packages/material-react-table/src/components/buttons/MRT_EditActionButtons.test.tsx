import { act, fireEvent, render } from '@testing-library/react';
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

const clickByLabel = (container: HTMLElement, label: string) =>
  fireEvent.click(
    container.querySelector(`[aria-label="${label}"]`) as HTMLElement,
  );

describe('creating a row', () => {
  test('calls onCreatingRowSave when save is clicked', () => {
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

    clickByLabel(container, 'Save');

    expect(onCreatingRowSave).toHaveBeenCalled();
  });
});

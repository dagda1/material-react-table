import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';

import { type MRT_ColumnDef } from '../../types';
import { MaterialReactTable } from '../MaterialReactTable';

interface Person {
  city: string;
  name: string;
}

const data: Person[] = [{ city: 'Glasgow', name: 'Alice' }];

const columns: MRT_ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'city', header: 'City' },
];

const headerOrder = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('thead th')).map((th) => th.textContent?.replace(/[^A-Za-z]/g, ''));

describe('show/hide columns menu', () => {
  test('dragging a column onto another reorders the table columns', async () => {
    const user = userEvent.setup();
    const { container } = render(<MaterialReactTable columns={columns} data={data} enableColumnOrdering />);

    await user.click(screen.getByRole('button', { name: 'Show/Hide columns' }));

    const menu = screen.getByRole('menu');
    const nameItem = within(menu).getByText('Name').closest('li') as HTMLElement;
    const cityItem = within(menu).getByText('City').closest('li') as HTMLElement;
    const nameHandle = within(nameItem).getByRole('button', { name: 'Move' });

    fireEvent.dragStart(nameHandle, {
      dataTransfer: { setDragImage: () => {} },
    });
    fireEvent.dragEnter(cityItem);
    fireEvent.dragEnd(nameHandle);

    expect(headerOrder(container)).toEqual(['City', 'Name']);
  });
});

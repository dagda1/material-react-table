import { render } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { MaterialReactTable } from '../MaterialReactTable';

test('probe', () => {
  const observed: Element[] = [];
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe(el: Element) {
        observed.push(el);
      }
      disconnect() {}
      unobserve() {}
    },
  );
  const spy = vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (this: HTMLElement) {
    return this.parentElement?.classList.contains('MuiPaper-root') && !this.classList.contains('MuiTableContainer-root')
      ? 50
      : 0;
  });
  const { container } = render(
    <MaterialReactTable columns={[{ accessorKey: 'a', header: 'A' }]} data={[{ a: 1 }]} enableStickyHeader />,
  );
  const tc = container.querySelector('.MuiTableContainer-root') as HTMLElement;
  const paper = container.querySelector('.MuiPaper-root') as HTMLElement;
  const top = paper.firstElementChild;
  const bottom = paper.lastElementChild;
  console.log(
    'TOP observed',
    observed.includes(top!),
    'BOTTOM observed',
    observed.includes(bottom!),
    'count',
    observed.length,
  );
  console.log(
    'OBSERVED',
    observed.map((e) => e.className.slice(0, 60)),
  );
  console.log('MAXHEIGHT', getComputedStyle(tc).maxHeight, tc.getAttribute('style'));
  spy.mockRestore();
  expect(1).toBe(1);
});

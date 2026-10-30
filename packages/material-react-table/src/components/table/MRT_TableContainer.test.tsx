import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { type MRT_ColumnDef } from '../../types';
import { MaterialReactTable } from '../MaterialReactTable';

interface Person {
  name: string;
}

const data: Person[] = [{ name: 'Alice' }];

const columns: MRT_ColumnDef<Person>[] = [{ accessorKey: 'name', header: 'Name' }];

const toolbarHeight = 50;

const toolbarHeights: Record<string, number> = {};

const resizeObservers: FakeResizeObserver[] = [];

class FakeResizeObserver {
  callback: ResizeObserverCallback;

  targets = new Set<Element>();

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    resizeObservers.push(this);
  }

  disconnect() {
    this.targets.clear();
  }

  observe(target: Element) {
    this.targets.add(target);
  }

  unobserve(target: Element) {
    this.targets.delete(target);
  }
}

const notifyResizeObservers = () => {
  for (const resizeObserver of [...resizeObservers]) {
    resizeObserver.callback([], {} as ResizeObserver);
  }
};

const notifyResizeObserversOf = (target: Element) => {
  for (const resizeObserver of [...resizeObservers]) {
    if (resizeObserver.targets.has(target)) {
      resizeObserver.callback([], {} as ResizeObserver);
    }
  }
};

describe('table container max height', () => {
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', FakeResizeObserver);
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (this: HTMLElement) {
      return this.dataset.toolbar ? (toolbarHeights[this.dataset.toolbar] ?? toolbarHeight) : 0;
    });
  });

  afterEach(() => {
    resizeObservers.length = 0;
    for (const toolbar of Object.keys(toolbarHeights)) {
      delete toolbarHeights[toolbar];
    }
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  test('subtracts the top and bottom toolbar heights', () => {
    const { container } = render(
      <MaterialReactTable
        columns={columns}
        data={data}
        enableStickyHeader
        muiBottomToolbarProps={{ 'data-toolbar': 'bottom' } as object}
        muiTableContainerProps={{ 'data-testid': 'table-container' } as object}
        muiTopToolbarProps={{ 'data-toolbar': 'top' } as object}
      />,
    );

    act(() => {
      notifyResizeObservers();
    });

    const tableContainer = container.querySelector('[data-testid="table-container"]') as HTMLElement;

    expect(getComputedStyle(tableContainer).maxHeight).toBe(`${window.innerHeight - toolbarHeight * 2}px`);
  });

  test('includes a bottom toolbar that is turned on after mount', () => {
    const table = (enableBottomToolbar: boolean) => (
      <MaterialReactTable
        columns={columns}
        data={data}
        enableBottomToolbar={enableBottomToolbar}
        enableStickyHeader
        muiBottomToolbarProps={{ 'data-toolbar': 'bottom' } as object}
        muiTableContainerProps={{ 'data-testid': 'table-container' } as object}
        muiTopToolbarProps={{ 'data-toolbar': 'top' } as object}
      />
    );
    const { container, rerender } = render(table(false));

    rerender(table(true));
    act(() => {
      notifyResizeObservers();
    });

    const tableContainer = container.querySelector('[data-testid="table-container"]') as HTMLElement;

    expect(getComputedStyle(tableContainer).maxHeight).toBe(`${window.innerHeight - toolbarHeight * 2}px`);
  });

  test('re-measures a toolbar when its height changes', () => {
    const { container } = render(
      <MaterialReactTable
        columns={columns}
        data={data}
        enableStickyHeader
        muiBottomToolbarProps={{ 'data-toolbar': 'bottom' } as object}
        muiTableContainerProps={{ 'data-testid': 'table-container' } as object}
        muiTopToolbarProps={{ 'data-toolbar': 'top' } as object}
      />,
    );

    act(() => {
      notifyResizeObservers();
    });

    const topToolbar = container.querySelector('[data-toolbar="top"]') as HTMLElement;
    toolbarHeights.top = 80;

    act(() => {
      notifyResizeObserversOf(topToolbar);
    });

    const tableContainer = container.querySelector('[data-testid="table-container"]') as HTMLElement;

    expect(getComputedStyle(tableContainer).maxHeight).toBe(`${window.innerHeight - 80 - toolbarHeight}px`);
  });
});

import { constructRow as _constructRow, flexRender as _flexRender, type Renderable } from '@tanstack/react-table';
import { type ReactNode } from 'react';

import {
  type MRT_ColumnHelper,
  type MRT_DisplayColumnDef,
  type MRT_GroupColumnDef,
  type MRT_Row,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../types';
import { getAllLeafColumnDefs, getColumnId } from './column.utils';

export const flexRender = <TProps extends object>(Comp: Renderable<TProps>, props: TProps): ReactNode =>
  _flexRender(Comp, props);

export function createMRTColumnHelper<TData extends MRT_RowData>(): MRT_ColumnHelper<TData> {
  return {
    accessor: (accessor, column) => {
      return typeof accessor === 'function'
        ? {
            ...column,
            accessorFn: accessor,
          }
        : {
            ...column,
            accessorKey: accessor,
          };
    },
    display: (column) => column as MRT_DisplayColumnDef<TData>,
    group: (column) => column as MRT_GroupColumnDef<TData>,
  };
}

export const createRow = <TData extends MRT_RowData>(
  table: MRT_TableInstance<TData>,
  originalRow?: TData,
  rowIndex = -1,
  depth = 0,
  subRows?: MRT_Row<TData>[],
  parentId?: string,
): MRT_Row<TData> =>
  _constructRow(
    // @ts-expect-error: MRT_TableInstance omits `options.features`, which the runtime table instance has
    table,
    'mrt-row-create',
    originalRow ??
      Object.assign(
        {},
        ...getAllLeafColumnDefs(table.options.columns).map((col) => ({
          [getColumnId(col)]: '',
        })),
      ),
    rowIndex,
    depth,
    subRows,
    parentId,
  ) as MRT_Row<TData>;

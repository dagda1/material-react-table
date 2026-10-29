import { useEffect, useReducer, useRef } from 'react';

import { type MRT_RowData, type MRT_SortingState, type MRT_TableInstance } from '../types';
import { getDefaultColumnOrderIds } from '../utils/displayColumn.utils';
import { getCanRankRows } from '../utils/row.utils';

export const useMRT_Effects = <TData extends MRT_RowData>(table: MRT_TableInstance<TData>): void => {
  const {
    getPrePaginatedRowModel,
    options: { enablePagination, enableRowPinning, rowCount },
  } = table;
  const { columnOrder, density, globalFilter, isFullScreen, isLoading, pagination, showSkeletons, sorting } =
    table.state;

  const totalColumnCount = table.options.columns.length;
  const totalRowCount = rowCount ?? getPrePaginatedRowModel().rows.length;

  const [, rerender] = useReducer(() => ({}), {});
  const initialBodyHeight = useRef<string>(null);
  const previousTop = useRef<number>(null);

  //values the effects below read without re-running when they change
  const effectValues = useRef({ columnOrder, enableRowPinning, pagination, table, tableOptions: table.options });
  useEffect(() => {
    effectValues.current = { columnOrder, enableRowPinning, pagination, table, tableOptions: table.options };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      initialBodyHeight.current = document.body.style.height;
    }
  }, []);

  //hide scrollbars when table is in full screen mode, preserve body scroll position after full screen exit
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isFullScreen) {
        previousTop.current = document.body.getBoundingClientRect().top; //save scroll position
        document.body.style.height = '100dvh'; //hide page scrollbars when table is in full screen mode
      } else {
        document.body.style.height = initialBodyHeight.current as string;
        if (!previousTop.current) {
          return;
        }
        //restore scroll position
        window.scrollTo({
          behavior: 'instant',
          top: -1 * (previousTop.current as number),
        });
      }
    }
  }, [isFullScreen]);

  //recalculate column order when columns change or features are toggled on/off
  useEffect(() => {
    const { columnOrder, table, tableOptions } = effectValues.current;
    if (totalColumnCount !== columnOrder.length) {
      table.setColumnOrder(getDefaultColumnOrderIds(tableOptions));
    }
  }, [totalColumnCount]);

  //if page index is out of bounds, set it to the last page
  useEffect(() => {
    if (!enablePagination || isLoading || showSkeletons) {
      return;
    }
    const { pagination, table } = effectValues.current;
    const { pageIndex, pageSize } = pagination;
    const totalPages: number = totalRowCount > 0 ? Math.ceil(totalRowCount / pageSize) : 1;
    const isOutOfBounds: boolean = pageIndex < 0 || pageIndex >= totalPages;

    if (isOutOfBounds) {
      table.setPageIndex(totalPages - 1);
    }
  }, [totalRowCount, enablePagination, isLoading, showSkeletons]);

  //turn off sort when global filter is looking for ranked results
  const appliedSort = useRef<MRT_SortingState>(sorting);
  useEffect(() => {
    if (sorting.length) {
      appliedSort.current = sorting;
    }
  }, [sorting]);

  useEffect(() => {
    const { table } = effectValues.current;
    if (!getCanRankRows(table)) {
      return;
    }
    if (globalFilter) {
      table.setSorting([]);
    } else {
      table.setSorting(() => appliedSort.current || []);
    }
  }, [globalFilter]);

  //fix pinned row top style when density changes
  useEffect(() => {
    const { enableRowPinning, table } = effectValues.current;
    if (enableRowPinning && table.getIsSomeRowsPinned()) {
      setTimeout(() => {
        rerender();
      }, 150);
    }
  }, [density]);
};

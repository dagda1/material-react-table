import { tableFeatures, useTable } from '@tanstack/react-table';
import { useMemo, useRef, useState } from 'react';

import {
  type MRT_Cell,
  type MRT_Column,
  type MRT_ColumnDef,
  type MRT_ColumnFilterFnsState,
  type MRT_ColumnOrderState,
  type MRT_ColumnSizingInfoState,
  type MRT_DefinedTableOptions,
  type MRT_DensityState,
  type MRT_FilterOption,
  type MRT_GroupingState,
  type MRT_PaginationState,
  type MRT_Row,
  type MRT_RowData,
  type MRT_StatefulTableOptions,
  type MRT_TableInstance,
  type MRT_TableState,
  type MRT_Updater,
} from '../types';
import {
  getAllLeafColumnDefs,
  getColumnId,
  getDefaultColumnFilterFn,
  prepareColumns,
} from '../utils/column.utils';
import {
  getDefaultColumnOrderIds,
  showRowActionsColumn,
  showRowDragColumn,
  showRowExpandColumn,
  showRowNumbersColumn,
  showRowPinningColumn,
  showRowSelectionColumn,
  showRowSpacerColumn,
} from '../utils/displayColumn.utils';
import { MRT_TableFeatures } from '../fns/tableFeatures';
import { createRow } from '../utils/tanstack.helpers';
import { getMRT_RowActionsColumnDef } from './display-columns/getMRT_RowActionsColumnDef';
import { getMRT_RowDragColumnDef } from './display-columns/getMRT_RowDragColumnDef';
import { getMRT_RowExpandColumnDef } from './display-columns/getMRT_RowExpandColumnDef';
import { getMRT_RowNumbersColumnDef } from './display-columns/getMRT_RowNumbersColumnDef';
import { getMRT_RowPinningColumnDef } from './display-columns/getMRT_RowPinningColumnDef';
import { getMRT_RowSelectColumnDef } from './display-columns/getMRT_RowSelectColumnDef';
import { getMRT_RowSpacerColumnDef } from './display-columns/getMRT_RowSpacerColumnDef';
import { useMRT_Effects } from './useMRT_Effects';

/**
 * The MRT hook that wraps the TanStack useReactTable hook and adds additional functionality
 * @param definedTableOptions - table options with proper defaults set
 * @returns the MRT table instance
 */
export const useMRT_TableInstance = <TData extends MRT_RowData>(
  definedTableOptions: MRT_DefinedTableOptions<TData>,
): MRT_TableInstance<TData> => {
  const lastSelectedRowId = useRef<null | string>(null);
  const actionCellRef = useRef<HTMLTableCellElement>(null);
  const bottomToolbarRef = useRef<HTMLDivElement>(null);
  const editInputRefs = useRef<Record<string, HTMLInputElement>>({});
  const filterInputRefs = useRef<Record<string, HTMLInputElement>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const tableHeadCellRefs = useRef<Record<string, HTMLTableCellElement>>({});
  const tablePaperRef = useRef<HTMLDivElement>(null);
  const topToolbarRef = useRef<HTMLDivElement>(null);
  const tableHeadRef = useRef<HTMLTableSectionElement>(null);
  const tableFooterRef = useRef<HTMLTableSectionElement>(null);

  //transform initial state with proper column order
  const initialState: Partial<MRT_TableState<TData>> = useMemo(() => {
    const initState = definedTableOptions.initialState ?? {};
    initState.columnOrder =
      initState.columnOrder ??
      getDefaultColumnOrderIds({
        ...definedTableOptions,
        state: {
          ...definedTableOptions.initialState,
          ...definedTableOptions.state,
        },
      } as MRT_StatefulTableOptions<TData>);
    initState.globalFilterFn = definedTableOptions.globalFilterFn ?? 'fuzzy';
    return initState;
  }, []);

  definedTableOptions.initialState = initialState;

  const [actionCell, setActionCell] = useState<MRT_Cell<TData> | null>(
    initialState.actionCell ?? null,
  );
  const [creatingRow, _setCreatingRow] = useState<MRT_Row<TData> | null>(
    initialState.creatingRow ?? null,
  );
  const [columnFilterFns, setColumnFilterFns] =
    useState<MRT_ColumnFilterFnsState>(() =>
      Object.assign(
        {},
        ...getAllLeafColumnDefs(
          definedTableOptions.columns as MRT_ColumnDef<TData>[],
        ).map((col) => ({
          [getColumnId(col)]:
            col.filterFn instanceof Function
              ? (col.filterFn.name ?? 'custom')
              : (col.filterFn ??
                initialState?.columnFilterFns?.[getColumnId(col)] ??
                getDefaultColumnFilterFn(col)),
        })),
      ),
    );
  const [columnOrder, onColumnOrderChange] = useState<MRT_ColumnOrderState>(
    initialState.columnOrder ?? [],
  );
  const [columnResizing, onColumnResizingChange] =
    useState<MRT_ColumnSizingInfoState>(
      initialState.columnResizing ?? ({} as MRT_ColumnSizingInfoState),
    );
  const [density, setDensity] = useState<MRT_DensityState>(
    initialState?.density ?? 'comfortable',
  );
  const [draggingColumn, setDraggingColumn] =
    useState<MRT_Column<TData> | null>(initialState.draggingColumn ?? null);
  const [draggingRow, setDraggingRow] = useState<MRT_Row<TData> | null>(
    initialState.draggingRow ?? null,
  );
  const [editingCell, setEditingCell] = useState<MRT_Cell<TData> | null>(
    initialState.editingCell ?? null,
  );
  const [editingRow, setEditingRow] = useState<MRT_Row<TData> | null>(
    initialState.editingRow ?? null,
  );
  const [globalFilterFn, setGlobalFilterFn] = useState<MRT_FilterOption>(
    initialState.globalFilterFn ?? 'fuzzy',
  );
  const [grouping, onGroupingChange] = useState<MRT_GroupingState>(
    initialState.grouping ?? [],
  );
  const [hoveredColumn, setHoveredColumn] = useState<null | Partial<
    MRT_Column<TData>
  >>(initialState.hoveredColumn ?? null);
  const [hoveredRow, setHoveredRow] = useState<null | Partial<MRT_Row<TData>>>(
    initialState.hoveredRow ?? null,
  );
  const [isFullScreen, setIsFullScreen] = useState<boolean>(
    initialState?.isFullScreen ?? false,
  );
  const [pagination, onPaginationChange] = useState<MRT_PaginationState>(
    initialState?.pagination ?? { pageIndex: 0, pageSize: 10 },
  );
  const [showAlertBanner, setShowAlertBanner] = useState<boolean>(
    initialState?.showAlertBanner ?? false,
  );
  const [showColumnFilters, setShowColumnFilters] = useState<boolean>(
    initialState?.showColumnFilters ?? false,
  );
  const [showGlobalFilter, setShowGlobalFilter] = useState<boolean>(
    initialState?.showGlobalFilter ?? false,
  );
  const [showToolbarDropZone, setShowToolbarDropZone] = useState<boolean>(
    initialState?.showToolbarDropZone ?? false,
  );

  definedTableOptions.state = {
    actionCell,
    columnFilterFns,
    columnOrder,
    columnResizing,
    creatingRow,
    density,
    draggingColumn,
    draggingRow,
    editingCell,
    editingRow,
    globalFilterFn,
    grouping,
    hoveredColumn,
    hoveredRow,
    isFullScreen,
    pagination,
    showAlertBanner,
    showColumnFilters,
    showGlobalFilter,
    showToolbarDropZone,
    ...definedTableOptions.state,
  };

  //The table options now include all state needed to help determine column visibility and order logic
  const statefulTableOptions =
    definedTableOptions as MRT_StatefulTableOptions<TData>;

  //don't recompute columnDefs while resizing column or dragging column/row
  const columnDefsRef = useRef<ReadonlyArray<MRT_ColumnDef<TData>>>([]);
  statefulTableOptions.columns =
    statefulTableOptions.state.columnResizing.isResizingColumn ||
    statefulTableOptions.state.draggingColumn ||
    statefulTableOptions.state.draggingRow
      ? columnDefsRef.current
      : prepareColumns({
          columnDefs: [
            ...([
              showRowPinningColumn(statefulTableOptions) &&
                getMRT_RowPinningColumnDef(statefulTableOptions),
              showRowDragColumn(statefulTableOptions) &&
                getMRT_RowDragColumnDef(statefulTableOptions),
              showRowActionsColumn(statefulTableOptions) &&
                getMRT_RowActionsColumnDef(statefulTableOptions),
              showRowExpandColumn(statefulTableOptions) &&
                getMRT_RowExpandColumnDef(statefulTableOptions),
              showRowSelectionColumn(statefulTableOptions) &&
                getMRT_RowSelectColumnDef(statefulTableOptions),
              showRowNumbersColumn(statefulTableOptions) &&
                getMRT_RowNumbersColumnDef(statefulTableOptions),
            ].filter(Boolean) as MRT_ColumnDef<TData>[]),
            ...statefulTableOptions.columns,
            ...([
              showRowSpacerColumn(statefulTableOptions) &&
                getMRT_RowSpacerColumnDef(statefulTableOptions),
            ].filter(Boolean) as MRT_ColumnDef<TData>[]),
          ],
          tableOptions: statefulTableOptions,
        });
  columnDefsRef.current = statefulTableOptions.columns;

  //if loading, generate blank rows to show skeleton loaders
  statefulTableOptions.data = useMemo(
    () =>
      (statefulTableOptions.state.isLoading ||
        statefulTableOptions.state.showSkeletons) &&
      !statefulTableOptions.data.length
        ? [
            ...Array(
              Math.min(statefulTableOptions.state.pagination.pageSize, 20),
            ).fill(null),
          ].map(() =>
            Object.assign(
              {},
              ...getAllLeafColumnDefs(statefulTableOptions.columns).map(
                (col) => ({
                  [getColumnId(col)]: null,
                }),
              ),
            ),
          )
        : statefulTableOptions.data,
    [
      statefulTableOptions.data,
      statefulTableOptions.state.isLoading,
      statefulTableOptions.state.showSkeletons,
    ],
  );

  const [features] = useState<MRT_TableFeatures>(() =>
    tableFeatures({
      ...MRT_TableFeatures,
      aggregationFns: {
        ...MRT_TableFeatures.aggregationFns,
        ...statefulTableOptions.aggregationFns,
      },
      filterFns: {
        ...MRT_TableFeatures.filterFns,
        ...statefulTableOptions.filterFns,
      },
      sortFns: {
        ...MRT_TableFeatures.sortFns,
        ...statefulTableOptions.sortFns,
      },
    }),
  );

  const tableOptions = {
    onColumnOrderChange,
    onColumnResizingChange,
    onGroupingChange,
    onPaginationChange,
    ...statefulTableOptions,
    features,
    globalFilterFn: globalFilterFn ?? 'fuzzy',
  };

  const reactTable = useTable(tableOptions);

  const table = Object.assign(reactTable, {
    getState: () => reactTable.state,
    getLeftLeafColumns: () => reactTable.getStartLeafColumns(),
    getRightLeafColumns: () => reactTable.getEndLeafColumns(),
    getPaginationRowModel: () => reactTable.getPaginatedRowModel(),
    refs: {
      actionCellRef,
      bottomToolbarRef,
      editInputRefs,
      filterInputRefs,
      lastSelectedRowId,
      searchInputRef,
      tableContainerRef,
      tableFooterRef,
      tableHeadCellRefs,
      tableHeadRef,
      tablePaperRef,
      topToolbarRef,
    },
    setActionCell: statefulTableOptions.onActionCellChange ?? setActionCell,
    setColumnFilterFns:
      statefulTableOptions.onColumnFilterFnsChange ?? setColumnFilterFns,
    setCreatingRow: (row: MRT_Updater<MRT_Row<TData> | null | true>) => {
      const nextRow = row === true ? createRow(table) : row;
      statefulTableOptions?.onCreatingRowChange?.(
        nextRow as MRT_Row<TData> | null,
      ) ?? _setCreatingRow(nextRow as MRT_Row<TData> | null);
    },
    setDensity: statefulTableOptions.onDensityChange ?? setDensity,
    setDraggingColumn:
      statefulTableOptions.onDraggingColumnChange ?? setDraggingColumn,
    setDraggingRow: statefulTableOptions.onDraggingRowChange ?? setDraggingRow,
    setEditingCell: statefulTableOptions.onEditingCellChange ?? setEditingCell,
    setEditingRow: statefulTableOptions.onEditingRowChange ?? setEditingRow,
    setGlobalFilterFn:
      statefulTableOptions.onGlobalFilterFnChange ?? setGlobalFilterFn,
    setHoveredColumn:
      statefulTableOptions.onHoveredColumnChange ?? setHoveredColumn,
    setHoveredRow: statefulTableOptions.onHoveredRowChange ?? setHoveredRow,
    setIsFullScreen: statefulTableOptions.onIsFullScreenChange ?? setIsFullScreen,
    setShowAlertBanner:
      statefulTableOptions.onShowAlertBannerChange ?? setShowAlertBanner,
    setShowColumnFilters:
      statefulTableOptions.onShowColumnFiltersChange ?? setShowColumnFilters,
    setShowGlobalFilter:
      statefulTableOptions.onShowGlobalFilterChange ?? setShowGlobalFilter,
    setShowToolbarDropZone:
      statefulTableOptions.onShowToolbarDropZoneChange ?? setShowToolbarDropZone,
  });

  useMRT_Effects(table);

  return table;
};

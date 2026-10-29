import {
  cellSelectionFeature,
  cellSpanningFeature,
  columnFacetingFeature,
  columnFilteringFeature,
  columnGroupingFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createExpandedRowModel,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  type CustomAggregationFns,
  type FilterFn,
  globalFilteringFeature,
  rowAggregationFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowPinningFeature,
  rowSelectionFeature,
  rowSortingFeature,
  type SortFn,
  type StockFeatures,
  type TableFeature,
  tableFeatures,
} from '@tanstack/react-table';

import { type MRT_RowData } from '../types';
import { MRT_AggregationFns } from './aggregationFns';
import { MRT_FilterFns } from './filterFns';
import { MRT_SortingFns } from './sortingFns';

const mrtFeature: TableFeature = {
  getInitialState: (state) => ({
    actionCell: null,
    columnFilterFns: {},
    creatingRow: null,
    density: 'comfortable',
    draggingColumn: null,
    draggingRow: null,
    editingCell: null,
    editingRow: null,
    globalFilterFn: 'fuzzy',
    hoveredColumn: null,
    hoveredRow: null,
    isFullScreen: false,
    isLoading: false,
    isSaving: false,
    showAlertBanner: false,
    showColumnFilters: false,
    showGlobalFilter: false,
    showLoadingOverlay: false,
    showProgressBars: false,
    showSkeletons: false,
    showToolbarDropZone: false,
    ...state,
  }),
};

export const MRT_DefaultTableFeatures = tableFeatures({
  aggregationFns: MRT_AggregationFns,
  cellSelectionFeature,
  cellSpanningFeature,
  columnFacetingFeature,
  columnFilteringFeature,
  columnGroupingFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  expandedRowModel: createExpandedRowModel(),
  facetedMinMaxValues: createFacetedMinMaxValues(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  filteredRowModel: createFilteredRowModel(),
  filterFns: MRT_FilterFns,
  globalFilteringFeature,
  groupedRowModel: createGroupedRowModel(),
  mrtFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowAggregationFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowPinningFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: MRT_SortingFns,
});

export interface MRT_TableFeatures extends StockFeatures {
  aggregationFns: CustomAggregationFns<MRT_TableFeatures, MRT_RowData>;
  filterFns: Record<string, FilterFn<MRT_TableFeatures, MRT_RowData>>;
  mrtFeature: TableFeature;
  sortFns: Record<string, SortFn<MRT_TableFeatures, MRT_RowData>>;
}

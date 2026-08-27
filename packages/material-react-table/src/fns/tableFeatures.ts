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
  globalFilteringFeature,
  rowAggregationFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowPinningFeature,
  rowSelectionFeature,
  rowSortingFeature,
  type AggregationFnDef,
  type FilterFn,
  type SortFn,
  type StockFeatures,
  type TableFeature,
  tableFeatures,
} from '@tanstack/react-table';

import { MRT_AggregationFns } from './aggregationFns';
import { MRT_FilterFns } from './filterFns';
import { MRT_SortingFns } from './sortingFns';

const mrtFeature: TableFeature = {};

export const MRT_TableFeatures = tableFeatures({
  mrtFeature,
  cellSelectionFeature,
  cellSpanningFeature,
  columnFacetingFeature,
  columnFilteringFeature,
  columnGroupingFeature,
  globalFilteringFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnSizingFeature,
  columnResizingFeature,
  columnVisibilityFeature,
  rowAggregationFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowPinningFeature,
  rowSelectionFeature,
  rowSortingFeature,
  expandedRowModel: createExpandedRowModel(),
  facetedMinMaxValues: createFacetedMinMaxValues(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  filteredRowModel: createFilteredRowModel(),
  groupedRowModel: createGroupedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  aggregationFns: MRT_AggregationFns,
  filterFns: MRT_FilterFns,
  sortFns: MRT_SortingFns,
});

export interface MRT_TableFeatures extends StockFeatures {
  aggregationFns: Record<string, AggregationFnDef<any, any, any, any>>;
  filterFns: Record<string, FilterFn<any, any>>;
  mrtFeature: TableFeature;
  sortFns: Record<string, SortFn<any, any>>;
}

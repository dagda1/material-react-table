import {
  cellSelectionFeature,
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
  tableFeatures,
} from '@tanstack/react-table';

import { MRT_AggregationFns } from './aggregationFns';
import { MRT_FilterFns } from './filterFns';
import { MRT_SortingFns } from './sortingFns';

/**
 * The feature set every MRT table is built from.
 *
 * MRT exposes all of TanStack's stock features through its own props, so every
 * one is registered here. Registering them by name rather than spreading
 * `stockFeatures` is what lets the fn registries below stay trimmed: the
 * `useLegacyTable` shim spread the complete built-in `filterFns`, `sortFns` and
 * `aggregationFns` objects on every table, which put every built-in in the
 * bundle whether or not MRT could reach it.
 *
 * Prerequisite order matters. `columnSizingFeature` comes before
 * `columnResizingFeature`, and `columnFilteringFeature` before
 * `globalFilteringFeature`, so inference and diagnostics stay readable.
 */
export const MRT_TableFeatures = tableFeatures({
  cellSelectionFeature,
  columnFacetingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  columnGroupingFeature,
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

export type MRT_TableFeatures = typeof MRT_TableFeatures;

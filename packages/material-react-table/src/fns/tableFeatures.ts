import {
  type AggregationFnDef,
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

import {
  type MRT_RowData,
  type MRT_StatefulTableOptions,
} from '../types';
import { MRT_AggregationFns } from './aggregationFns';
import { MRT_FilterFns } from './filterFns';
import { MRT_SortingFns } from './sortingFns';

const mrtFeature: TableFeature = {};

const slotWhen = <TSlot,>(enabled: boolean | undefined, create: () => TSlot) =>
  enabled ? create() : undefined;

export const getMRT_TableFeatures = <TData extends MRT_RowData>(
  tableOptions: MRT_StatefulTableOptions<TData>,
): MRT_TableFeatures => {
  const {
    aggregationFns,
    enableColumnFilters,
    enableExpanding,
    enableFacetedValues,
    enableFilters,
    enableGlobalFilter,
    enableGrouping,
    enablePagination,
    enableSorting,
    filterFns,
    manualFiltering,
    manualGrouping,
    manualPagination,
    manualSorting,
    sortFns,
  } = tableOptions;

  const clientFiltering =
    (enableColumnFilters || enableGlobalFilter || enableFilters) &&
    !manualFiltering;

  return tableFeatures({
    aggregationFns: { ...MRT_AggregationFns, ...aggregationFns },
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
    expandedRowModel: slotWhen(
      enableExpanding || enableGrouping,
      createExpandedRowModel,
    ),
    facetedMinMaxValues: slotWhen(
      enableFacetedValues,
      createFacetedMinMaxValues,
    ),
    facetedRowModel: slotWhen(enableFacetedValues, createFacetedRowModel),
    facetedUniqueValues: slotWhen(
      enableFacetedValues,
      createFacetedUniqueValues,
    ),
    filteredRowModel: slotWhen(clientFiltering, createFilteredRowModel),
    filterFns: { ...MRT_FilterFns, ...filterFns },
    globalFilteringFeature,
    groupedRowModel: slotWhen(
      enableGrouping && !manualGrouping,
      createGroupedRowModel,
    ),
    mrtFeature,
    paginatedRowModel: slotWhen(
      enablePagination && !manualPagination,
      createPaginatedRowModel,
    ),
    rowAggregationFeature,
    rowExpandingFeature,
    rowPaginationFeature,
    rowPinningFeature,
    rowSelectionFeature,
    rowSortingFeature,
    sortedRowModel: slotWhen(
      enableSorting && !manualSorting,
      createSortedRowModel,
    ),
    sortFns: { ...MRT_SortingFns, ...sortFns },
  });
};

export interface MRT_TableFeatures extends StockFeatures {
  aggregationFns: Record<string, AggregationFnDef<any, any, any, any>>;
  filterFns: Record<string, FilterFn<any, any>>;
  mrtFeature: TableFeature;
  sortFns: Record<string, SortFn<any, any>>;
}

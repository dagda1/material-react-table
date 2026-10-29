import { rankings, rankItem } from '@tanstack/match-sorter-utils';
import {
  filterFn_arrIncludes,
  filterFn_arrIncludesAll,
  filterFn_arrIncludesSome,
  filterFn_equalsString,
  filterFn_equalsStringSensitive,
  filterFn_includesString,
  filterFn_includesStringSensitive,
  filterFn_inNumberRange,
  filterFn_weakEquals,
  type FilterMeta,
  type Row,
  type TableFeatures,
} from '@tanstack/react-table';

import { type MRT_RowData } from '../types';

const fuzzy = <TFeatures extends TableFeatures, TData extends MRT_RowData>(
  row: Row<TFeatures, TData>,
  columnId: string,
  filterValue: number | string,
  addMeta?: (meta: FilterMeta) => void,
): boolean => {
  const itemRank = rankItem(row.getValue<null | number | string>(columnId), filterValue as string, {
    threshold: rankings.MATCHES,
  });
  addMeta?.(itemRank);
  return itemRank.passed;
};

fuzzy.autoRemove = (val: unknown): boolean => !val;

const contains = <TFeatures extends TableFeatures, TData extends MRT_RowData>(
  row: Row<TFeatures, TData>,
  id: string,
  filterValue: number | string,
): boolean =>
  !!row
    .getValue<null | number | string>(id)
    ?.toString()
    .toLowerCase()
    .trim()
    .includes(filterValue.toString().toLowerCase().trim());

contains.autoRemove = (val: unknown): boolean => !val;

const startsWith = <TFeatures extends TableFeatures, TData extends MRT_RowData>(
  row: Row<TFeatures, TData>,
  id: string,
  filterValue: number | string,
): boolean =>
  !!row
    .getValue<null | number | string>(id)
    ?.toString()
    .toLowerCase()
    .trim()
    .startsWith(filterValue.toString().toLowerCase().trim());

startsWith.autoRemove = (val: unknown): boolean => !val;

const endsWith = <TFeatures extends TableFeatures, TData extends MRT_RowData>(
  row: Row<TFeatures, TData>,
  id: string,
  filterValue: number | string,
): boolean =>
  !!row
    .getValue<null | number | string>(id)
    ?.toString()
    .toLowerCase()
    .trim()
    .endsWith(filterValue.toString().toLowerCase().trim());

endsWith.autoRemove = (val: unknown): boolean => !val;

const equals = <TFeatures extends TableFeatures, TData extends MRT_RowData>(
  row: Row<TFeatures, TData>,
  id: string,
  filterValue: number | string,
): boolean =>
  row.getValue<null | number | string>(id)?.toString().toLowerCase().trim() ===
  filterValue.toString().toLowerCase().trim();

equals.autoRemove = (val: unknown): boolean => !val;

const notEquals = <TFeatures extends TableFeatures, TData extends MRT_RowData>(
  row: Row<TFeatures, TData>,
  id: string,
  filterValue: number | string,
): boolean =>
  row.getValue<null | number | string>(id)?.toString().toLowerCase().trim() !==
  filterValue.toString().toLowerCase().trim();

notEquals.autoRemove = (val: unknown): boolean => !val;

const greaterThan = <TFeatures extends TableFeatures, TData extends MRT_RowData>(
  row: Row<TFeatures, TData>,
  id: string,
  filterValue: number | string,
): boolean =>
  !isNaN(+filterValue) && !isNaN(+row.getValue<number | string>(id))
    ? +(row.getValue<null | number | string>(id) ?? 0) > +filterValue
    : (row.getValue<null | number | string>(id) ?? '')?.toString().toLowerCase().trim() >
      filterValue.toString().toLowerCase().trim();

greaterThan.autoRemove = (val: unknown): boolean => !val;

const greaterThanOrEqualTo = <TFeatures extends TableFeatures, TData extends MRT_RowData>(
  row: Row<TFeatures, TData>,
  id: string,
  filterValue: number | string,
): boolean => equals(row, id, filterValue) || greaterThan(row, id, filterValue);

greaterThanOrEqualTo.autoRemove = (val: unknown): boolean => !val;

const lessThan = <TFeatures extends TableFeatures, TData extends MRT_RowData>(
  row: Row<TFeatures, TData>,
  id: string,
  filterValue: number | string,
): boolean =>
  !isNaN(+filterValue) && !isNaN(+row.getValue<number | string>(id))
    ? +(row.getValue<null | number | string>(id) ?? 0) < +filterValue
    : (row.getValue<null | number | string>(id) ?? '')?.toString().toLowerCase().trim() <
      filterValue.toString().toLowerCase().trim();

lessThan.autoRemove = (val: unknown): boolean => !val;

const lessThanOrEqualTo = <TFeatures extends TableFeatures, TData extends MRT_RowData>(
  row: Row<TFeatures, TData>,
  id: string,
  filterValue: number | string,
): boolean => equals(row, id, filterValue) || lessThan(row, id, filterValue);

lessThanOrEqualTo.autoRemove = (val: unknown): boolean => !val;

const between = <TFeatures extends TableFeatures, TData extends MRT_RowData>(
  row: Row<TFeatures, TData>,
  id: string,
  filterValues: [number | string, number | string],
): boolean =>
  (filterValues[0] === '' || filterValues[0] === undefined || greaterThan(row, id, filterValues[0])) &&
  ((!isNaN(+filterValues[0]) && !isNaN(+filterValues[1]) && +filterValues[0] > +filterValues[1]) ||
    filterValues[1] === '' ||
    filterValues[1] === undefined ||
    lessThan(row, id, filterValues[1]));

between.autoRemove = (val: unknown): boolean => !val;

const betweenInclusive = <TFeatures extends TableFeatures, TData extends MRT_RowData>(
  row: Row<TFeatures, TData>,
  id: string,
  filterValues: [number | string, number | string],
): boolean =>
  (filterValues[0] === '' || filterValues[0] === undefined || greaterThanOrEqualTo(row, id, filterValues[0])) &&
  ((!isNaN(+filterValues[0]) && !isNaN(+filterValues[1]) && +filterValues[0] > +filterValues[1]) ||
    filterValues[1] === '' ||
    filterValues[1] === undefined ||
    lessThanOrEqualTo(row, id, filterValues[1]));

betweenInclusive.autoRemove = (val: unknown): boolean => !val;

const empty = <TFeatures extends TableFeatures, TData extends MRT_RowData>(
  row: Row<TFeatures, TData>,
  id: string,
  _filterValue: number | string,
): boolean => !row.getValue<null | number | string>(id)?.toString().trim();

empty.autoRemove = (val: unknown): boolean => !val;

const notEmpty = <TFeatures extends TableFeatures, TData extends MRT_RowData>(
  row: Row<TFeatures, TData>,
  id: string,
  _filterValue: number | string,
): boolean => !!row.getValue<null | number | string>(id)?.toString().trim();

notEmpty.autoRemove = (val: unknown): boolean => !val;

export const MRT_FilterFns = {
  arrIncludes: filterFn_arrIncludes,
  arrIncludesAll: filterFn_arrIncludesAll,
  arrIncludesSome: filterFn_arrIncludesSome,
  between,
  betweenInclusive,
  contains,
  empty,
  endsWith,
  equals,
  equalsString: filterFn_equalsString,
  equalsStringSensitive: filterFn_equalsStringSensitive,
  fuzzy,
  greaterThan,
  greaterThanOrEqualTo,
  includesString: filterFn_includesString,
  includesStringSensitive: filterFn_includesStringSensitive,
  inNumberRange: filterFn_inNumberRange,
  lessThan,
  lessThanOrEqualTo,
  notEmpty,
  notEquals,
  startsWith,
  weakEquals: filterFn_weakEquals,
};

import { compareItems, type RankingInfo } from '@tanstack/match-sorter-utils';
import {
  type Row,
  sortFn_alphanumeric,
  sortFn_alphanumericCaseSensitive,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  sortFn_textCaseSensitive,
} from '@tanstack/react-table';

import { type MRT_Row, type MRT_RowData } from '../types';
import { type MRT_TableFeatures } from './tableFeatures';

const fuzzy = <TFeatures extends MRT_TableFeatures, TData extends MRT_RowData>(
  rowA: Row<TFeatures, TData>,
  rowB: Row<TFeatures, TData>,
  columnId: string,
): number => {
  let dir = 0;
  if ('columnFiltersMeta' in rowA && 'columnFiltersMeta' in rowB && rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId] as RankingInfo,
      rowB.columnFiltersMeta[columnId] as RankingInfo,
    );
  }
  // Provide a fallback for when the item ranks are equal
  return dir === 0 ? sortFn_alphanumeric(rowA, rowB, columnId) : dir;
};

export const MRT_SortingFns = {
  alphanumeric: sortFn_alphanumeric,
  alphanumericCaseSensitive: sortFn_alphanumericCaseSensitive,
  basic: sortFn_basic,
  datetime: sortFn_datetime,
  fuzzy,
  text: sortFn_text,
  textCaseSensitive: sortFn_textCaseSensitive,
};

export const rankGlobalFuzzy = <TData extends MRT_RowData>(rowA: MRT_Row<TData>, rowB: MRT_Row<TData>): number =>
  Math.max(...Object.values(rowB.columnFiltersMeta).map((meta) => (meta as RankingInfo).rank)) -
  Math.max(...Object.values(rowA.columnFiltersMeta).map((meta) => (meta as RankingInfo).rank));

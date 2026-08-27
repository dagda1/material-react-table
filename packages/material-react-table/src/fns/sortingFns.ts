import { compareItems, type RankingInfo } from '@tanstack/match-sorter-utils';
import {
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
} from '@tanstack/react-table';
import { type Row } from '@tanstack/react-table';

import { type MRT_Row, type MRT_RowData } from '../types';

const fuzzy = <TData extends MRT_RowData>(
  rowA: Row<any, TData>,
  rowB: Row<any, TData>,
  columnId: string,
) => {
  let dir = 0;
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId] as RankingInfo,
      rowB.columnFiltersMeta[columnId] as RankingInfo,
    );
  }
  // Provide a fallback for when the item ranks are equal
  return dir === 0
    ? sortFn_alphanumeric(rowA, rowB, columnId)
    : dir;
};

export const MRT_SortingFns = {
  alphanumeric: sortFn_alphanumeric,
  basic: sortFn_basic,
  datetime: sortFn_datetime,
  fuzzy,
  text: sortFn_text,
};

export const rankGlobalFuzzy = <TData extends MRT_RowData>(
  rowA: MRT_Row<TData>,
  rowB: MRT_Row<TData>,
) =>
  Math.max(...Object.values(rowB.columnFiltersMeta).map((v: any) => v.rank)) -
  Math.max(...Object.values(rowA.columnFiltersMeta).map((v: any) => v.rank));

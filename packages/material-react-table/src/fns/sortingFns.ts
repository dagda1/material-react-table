import { compareItems, type RankingInfo } from '@tanstack/match-sorter-utils';
import { sortFns } from '@tanstack/react-table';
import { type LegacyRow } from '@tanstack/react-table/legacy';

import { type MRT_Row, type MRT_RowData } from '../types';

const fuzzy = <TData extends MRT_RowData>(
  rowA: LegacyRow<TData>,
  rowB: LegacyRow<TData>,
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
    ? sortFns.alphanumeric(rowA as LegacyRow<any>, rowB as LegacyRow<any>, columnId)
    : dir;
};

export const MRT_SortingFns = {
  ...sortFns,
  fuzzy,
};

export const rankGlobalFuzzy = <TData extends MRT_RowData>(
  rowA: MRT_Row<TData>,
  rowB: MRT_Row<TData>,
) =>
  Math.max(...Object.values(rowB.columnFiltersMeta).map((v: any) => v.rank)) -
  Math.max(...Object.values(rowA.columnFiltersMeta).map((v: any) => v.rank));

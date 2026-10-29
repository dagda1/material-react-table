import { type MRT_Row, type MRT_RowData, type MRT_TableInstance } from '../types';
import { getMRT_Rows } from '../utils/row.utils';

export const useMRT_Rows = <TData extends MRT_RowData>(table: MRT_TableInstance<TData>): MRT_Row<TData>[] =>
  getMRT_Rows(table);

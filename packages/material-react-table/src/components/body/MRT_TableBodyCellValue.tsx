import { Box } from '@mui/material';
import { type ReactNode, type RefObject } from 'react';

import {
  type MRT_Cell,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { highlightWords } from '../../utils/highlight.utils';

const allowedTypes = ['string', 'number'];

export interface MRT_TableBodyCellValueProps<TData extends MRT_RowData> {
  cell: MRT_Cell<TData>;
  rowRef?: RefObject<HTMLTableRowElement | null>;
  staticColumnIndex?: number;
  staticRowIndex?: number;
  table: MRT_TableInstance<TData>;
}

export const MRT_TableBodyCellValue = <TData extends MRT_RowData>({
  cell,
  rowRef,
  staticColumnIndex,
  staticRowIndex,
  table,
}: MRT_TableBodyCellValueProps<TData>) => {
  const {
    options: {
      enableFilterMatchHighlighting,
      mrtTheme: { matchHighlightColor },
    },
  } = table;
  const { column, row } = cell;
  const { columnDef } = column;
  const { globalFilter, globalFilterFn } = table.state;
  const filterValue = column.getFilterValue();

  let renderedCellValue =
    cell.getIsAggregated() && columnDef.AggregatedCell
      ? columnDef.AggregatedCell({
          cell,
          column,
          row,
          staticColumnIndex,
          staticRowIndex,
          table,
        })
      : row.getIsGrouped() && !cell.getIsGrouped()
        ? null
        : cell.getIsGrouped() && columnDef.GroupedCell
          ? columnDef.GroupedCell({
              cell,
              column,
              row,
              staticColumnIndex,
              staticRowIndex,
              table,
            })
          : undefined;

  const isGroupedValue = renderedCellValue !== undefined;

  if (!isGroupedValue) {
    renderedCellValue = cell.renderValue() as number | ReactNode | string;
  }

  if (
    enableFilterMatchHighlighting &&
    columnDef.enableFilterMatchHighlighting !== false &&
    String(renderedCellValue) &&
    allowedTypes.includes(typeof renderedCellValue) &&
    ((filterValue &&
      allowedTypes.includes(typeof filterValue) &&
      ['autocomplete', 'text'].includes(columnDef.filterVariant!)) ||
      (globalFilter &&
        allowedTypes.includes(typeof globalFilter) &&
        column.getCanGlobalFilter()))
  ) {
    const chunks = highlightWords({
      matchExactly:
        (filterValue ? columnDef._filterFn : globalFilterFn) !== 'fuzzy',
      query: (filterValue ?? globalFilter ?? '').toString(),
      text: renderedCellValue?.toString() as string,
    });
    if (chunks?.length > 1 || chunks?.[0]?.match) {
      renderedCellValue = (
        <span aria-label={renderedCellValue as string} role="note">
          {chunks?.map(({ key, match, text }) => (
            <Box
              aria-hidden="true"
              component="span"
              key={key}
              sx={
                match
                  ? {
                      backgroundColor: matchHighlightColor,
                      borderRadius: '2px',
                      color: (theme) =>
                        theme.palette.mode === 'dark'
                          ? theme.palette.common.white
                          : theme.palette.common.black,
                      padding: '2px 1px',
                    }
                  : undefined
              }
            >
              {text}
            </Box>
          )) ?? renderedCellValue}
        </span>
      );
    }
  }

  if (columnDef.Cell && !isGroupedValue) {
    renderedCellValue = columnDef.Cell({
      cell,
      column,
      renderedCellValue,
      row,
      rowRef,
      staticColumnIndex,
      staticRowIndex,
      table,
    });
  }

  return renderedCellValue;
};

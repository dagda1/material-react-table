import { Table, type TableProps } from '@mui/material';
import { type CSSObject } from '@mui/material/styles';

import { useMRT_ColumnVirtualizer } from '../../hooks/useMRT_ColumnVirtualizer';
import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { parseCSSVarId } from '../../utils/style.utils';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { Memo_MRT_TableBody, MRT_TableBody } from '../body/MRT_TableBody';
import { MRT_TableFooter } from '../footer/MRT_TableFooter';
import { MRT_TableHead } from '../head/MRT_TableHead';

export interface MRT_TableProps<TData extends MRT_RowData> extends TableProps {
  table: MRT_TableInstance<TData>;
}

export const MRT_Table = <TData extends MRT_RowData>({ table, ...rest }: MRT_TableProps<TData>): JSX.Element => {
  const {
    getFlatHeaders,
    options: {
      enableStickyHeader,
      enableTableFooter,
      enableTableHead,
      layoutMode,
      memoMode,
      muiTableProps,
      renderCaption,
    },
  } = table;
  const { columnResizing, isFullScreen } = table.state;

  const tableProps = {
    ...parseFromValuesOrFunc(muiTableProps, { table }),
    ...rest,
  };

  const Caption = parseFromValuesOrFunc(renderCaption, { table });

  const headers = getFlatHeaders();
  const columnSizeVars: { [key: string]: number } = {};
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i];
    const colSize = header.getSize();
    columnSizeVars[`--header-${parseCSSVarId(header.id)}-size`] = colSize;
    columnSizeVars[`--col-${parseCSSVarId(header.column.id)}-size`] = colSize;
  }

  const columnVirtualizer = useMRT_ColumnVirtualizer(table);

  const commonTableGroupProps = {
    columnVirtualizer,
    table,
  };

  return (
    <Table
      stickyHeader={enableStickyHeader || isFullScreen}
      {...tableProps}
      style={{ ...columnSizeVars, ...tableProps?.style }}
      sx={(theme) => ({
        borderCollapse: 'separate',
        display: layoutMode?.startsWith('grid') ? 'grid' : undefined,
        position: 'relative',
        ...(parseFromValuesOrFunc(tableProps?.sx, theme) as CSSObject),
      })}
    >
      {!!Caption && <caption>{Caption}</caption>}
      {enableTableHead && <MRT_TableHead {...commonTableGroupProps} />}
      {memoMode === 'table-body' || columnResizing.isResizingColumn ? (
        <Memo_MRT_TableBody {...commonTableGroupProps} />
      ) : (
        <MRT_TableBody {...commonTableGroupProps} />
      )}
      {enableTableFooter && <MRT_TableFooter {...commonTableGroupProps} />}
    </Table>
  );
};

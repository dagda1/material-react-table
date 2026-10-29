import { TableContainer, type TableContainerProps } from '@mui/material';
import { type CSSObject } from '@mui/material/styles';
import { useEffect, useLayoutEffect, useState } from 'react';

import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { MRT_CellActionMenu } from '../menus/MRT_CellActionMenu';
import { MRT_EditRowModal } from '../modals/MRT_EditRowModal';
import { MRT_Table } from './MRT_Table';
import { MRT_TableLoadingOverlay } from './MRT_TableLoadingOverlay';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export interface MRT_TableContainerProps<TData extends MRT_RowData> extends TableContainerProps {
  table: MRT_TableInstance<TData>;
}

export const MRT_TableContainer = <TData extends MRT_RowData>({
  table,
  ...rest
}: MRT_TableContainerProps<TData>): JSX.Element => {
  const {
    options: {
      createDisplayMode,
      editDisplayMode,
      enableBottomToolbar,
      enableCellActions,
      enableStickyHeader,
      enableTopToolbar,
      muiTableContainerProps,
    },
    refs: { bottomToolbarRef, tableContainerRef, topToolbarRef },
  } = table;
  const { actionCell, creatingRow, editingRow, isFullScreen, isLoading, showLoadingOverlay } = table.state;

  const loading = showLoadingOverlay !== false && (isLoading || showLoadingOverlay);

  const [totalToolbarHeight, setTotalToolbarHeight] = useState(0);

  const tableContainerProps = {
    ...parseFromValuesOrFunc(muiTableContainerProps, {
      table,
    }),
    ...rest,
  };

  useIsomorphicLayoutEffect(() => {
    const measureToolbars = () => {
      setTotalToolbarHeight((topToolbarRef.current?.offsetHeight ?? 0) + (bottomToolbarRef.current?.offsetHeight ?? 0));
    };

    measureToolbars();

    if (typeof ResizeObserver === 'undefined' || !tableContainerRef.current) {
      return;
    }

    //the bottom toolbar renders after this container, so its ref is only set when the observer first fires
    const resizeObserver = new ResizeObserver(() => {
      for (const toolbar of [topToolbarRef.current, bottomToolbarRef.current]) {
        if (toolbar) {
          resizeObserver.observe(toolbar);
        }
      }
      measureToolbars();
    });
    resizeObserver.observe(tableContainerRef.current);

    return () => resizeObserver.disconnect();
  }, [bottomToolbarRef, enableBottomToolbar, enableTopToolbar, isFullScreen, tableContainerRef, topToolbarRef]);

  const createModalOpen = createDisplayMode === 'modal' && creatingRow;
  const editModalOpen = editDisplayMode === 'modal' && editingRow;

  return (
    <TableContainer
      aria-busy={loading}
      aria-describedby={loading ? 'mrt-progress' : undefined}
      {...tableContainerProps}
      ref={(node: HTMLDivElement) => {
        if (node) {
          tableContainerRef.current = node;
          if (tableContainerProps?.ref && typeof tableContainerProps.ref === 'object') {
            tableContainerProps.ref.current = node;
          }
        }
      }}
      style={{
        maxHeight: isFullScreen ? `calc(100vh - ${totalToolbarHeight}px)` : undefined,
        ...tableContainerProps?.style,
      }}
      sx={(theme) => ({
        maxHeight: enableStickyHeader ? `clamp(350px, calc(100vh - ${totalToolbarHeight}px), 9999px)` : undefined,
        maxWidth: '100%',
        overflow: 'auto',
        position: 'relative',
        ...(parseFromValuesOrFunc(tableContainerProps?.sx, theme) as CSSObject),
      })}
    >
      {loading ? <MRT_TableLoadingOverlay table={table} /> : null}
      <MRT_Table table={table} />
      {(createModalOpen || editModalOpen) && <MRT_EditRowModal open table={table} />}
      {enableCellActions && actionCell && <MRT_CellActionMenu table={table} />}
    </TableContainer>
  );
};

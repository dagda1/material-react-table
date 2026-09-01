import { Dialog, type DialogProps } from '@mui/material';
import { DialogActions } from '@mui/material';
import { DialogContent } from '@mui/material';
import { DialogTitle } from '@mui/material';
import { Stack } from '@mui/material';

import {
  type MRT_Row,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { MRT_EditActionButtons } from '../buttons/MRT_EditActionButtons';
import { MRT_EditCellTextField } from '../inputs/MRT_EditCellTextField';

export interface MRT_EditRowModalProps<TData extends MRT_RowData>
  extends Partial<DialogProps> {
  open: boolean;
  table: MRT_TableInstance<TData>;
}

export const MRT_EditRowModal = <TData extends MRT_RowData>({
  open,
  table,
  ...rest
}: MRT_EditRowModalProps<TData>) => {
  const {
    options: {
      localization,
      muiCreateRowModalProps,
      muiEditRowDialogProps,
      onCreatingRowCancel,
      onEditingRowCancel,
      renderCreateRowDialogContent,
      renderEditRowDialogContent,
    },
    setCreatingRow,
    setEditingRow,
  } = table;
  const { creatingRow, editingRow } = table.state;
  const row = (creatingRow ?? editingRow) as MRT_Row<TData>;

  const dialogProps = {
    ...parseFromValuesOrFunc(muiEditRowDialogProps, { row, table }),
    ...(creatingRow &&
      parseFromValuesOrFunc(muiCreateRowModalProps, { row, table })),
    ...rest,
  };

  const internalEditComponents = row
    .getAllCells()
    .filter((cell) => cell.column.columnDef.columnDefType === 'data')
    .map((cell) => (
      <MRT_EditCellTextField
        cell={cell as any}
        key={cell.id}
        table={table as any}
      />
    ));

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      onClose={(event, reason) => {
        if (creatingRow) {
          onCreatingRowCancel?.({ row, table });
          setCreatingRow(null);
        } else {
          onEditingRowCancel?.({ row, table });
          setEditingRow(null);
        }
        row._valuesCache = {} as any; //reset values cache
        dialogProps.onClose?.(event, reason);
      }}
      open={open}
      {...dialogProps}
    >
      {((creatingRow &&
        renderCreateRowDialogContent?.({
          internalEditComponents,
          row,
          table,
        })) ||
        renderEditRowDialogContent?.({
          internalEditComponents,
          row,
          table,
        })) ?? (
        <>
          <DialogTitle sx={{ textAlign: 'center' }}>
            {localization.edit}
          </DialogTitle>
          <DialogContent>
            <form onSubmit={(e) => e.preventDefault()}>
              <Stack
                sx={{
                  gap: '32px',
                  paddingTop: '16px',
                  width: '100%',
                }}
              >
                {internalEditComponents}
              </Stack>
            </form>
          </DialogContent>
          <DialogActions sx={{ p: '1.25rem' }}>
            <MRT_EditActionButtons row={row} table={table} variant="text" />
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

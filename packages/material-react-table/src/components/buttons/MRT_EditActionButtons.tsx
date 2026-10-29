import { Box, type BoxProps, Button, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { type CSSObject } from '@mui/material/styles';

import { type MRT_EditValues, type MRT_Row, type MRT_RowData, type MRT_TableInstance } from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';

export interface MRT_EditActionButtonsProps<TData extends MRT_RowData> extends BoxProps {
  row: MRT_Row<TData>;
  table: MRT_TableInstance<TData>;
  variant?: 'icon' | 'text';
}

export const MRT_EditActionButtons = <TData extends MRT_RowData>({
  row,
  table,
  variant = 'icon',
  ...rest
}: MRT_EditActionButtonsProps<TData>): JSX.Element => {
  const {
    options: {
      icons: { CancelIcon, SaveIcon },
      localization,
      onCreatingRowCancel,
      onCreatingRowSave,
      onEditingRowCancel,
      onEditingRowSave,
    },
    refs: { editInputRefs },
    setCreatingRow,
    setEditingRow,
  } = table;
  const { creatingRow, editingRow, isSaving } = table.state;

  const isCreating = creatingRow?.id === row.id;
  const isEditing = editingRow?.id === row.id;

  const handleCancel = () => {
    if (isCreating) {
      onCreatingRowCancel?.({ row, table });
      setCreatingRow(null);
    } else if (isEditing) {
      onEditingRowCancel?.({ row, table });
      setEditingRow(null);
    }
    row._valuesCache = {}; //reset values cache
  };

  const handleSubmitRow = () => {
    //look for auto-filled input values
    Object.values(editInputRefs.current ?? {})
      .filter((inputRef) => row.id === inputRef?.name?.split('_')?.[0])
      ?.forEach((input) => {
        if (input.value !== undefined && Object.hasOwn(row?._valuesCache as object, input.name)) {
          row._valuesCache[input.name] = input.value;
        }
      });
    if (isCreating) {
      onCreatingRowSave?.({
        exitCreatingMode: () => setCreatingRow(null),
        row,
        table,
        values: row._valuesCache as MRT_EditValues<TData>,
      });
    } else if (isEditing) {
      onEditingRowSave?.({
        exitEditingMode: () => setEditingRow(null),
        row,
        table,
        values: row._valuesCache as MRT_EditValues<TData>,
      });
    }
  };

  return (
    <Box
      onClick={(e) => e.stopPropagation()}
      sx={(theme) => ({
        display: 'flex',
        gap: '0.75rem',
        ...(parseFromValuesOrFunc(rest?.sx, theme) as CSSObject),
      })}
    >
      {variant === 'icon' ? (
        <>
          <Tooltip title={localization.cancel}>
            <IconButton aria-label={localization.cancel} onClick={handleCancel}>
              <CancelIcon />
            </IconButton>
          </Tooltip>
          {((isCreating && onCreatingRowSave) || (isEditing && onEditingRowSave)) && (
            <Tooltip title={localization.save}>
              <IconButton aria-label={localization.save} color="info" disabled={isSaving} onClick={handleSubmitRow}>
                {isSaving ? <CircularProgress size={18} /> : <SaveIcon />}
              </IconButton>
            </Tooltip>
          )}
        </>
      ) : (
        <>
          <Button onClick={handleCancel} sx={{ minWidth: '100px' }}>
            {localization.cancel}
          </Button>
          <Button disabled={isSaving} onClick={handleSubmitRow} sx={{ minWidth: '100px' }} variant="contained">
            {isSaving && <CircularProgress color="inherit" size={18} />}
            {localization.save}
          </Button>
        </>
      )}
    </Box>
  );
};

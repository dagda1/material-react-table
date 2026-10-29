import { Box, type BoxProps, Fade, Typography } from '@mui/material';
import { alpha, type CSSObject } from '@mui/material/styles';
import { type DragEvent, useEffect } from 'react';

import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';

export interface MRT_ToolbarDropZoneProps<TData extends MRT_RowData> extends BoxProps {
  table: MRT_TableInstance<TData>;
}

export const MRT_ToolbarDropZone = <TData extends MRT_RowData>({
  table,
  ...rest
}: MRT_ToolbarDropZoneProps<TData>): JSX.Element => {
  const {
    options: { enableGrouping, localization },
    setHoveredColumn,
    setShowToolbarDropZone,
  } = table;

  const { draggingColumn, grouping, hoveredColumn, showToolbarDropZone } = table.state;

  const handleDragEnter = (_event: DragEvent<HTMLDivElement>) => {
    setHoveredColumn({ id: 'drop-zone' });
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const isShowToolbarDropZoneControlled = table.options.state?.showToolbarDropZone !== undefined;

  useEffect(() => {
    if (isShowToolbarDropZoneControlled) {
      setShowToolbarDropZone(
        !!enableGrouping &&
          !!draggingColumn &&
          draggingColumn.columnDef.enableGrouping !== false &&
          !grouping.includes(draggingColumn.id),
      );
    }
  }, [draggingColumn, enableGrouping, grouping, isShowToolbarDropZoneControlled, setShowToolbarDropZone]);

  return (
    <Fade in={showToolbarDropZone}>
      <Box
        className="Mui-ToolbarDropZone"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        {...rest}
        sx={(theme) => ({
          alignItems: 'center',
          backdropFilter: 'blur(4px)',
          backgroundColor: alpha(theme.palette.info.main, hoveredColumn?.id === 'drop-zone' ? 0.2 : 0.1),
          border: `dashed ${theme.palette.info.main} 2px`,
          boxSizing: 'border-box',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          position: 'absolute',
          width: '100%',
          zIndex: 4,
          ...(parseFromValuesOrFunc(rest?.sx, theme) as CSSObject),
        })}
      >
        <Typography
          sx={{
            fontStyle: 'italic',
          }}
        >
          {localization.dropToGroupBy.replace('{column}', draggingColumn?.columnDef?.header ?? '')}
        </Typography>
      </Box>
    </Fade>
  );
};

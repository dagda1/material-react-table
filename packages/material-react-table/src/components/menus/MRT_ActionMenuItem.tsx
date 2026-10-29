import { Box, IconButton, ListItemIcon, MenuItem, type MenuItemProps } from '@mui/material';
import { type MouseEventHandler, type ReactNode } from 'react';

import { type MRT_RowData, type MRT_TableInstance } from '../../types';

export interface MRT_ActionMenuItemProps<TData extends MRT_RowData> extends MenuItemProps {
  icon: ReactNode;
  label: string;
  onOpenSubMenu?: MouseEventHandler<HTMLElement>;
  table: MRT_TableInstance<TData>;
}

export const MRT_ActionMenuItem = <TData extends MRT_RowData>({
  icon,
  label,
  onOpenSubMenu,
  table,
  ...rest
}: MRT_ActionMenuItemProps<TData>): JSX.Element => {
  const {
    options: {
      icons: { ArrowRightIcon },
    },
  } = table;

  return (
    <MenuItem
      sx={{
        alignItems: 'center',
        justifyContent: 'space-between',
        minWidth: '120px',
        my: 0,
        py: '6px',
      }}
      tabIndex={0}
      {...rest}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
        }}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        {label}
      </Box>
      {onOpenSubMenu && (
        <IconButton onClick={onOpenSubMenu} onMouseEnter={onOpenSubMenu} size="small" sx={{ p: 0 }}>
          <ArrowRightIcon />
        </IconButton>
      )}
    </MenuItem>
  );
};

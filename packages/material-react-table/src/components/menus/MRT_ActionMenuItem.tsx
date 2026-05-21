import { Box } from '@mui/material';
import { IconButton } from '@mui/material';
import { ListItemIcon } from '@mui/material';
import { MenuItem, type MenuItemProps } from '@mui/material';
import { type ReactNode } from 'react';

import { type MRT_RowData, type MRT_TableInstance } from '../../types';

export interface MRT_ActionMenuItemProps<TData extends MRT_RowData>
  extends MenuItemProps {
  icon: ReactNode;
  label: string;
  onOpenSubMenu?: MenuItemProps['onClick'] | MenuItemProps['onMouseEnter'];
  table: MRT_TableInstance<TData>;
}

export const MRT_ActionMenuItem = <TData extends MRT_RowData>({
  icon,
  label,
  onOpenSubMenu,
  table,
  ...rest
}: MRT_ActionMenuItemProps<TData>) => {
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
        <IconButton
          onClick={onOpenSubMenu as any}
          onMouseEnter={onOpenSubMenu as any}
          size="small"
          sx={{ p: 0 }}
        >
          <ArrowRightIcon />
        </IconButton>
      )}
    </MenuItem>
  );
};

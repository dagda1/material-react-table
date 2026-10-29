import { IconButton, type IconButtonProps, Tooltip } from '@mui/material';
import { type CSSObject } from '@mui/material/styles';

import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { getCommonTooltipProps } from '../../utils/style.utils';
import { parseFromValuesOrFunc } from '../../utils/utils';

export interface MRT_ExpandAllButtonProps<TData extends MRT_RowData> extends IconButtonProps {
  table: MRT_TableInstance<TData>;
}

export const MRT_ExpandAllButton = <TData extends MRT_RowData>({
  table,
  ...rest
}: MRT_ExpandAllButtonProps<TData>): JSX.Element => {
  const {
    getCanSomeRowsExpand,
    getIsAllRowsExpanded,
    getIsSomeRowsExpanded,
    options: {
      icons: { KeyboardDoubleArrowDownIcon },
      localization,
      muiExpandAllButtonProps,
      renderDetailPanel,
    },
    toggleAllRowsExpanded,
  } = table;
  const { density, isLoading } = table.state;

  const iconButtonProps = {
    ...parseFromValuesOrFunc(muiExpandAllButtonProps, {
      table,
    }),
    ...rest,
  };

  const isAllRowsExpanded = getIsAllRowsExpanded();

  return (
    <Tooltip
      {...getCommonTooltipProps()}
      title={iconButtonProps?.title ?? (isAllRowsExpanded ? localization.collapseAll : localization.expandAll)}
    >
      <span>
        <IconButton
          aria-label={localization.expandAll}
          disabled={isLoading || (!renderDetailPanel && !getCanSomeRowsExpand())}
          onClick={() => toggleAllRowsExpanded(!isAllRowsExpanded)}
          {...iconButtonProps}
          sx={(theme) => ({
            height: density === 'compact' ? '1.75rem' : '2.25rem',
            mt: density !== 'compact' ? '-0.25rem' : undefined,
            width: density === 'compact' ? '1.75rem' : '2.25rem',
            ...(parseFromValuesOrFunc(iconButtonProps?.sx, theme) as CSSObject),
          })}
          title={undefined}
        >
          {iconButtonProps?.children ?? (
            <KeyboardDoubleArrowDownIcon
              style={{
                transform: `rotate(${isAllRowsExpanded ? -180 : getIsSomeRowsExpanded() ? -90 : 0}deg)`,
                transition: 'transform 150ms',
              }}
            />
          )}
        </IconButton>
      </span>
    </Tooltip>
  );
};

import {
  Autocomplete,
  type AutocompleteInputChangeReason,
  type AutocompleteRenderInputParams,
  Box,
  Checkbox,
  Chip,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  type TextFieldProps,
  Tooltip,
} from '@mui/material';
import { type CSSObject } from '@mui/material/styles';
import { debounce } from '@mui/material/utils';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { type PickersTextFieldProps } from '@mui/x-date-pickers/PickersTextField';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { type ChangeEvent, type MouseEvent, type SyntheticEvent, useEffect, useRef, useState } from 'react';

import { type DropdownOption, type MRT_Header, type MRT_RowData, type MRT_TableInstance } from '../../types';
import { getColumnFilterInfo, getFilterOptionLabel, useDropdownOptions } from '../../utils/column.utils';
import { getTextFieldSlotProps } from '../../utils/slotProps.utils';
import { getValueAndLabel, parseFromValuesOrFunc } from '../../utils/utils';
import { MRT_FilterOptionMenu } from '../menus/MRT_FilterOptionMenu';

type MRT_FilterInputValue = (number | string)[] | Date | number | string | null;

export interface MRT_FilterTextFieldProps<TData extends MRT_RowData> extends TextFieldProps<'standard'> {
  header: MRT_Header<TData>;
  rangeFilterIndex?: number;
  table: MRT_TableInstance<TData>;
}

export const MRT_FilterTextField = <TData extends MRT_RowData>({
  header,
  rangeFilterIndex,
  table,
  ...rest
}: MRT_FilterTextFieldProps<TData>): JSX.Element => {
  const {
    options: {
      enableColumnFilterModes,
      icons: { CloseIcon, FilterListIcon },
      localization,
      manualFiltering,
      muiFilterAutocompleteProps,
      muiFilterDatePickerProps,
      muiFilterDateTimePickerProps,
      muiFilterTextFieldProps,
      muiFilterTimePickerProps,
    },
    refs: { filterInputRefs },
    setColumnFilterFns,
  } = table;
  const { column } = header;
  const { columnDef } = column;
  const { filterVariant } = columnDef;

  const args = { column, rangeFilterIndex, table };

  const textFieldProps = {
    ...parseFromValuesOrFunc(muiFilterTextFieldProps, args),
    ...parseFromValuesOrFunc(columnDef.muiFilterTextFieldProps, args),
    ...rest,
  };

  const autocompleteProps = {
    ...parseFromValuesOrFunc(muiFilterAutocompleteProps, args),
    ...parseFromValuesOrFunc(columnDef.muiFilterAutocompleteProps, args),
  };

  const datePickerProps = {
    ...parseFromValuesOrFunc(muiFilterDatePickerProps, args),
    ...parseFromValuesOrFunc(columnDef.muiFilterDatePickerProps, args),
  };

  const dateTimePickerProps = {
    ...parseFromValuesOrFunc(muiFilterDateTimePickerProps, args),
    ...parseFromValuesOrFunc(columnDef.muiFilterDateTimePickerProps, args),
  };

  const timePickerProps = {
    ...parseFromValuesOrFunc(muiFilterTimePickerProps, args),
    ...parseFromValuesOrFunc(columnDef.muiFilterTimePickerProps, args),
  };

  const {
    allowedColumnFilterOptions,
    currentFilterOption,
    facetedUniqueValues,
    isAutocompleteFilter,
    isDateFilter,
    isMultiSelectFilter,
    isRangeFilter,
    isSelectFilter,
    isTextboxFilter,
  } = getColumnFilterInfo({ header, table });

  const dropdownOptions = useDropdownOptions({ header, table });

  const filterChipLabel = ['empty', 'notEmpty'].includes(currentFilterOption)
    ? getFilterOptionLabel(localization, currentFilterOption)
    : '';

  const filterPlaceholder = !isRangeFilter
    ? (textFieldProps?.placeholder ?? localization.filterByColumn?.replace('{column}', String(columnDef.header)))
    : rangeFilterIndex === 0
      ? localization.min
      : rangeFilterIndex === 1
        ? localization.max
        : '';

  const showChangeModeButton = !!(
    enableColumnFilterModes &&
    columnDef.enableColumnFilterModes !== false &&
    !rangeFilterIndex &&
    (allowedColumnFilterOptions === undefined || !!allowedColumnFilterOptions?.length)
  );

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [filterValue, setFilterValue] = useState<MRT_FilterInputValue>(() =>
    isMultiSelectFilter
      ? (column.getFilterValue() as string[]) || []
      : isRangeFilter
        ? (column.getFilterValue() as [string, string])?.[rangeFilterIndex as number] || ''
        : isAutocompleteFilter
          ? typeof column.getFilterValue() === 'string'
            ? (column.getFilterValue() as string)
            : ''
          : ((column.getFilterValue() as string) ?? ''),
  );
  const [autocompleteValue, setAutocompleteValue] = useState<DropdownOption | null>(() =>
    isAutocompleteFilter ? ((column.getFilterValue() || null) as DropdownOption | null) : null,
  );

  const [handleChangeDebounced] = useState(() =>
    debounce(
      (newValue: unknown) => {
        if (isRangeFilter) {
          column.setFilterValue((old: unknown[]) => {
            const newFilterValues = old ?? ['', ''];
            newFilterValues[rangeFilterIndex as number] = newValue ?? undefined;
            return newFilterValues;
          });
        } else {
          column.setFilterValue(newValue ?? undefined);
        }
      },
      isTextboxFilter ? (manualFiltering ? 400 : 200) : 1,
    ),
  );

  const handleChange = (newValue: MRT_FilterInputValue) => {
    setFilterValue(newValue ?? '');
    handleChangeDebounced(newValue);
  };

  const handleTextFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue =
      textFieldProps.type === 'date'
        ? event.target.valueAsDate
        : textFieldProps.type === 'number'
          ? event.target.valueAsNumber
          : event.target.value;
    handleChange(newValue);
    textFieldProps?.onChange?.(event);
  };

  const handleAutocompleteInputChange = (
    _event: SyntheticEvent,
    newValue: string,
    _reason: AutocompleteInputChangeReason,
  ) => {
    handleChange(newValue);
  };

  const handleAutocompleteChange = (newValue: DropdownOption | null) => {
    setAutocompleteValue(newValue);
    handleChangeDebounced(getValueAndLabel(newValue).value);
  };

  const handleClear = () => {
    if (isMultiSelectFilter) {
      setFilterValue([]);
      column.setFilterValue([]);
    } else if (isRangeFilter) {
      setFilterValue('');
      column.setFilterValue((old: [string | undefined, string | undefined]) => {
        const newFilterValues = (Array.isArray(old) && old) || ['', ''];
        newFilterValues[rangeFilterIndex as number] = undefined;
        return newFilterValues;
      });
    } else if (isAutocompleteFilter) {
      setAutocompleteValue(null);
      setFilterValue('');
      // when using 'autocomplete' this function is called only inside effect and only if the filterValue === undefined
      // so the following call is excessive; should be uncommented if the handleClear becomes part of the Autocomplete component callbacks
      // column.setFilterValue(undefined)
    } else {
      setFilterValue('');
      column.setFilterValue(undefined);
    }
  };

  const handleClearEmptyFilterChip = () => {
    setFilterValue('');
    column.setFilterValue(undefined);
    setColumnFilterFns((prev) => ({
      ...prev,
      [header.id]: allowedColumnFilterOptions?.[0] ?? 'fuzzy',
    }));
  };

  const handleFilterMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const isMounted = useRef(false);
  const handleClearRef = useRef(handleClear);
  const columnFilterValue = column.getFilterValue();

  useEffect(() => {
    handleClearRef.current = handleClear;
  });

  useEffect(() => {
    if (isMounted.current) {
      const filterValue = columnFilterValue;
      if (filterValue === undefined) {
        handleClearRef.current();
      } else if (isRangeFilter && rangeFilterIndex !== undefined) {
        setFilterValue((filterValue as [string, string])[rangeFilterIndex]);
      } else {
        setFilterValue(filterValue as string);
      }
    }
    isMounted.current = true;
  }, [columnFilterValue, isRangeFilter, rangeFilterIndex]);

  if (columnDef.Filter) {
    return <>{columnDef.Filter?.({ column, header, rangeFilterIndex, table })}</>;
  }

  const endAdornment =
    !isAutocompleteFilter && !isDateFilter && !filterChipLabel ? (
      <InputAdornment
        position="end"
        sx={{
          mr: isSelectFilter || isMultiSelectFilter ? '20px' : undefined,
          visibility:
            (typeof filterValue === 'string' || Array.isArray(filterValue)) && filterValue.length > 0
              ? 'visible'
              : 'hidden',
        }}
      >
        <Tooltip placement="right" title={localization.clearFilter ?? ''}>
          <span>
            <IconButton
              aria-label={localization.clearFilter}
              disabled={!filterValue?.toString()?.length}
              onClick={handleClear}
              size="small"
              sx={{
                height: '2rem',
                transform: 'scale(0.9)',
                width: '2rem',
              }}
            >
              <CloseIcon />
            </IconButton>
          </span>
        </Tooltip>
      </InputAdornment>
    ) : null;

  const startAdornment = showChangeModeButton ? (
    <InputAdornment position="start">
      <Tooltip title={localization.changeFilterMode}>
        <span>
          <IconButton
            aria-label={localization.changeFilterMode}
            onClick={handleFilterMenuOpen}
            size="small"
            sx={{ height: '1.75rem', width: '1.75rem' }}
          >
            <FilterListIcon />
          </IconButton>
        </span>
      </Tooltip>
      {filterChipLabel && <Chip label={filterChipLabel} onDelete={handleClearEmptyFilterChip} />}
    </InputAdornment>
  ) : null;

  const commonTextFieldProps: TextFieldProps = {
    fullWidth: true,
    helperText: showChangeModeButton ? (
      <label>
        {localization.filterMode.replace('{filterType}', getFilterOptionLabel(localization, currentFilterOption))}
      </label>
    ) : null,
    inputRef: (inputRef) => {
      filterInputRefs.current![`${column.id}-${rangeFilterIndex ?? 0}`] = inputRef;
      if (textFieldProps.inputRef) {
        textFieldProps.inputRef = inputRef;
      }
    },
    margin: 'none',
    placeholder: filterChipLabel || isSelectFilter || isMultiSelectFilter ? undefined : filterPlaceholder,
    variant: 'standard',
    ...textFieldProps,
    onKeyDown: (e) => {
      e.stopPropagation();
      textFieldProps.onKeyDown?.(e);
    },
    slotProps: {
      ...textFieldProps.slotProps,
      formHelperText: {
        sx: {
          fontSize: '0.75rem',
          lineHeight: '0.8rem',
          whiteSpace: 'nowrap',
        },
        ...textFieldProps.slotProps?.formHelperText,
      },
      htmlInput: {
        'aria-label': filterPlaceholder,
        autoComplete: 'off',
        disabled: !!filterChipLabel,
        sx: {
          textOverflow: 'ellipsis',
          width: filterChipLabel ? 0 : undefined,
        },
        title: filterPlaceholder,
        ...textFieldProps.slotProps?.htmlInput,
      },
      input: endAdornment //hack because mui looks for presence of endAdornment key instead of undefined
        ? { endAdornment, startAdornment, ...textFieldProps.slotProps?.input }
        : { startAdornment, ...textFieldProps.slotProps?.input },
    },
    sx: (theme) => ({
      minWidth: isDateFilter
        ? '160px'
        : enableColumnFilterModes && rangeFilterIndex === 0
          ? '110px'
          : isRangeFilter
            ? '100px'
            : !filterChipLabel
              ? '120px'
              : 'auto',
      mx: '-2px',
      p: 0,
      width: 'calc(100% + 4px)',
      ...(parseFromValuesOrFunc(textFieldProps?.sx, theme) as CSSObject),
    }),
  };

  const commonDatePickerProps = {
    onChange: (newDate: Date | null) => {
      handleChange(newDate);
    },
    value: filterValue || null,
  };

  return (
    <>
      {filterVariant?.startsWith('time') ? (
        <TimePicker
          {...commonDatePickerProps}
          {...timePickerProps}
          slotProps={{
            ...timePickerProps?.slotProps,
            field: {
              clearable: true,
              onClear: () => handleClear(),
              ...timePickerProps?.slotProps?.field,
            },
            textField: {
              ...(commonTextFieldProps as PickersTextFieldProps),
              ...timePickerProps?.slotProps?.textField,
            },
          }}
        />
      ) : filterVariant?.startsWith('datetime') ? (
        <DateTimePicker
          {...commonDatePickerProps}
          {...dateTimePickerProps}
          slotProps={{
            ...dateTimePickerProps?.slotProps,
            field: {
              clearable: true,
              onClear: () => handleClear(),
              ...dateTimePickerProps?.slotProps?.field,
            },
            textField: {
              ...(commonTextFieldProps as PickersTextFieldProps),
              ...dateTimePickerProps?.slotProps?.textField,
            },
          }}
        />
      ) : filterVariant?.startsWith('date') ? (
        <DatePicker
          {...commonDatePickerProps}
          {...datePickerProps}
          slotProps={{
            ...datePickerProps?.slotProps,
            field: {
              clearable: true,
              onClear: () => handleClear(),
              ...datePickerProps?.slotProps?.field,
            },
            textField: {
              ...(commonTextFieldProps as PickersTextFieldProps),
              ...datePickerProps?.slotProps?.textField,
            },
          }}
        />
      ) : isAutocompleteFilter ? (
        <Autocomplete
          freeSolo
          getOptionLabel={(option: DropdownOption) => getValueAndLabel(option).label}
          inputValue={filterValue as string}
          onChange={(_e, newValue) => handleAutocompleteChange(newValue as DropdownOption | null)}
          onInputChange={handleAutocompleteInputChange}
          options={dropdownOptions?.map((option) => getValueAndLabel(option)) ?? []}
          {...autocompleteProps}
          renderInput={(params: AutocompleteRenderInputParams) => {
            const commonInput = getTextFieldSlotProps(commonTextFieldProps.slotProps).input;
            const commonHtmlInput = getTextFieldSlotProps(commonTextFieldProps.slotProps).htmlInput;
            return (
              <TextField
                {...commonTextFieldProps}
                disabled={params.disabled}
                fullWidth={params.fullWidth}
                id={params.id}
                onClick={(e: MouseEvent<HTMLInputElement>) => e.stopPropagation()}
                size={params.size}
                slotProps={{
                  ...commonTextFieldProps.slotProps,
                  htmlInput: {
                    ...params.slotProps.htmlInput,
                    ...commonHtmlInput,
                  },
                  input: {
                    ...params.slotProps.input,
                    startAdornment: commonInput?.startAdornment,
                  },
                  inputLabel: params.slotProps.inputLabel,
                }}
              />
            );
          }}
          value={autocompleteValue}
        />
      ) : (
        <TextField
          select={isSelectFilter || isMultiSelectFilter}
          {...commonTextFieldProps}
          onChange={handleTextFieldChange}
          onClick={(e: MouseEvent<HTMLInputElement>) => e.stopPropagation()}
          slotProps={{
            ...commonTextFieldProps.slotProps,
            inputLabel: {
              shrink: isSelectFilter || isMultiSelectFilter,
              ...commonTextFieldProps.slotProps?.inputLabel,
            },
            select: {
              displayEmpty: true,
              MenuProps: { disableScrollLock: true },
              multiple: isMultiSelectFilter,
              renderValue: isMultiSelectFilter
                ? (selected: unknown) =>
                    !Array.isArray(selected) || selected?.length === 0 ? (
                      <Box sx={{ opacity: 0.5 }}>{filterPlaceholder}</Box>
                    ) : (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
                        {selected.map((value: string) => {
                          const selectedValue = dropdownOptions?.find(
                            (option) => getValueAndLabel(option).value === value,
                          );
                          return <Chip key={value} label={getValueAndLabel(selectedValue).label} />;
                        })}
                      </Box>
                    )
                : undefined,
              ...commonTextFieldProps.slotProps?.select,
            },
          }}
          value={isMultiSelectFilter ? (Array.isArray(filterValue) ? filterValue : []) : filterValue}
        >
          {(isSelectFilter || isMultiSelectFilter) && [
            <MenuItem disabled divider hidden key="p" value="">
              <Box sx={{ opacity: 0.5 }}>{filterPlaceholder}</Box>
            </MenuItem>,
            ...[
              textFieldProps.children ??
                dropdownOptions?.map((option, index) => {
                  const { label, value } = getValueAndLabel(option);
                  return (
                    <MenuItem
                      key={`${index}-${value}`}
                      sx={{
                        alignItems: 'center',
                        display: 'flex',
                        gap: '0.5rem',
                        m: 0,
                      }}
                      value={value}
                    >
                      {isMultiSelectFilter && (
                        <Checkbox
                          checked={((column.getFilterValue() ?? []) as (number | string)[]).includes(value)}
                          sx={{ mr: '0.5rem' }}
                        />
                      )}
                      {label} {!columnDef.filterSelectOptions && `(${facetedUniqueValues.get(value)})`}
                    </MenuItem>
                  );
                }),
            ],
          ]}
        </TextField>
      )}
      <MRT_FilterOptionMenu
        anchorEl={anchorEl}
        header={header}
        setAnchorEl={setAnchorEl}
        setFilterValue={setFilterValue}
        table={table}
      />
    </>
  );
};

import { type FormHelperTextProps } from '@mui/material/FormHelperText';
import { type InputProps } from '@mui/material/Input';
import { type InputBaseComponentProps } from '@mui/material/InputBase';
import { type InputLabelProps } from '@mui/material/InputLabel';
import { type SelectProps } from '@mui/material/Select';
import { type TextFieldProps } from '@mui/material/TextField';

export type TextFieldSlotProps = {
  formHelperText?: Partial<FormHelperTextProps>;
  htmlInput?: InputBaseComponentProps;
  input?: Partial<InputProps>;
  inputLabel?: Partial<InputLabelProps>;
  select?: Partial<SelectProps>;
};

export const getTextFieldSlotProps = (
  slotProps: TextFieldProps['slotProps'],
): TextFieldSlotProps => ({
  formHelperText: slotProps?.formHelperText as Partial<FormHelperTextProps>,
  htmlInput: slotProps?.htmlInput as InputBaseComponentProps,
  input: slotProps?.input as Partial<InputProps>,
  inputLabel: slotProps?.inputLabel as Partial<InputLabelProps>,
  select: slotProps?.select as Partial<SelectProps>,
});


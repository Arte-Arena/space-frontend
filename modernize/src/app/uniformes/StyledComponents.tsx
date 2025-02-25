import { TextField, Select, styled } from "@mui/material";

export const StyledTextField = styled(TextField)(() => ({
  '& .MuiInputBase-root': {
    color: 'inherit',
    backgroundColor: 'transparent',
    minHeight: '32px',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
  },
  '& .MuiInputBase-input': {
    padding: '4px',
    height: 'auto',
    minHeight: '24px',
    lineHeight: '1.2',
    fontSize: 'inherit',
  },
}));

export const StyledSelect = styled(Select)(() => ({
  '& .MuiSelect-select': {
    padding: '4px',
    backgroundColor: 'transparent',
    border: 'none',
    minHeight: '24px !important',
    lineHeight: '1.2',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
}));
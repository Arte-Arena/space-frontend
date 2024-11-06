import CodeDialog from "@/app/components/shared/CodeDialog";
import React from "react";
const BasicDateTimeCode = () => {
    return (
        <>
            <CodeDialog>
                {`
"use client";
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';

const CustomTextField = styled((props: any) => <TextField {...props} />)(({ theme }) => ({
  '& .MuiOutlinedInput-input::-webkit-input-placeholder': {
    color: theme.palette.text.secondary,
    opacity: '0.8',
  },
  '& .MuiOutlinedInput-input.Mui-disabled::-webkit-input-placeholder': {
    color: theme.palette.text.secondary,
    opacity: '1',
  },
  '& .Mui-disabled .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.grey[200],
  },
}));

<LocalizationProvider dateAdapter={AdapterDateFns}>
    <MobileDateTimePicker
        onChange={(newValue) => {
            setValue3(newValue);
        }}
        renderInput={(inputProps) => (
            <CustomTextField
                fullWidth
                variant="outlined"
                size="small"
                inputProps={{ 'aria-label': 'basic date picker' }}
                {...inputProps}
            />
        )}
        value={value3}
    />
</LocalizationProvider>
`}
            </CodeDialog>
        </>
    );
};

export default BasicDateTimeCode;
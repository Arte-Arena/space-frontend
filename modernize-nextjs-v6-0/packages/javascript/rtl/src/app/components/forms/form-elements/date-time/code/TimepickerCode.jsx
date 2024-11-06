import CodeDialog from "@/app/components/shared/CodeDialog";
import React from "react";
const TimepickerCode = () => {
    return (
        <>
            <CodeDialog>
                {`
"use client";
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
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
    <TimePicker
        value={value2}
        onChange={(newValue) => {
            setValue2(newValue);
        }}
        renderInput={(params) => (
            <CustomTextField
                size="small"
                {...params}
                fullWidth
                sx={{
                    '& .MuiSvgIcon-root': {
                        width: '18px',
                        height: '18px',
                    },
                    '& .MuiFormHelperText-root': {
                        display: 'none',
                    },
                }}
            />
        )}
    />
</LocalizationProvider>
`}
            </CodeDialog>
        </>
    );
};

export default TimepickerCode;
import CodeDialog from "@/app/components/shared/CodeDialog";
import React from "react";
const DefaultcolorsCheckboxCode = () => {
    return (
        <>
            <CodeDialog>
                {`
"use client";
import * as React from 'react';
import { Box, Checkbox } from '@mui/material';

<Box textAlign="center">
    <Checkbox
        defaultChecked
        color="primary"
        inputProps={{ 'aria-label': 'checkbox with default color' }}
    />
    <Checkbox
        defaultChecked
        color="secondary"
        inputProps={{ 'aria-label': 'checkbox with default color' }}
    />
    <Checkbox
        defaultChecked
        sx={{
            color: (theme) => theme.palette.success.main,
            '&.Mui-checked': {
                color: (theme) => theme.palette.success.main,
            },
        }}
    />
    <Checkbox
        defaultChecked
        sx={{
            color: (theme) => theme.palette.error.main,
            '&.Mui-checked': {
                color: (theme) => theme.palette.error.main,
            },
        }}
    />
    <Checkbox
        defaultChecked
        sx={{
            color: (theme) => theme.palette.warning.main,
            '&.Mui-checked': {
                color: (theme) => theme.palette.warning.main,
            },
        }}
    />
</Box>`}
            </CodeDialog>
        </>
    );
};

export default DefaultcolorsCheckboxCode;
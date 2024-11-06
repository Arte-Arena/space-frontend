import CodeDialog from "@/app/components/shared/CodeDialog";
import React from "react";
const ColorsRadioCode = () => {
    return (
        <>
            <CodeDialog>
                {`
"use client";
import * as React from 'react';
import { Box, Radio } from '@mui/material';

const [checked, setChecked] = React.useState(true);

const handleChange = (event: any) => {
    setChecked(event.target.checked);
};

<Box textAlign="center">
    <Radio
        checked={checked}
        onChange={handleChange}
        color="primary"
        inputProps={{ 'aria-label': 'primary checkbox' }}
    />
    <Radio
        checked={checked}
        onChange={handleChange}
        color="secondary"
        inputProps={{ 'aria-label': 'primary checkbox' }}
    />
    <Radio
        checked={checked}
        onChange={handleChange}
        inputProps={{ 'aria-label': 'primary checkbox' }}
        sx={{
            color: (theme) => theme.palette.success.main,
            '&.Mui-checked': {
                color: (theme) => theme.palette.success.main,
            },
        }}
    />
    <Radio
        checked={checked}
        onChange={handleChange}
        inputProps={{ 'aria-label': 'primary checkbox' }}
        sx={{
            color: (theme) => theme.palette.error.main,
            '&.Mui-checked': {
                color: (theme) => theme.palette.error.main,
            },
        }}
    />
    <Radio
        checked={checked}
        onChange={handleChange}
        inputProps={{ 'aria-label': 'primary checkbox' }}
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

export default ColorsRadioCode;
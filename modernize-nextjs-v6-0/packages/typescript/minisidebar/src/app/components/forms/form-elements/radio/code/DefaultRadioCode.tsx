import CodeDialog from "@/app/components/shared/CodeDialog";
import React from "react";
const DefaultRadioCode = () => {
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
        inputProps={{ 'aria-label': 'primary checkbox' }}
    />
    <Radio disabled inputProps={{ 'aria-label': 'disabled checked checkbox' }} />
    <Radio color="default" inputProps={{ 'aria-label': 'checkbox with default color' }} />
</Box>`}
            </CodeDialog>
        </>
    );
};

export default DefaultRadioCode;
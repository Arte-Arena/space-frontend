import CodeDialog from "@/app/components/shared/CodeDialog";
import React from "react";
const DefaultLabelSwitchCode = () => {
    return (
        <>
            <CodeDialog>
                {`
"use client";
import * as React from 'react';
import { Box, Switch, FormGroup, FormControlLabel } from '@mui/material';

<Box textAlign="center">
    <FormGroup>
        <FormControlLabel control={<Switch defaultChecked />} label="Label" />
        <FormControlLabel disabled control={<Switch />} label="Disabled" />
    </FormGroup>
</Box>
`}
            </CodeDialog>
        </>
    );
};

export default DefaultLabelSwitchCode;
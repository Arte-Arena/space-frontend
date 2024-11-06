import CodeDialog from "@/app/components/shared/CodeDialog";
import React from "react";
const DefaultSwitchCode = () => {
    return (
        <>
            <CodeDialog>
                {`
"use client";
import * as React from 'react';
import { Box, Switch } from '@mui/material';

<Box textAlign="center">
    <Switch defaultChecked />
    <Switch />
    <Switch disabled defaultChecked />
    <Switch disabled />
</Box>
`}
            </CodeDialog>
        </>
    );
};

export default DefaultSwitchCode;
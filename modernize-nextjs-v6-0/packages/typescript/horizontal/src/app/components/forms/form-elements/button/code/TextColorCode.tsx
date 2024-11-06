import CodeDialog from "@/app/components/shared/CodeDialog";
import React from "react";
const TextColorCode = () => {
    return (
        <>
            <CodeDialog>
                {`
"use client";
import * as React from 'react';
import { Button, Stack } from '@mui/material';

<Stack spacing={1} direction={{ xs: 'column', sm: 'row' }} justifyContent="center">
    <Button color="primary">Primary</Button>
    <Button color="secondary">Secondary</Button>
    <Button color="error">Error</Button>
    <Button color="warning">Warning</Button>
    <Button color="success">Success</Button>
</Stack>`}
            </CodeDialog>
        </>
    );
};

export default TextColorCode;
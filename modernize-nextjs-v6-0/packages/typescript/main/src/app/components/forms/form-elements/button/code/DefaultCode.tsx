import CodeDialog from "@/app/components/shared/CodeDialog";
import React from "react";
const DefaultCode = () => {
    return (
        <>
            <CodeDialog>
                {`
"use client";
import * as React from 'react';
import {  Button, Stack } from '@mui/material';

<Stack spacing={1} direction={{ xs: 'column', sm: 'row' }} justifyContent="center">
    <Button variant="contained" color="primary">
      Primary
    </Button>
    <Button variant="contained" color="secondary">
      Secondary
    </Button>
    <Button disabled>Disabled</Button>
    <Button href="#text-buttons" variant="contained" color="primary">
      Link
    </Button>
</Stack>`}
            </CodeDialog>
        </>
    );
};

export default DefaultCode;

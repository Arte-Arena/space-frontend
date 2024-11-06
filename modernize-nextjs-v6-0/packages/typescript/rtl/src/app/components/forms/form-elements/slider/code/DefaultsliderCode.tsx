import CodeDialog from "@/app/components/shared/CodeDialog";
import React from "react";
const DefaultsliderCode = () => {
    return (
        <>
            <CodeDialog>
                {`
"use client";
import * as React from 'react';
import { Slider } from '@mui/material';

<Slider defaultValue={30}  />
`}
            </CodeDialog>
        </>
    );
};

export default DefaultsliderCode;
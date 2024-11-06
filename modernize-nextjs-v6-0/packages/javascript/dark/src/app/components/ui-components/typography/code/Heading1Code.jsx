import CodeDialog from "@/app/components/shared/CodeDialog";
import React from "react";
const Heading1Code = () => {
    return (
        <>
            <CodeDialog>
                {`
"use client";

import { Typography } from '@mui/material';

<Typography variant="h1">h1. Heading</Typography>`}
            </CodeDialog>
        </>
    );
};

export default Heading1Code;
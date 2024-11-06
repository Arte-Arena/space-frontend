import CodeDialog from "@/app/components/shared/CodeDialog";
import React from "react";
const Heading2Code = () => {
    return (
        <>
            <CodeDialog>
                {`
"use client";

import { Typography } from '@mui/material';

<Typography variant="h2">h2. Heading</Typography>`}
            </CodeDialog>
        </>
    );
};

export default Heading2Code;
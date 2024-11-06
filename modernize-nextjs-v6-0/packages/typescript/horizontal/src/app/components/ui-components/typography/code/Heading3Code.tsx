import CodeDialog from "@/app/components/shared/CodeDialog";
import React from "react";
const Heading3Code = () => {
    return (
        <>
            <CodeDialog>
                {`
"use client";

import { Typography } from '@mui/material';

<Typography variant="h3">h3. Heading</Typography>`}
            </CodeDialog>
        </>
    );
};

export default Heading3Code;
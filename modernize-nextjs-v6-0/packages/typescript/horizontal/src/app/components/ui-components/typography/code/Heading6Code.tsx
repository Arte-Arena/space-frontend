import CodeDialog from "@/app/components/shared/CodeDialog";
import React from "react";
const Heading6Code = () => {
    return (
        <>
            <CodeDialog>
                {`
"use client";

import { Typography } from '@mui/material';

<Typography variant="h6">h6. Heading</Typography>`}
            </CodeDialog>
        </>
    );
};

export default Heading6Code;
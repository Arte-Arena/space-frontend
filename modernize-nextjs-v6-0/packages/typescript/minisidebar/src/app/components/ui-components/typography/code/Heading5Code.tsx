import CodeDialog from "@/app/components/shared/CodeDialog";
import React from "react";
const Heading5Code = () => {
    return (
        <>
            <CodeDialog>
                {`
"use client";

import { Typography } from '@mui/material';

<Typography variant="h5">h5. Heading</Typography>`}
            </CodeDialog>
        </>
    );
};

export default Heading5Code;
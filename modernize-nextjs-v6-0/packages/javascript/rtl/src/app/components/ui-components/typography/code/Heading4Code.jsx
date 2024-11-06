import CodeDialog from "@/app/components/shared/CodeDialog";
import React from "react";
const Heading4Code = () => {
    return (
        <>
            <CodeDialog>
                {`
"use client";

import { Typography } from '@mui/material';

<Typography variant="h4">h4. Heading</Typography>`}
            </CodeDialog>
        </>
    );
};

export default Heading4Code;
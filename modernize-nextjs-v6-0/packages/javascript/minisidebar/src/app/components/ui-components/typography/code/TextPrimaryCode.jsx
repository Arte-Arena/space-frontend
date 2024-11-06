import CodeDialog from "@/app/components/shared/CodeDialog";
import React from "react";
const TextPrimaryCode = () => {
    return (
        <>
            <CodeDialog>
                {`
"use client";

import { Typography } from '@mui/material';

<Typography variant="body1" sx={{ color: (theme) => theme.palette.primary.main }}>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
</Typography>`}
            </CodeDialog>
        </>
    );
};

export default TextPrimaryCode;
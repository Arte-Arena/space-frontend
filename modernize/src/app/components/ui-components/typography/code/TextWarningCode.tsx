import CodeDialog from "@/app/components/shared/CodeDialog";
import React from "react";
const TextWarningCode = () => {
    return (
        <>
            <CodeDialog>
                {`
"use client";

import { Typography } from '@mui/material';

<Typography variant="body1" sx={{ color: (theme) => theme.palette.warning.main }}>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
</Typography>`}
            </CodeDialog>
        </>
    );
};

export default TextWarningCode;
import CodeDialog from "@/app/components/shared/CodeDialog";
import React from "react";
const LetterAvatarsCode = () => {
    return (
        <>
            <CodeDialog>
                {`
"use client";
import * as React from 'react';
import { Avatar, Stack } from '@mui/material';

<Stack direction="row" spacing={1} justifyContent="center">
    <Avatar alt="Remy Sharp" src={"/images/profile/user-4.jpg"} />
    <Avatar alt="Travis Howard" src={"/images/profile/user-2.jpg"} />
    <Avatar alt="Cindy Baker" src={"/images/profile/user-3.jpg"} />
</Stack>`}
            </CodeDialog>
        </>
    );
};

export default LetterAvatarsCode;
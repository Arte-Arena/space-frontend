import CodeDialog from "@/app/components/shared/CodeDialog";
import React from "react";
const SizesCode = () => {
    return (
        <>
            <CodeDialog>
                {`
"use client";
import * as React from 'react';
import { Avatar, Stack } from '@mui/material';
import { IconMoodSmile } from '@tabler/icons-react';

<Stack direction="row" spacing={1} justifyContent="center">
    <Avatar alt="Remy Sharp" src={"/images/profile/user-2.jpg"} sx={{ width: 24, height: 24 }} />
    <Avatar alt="Remy Sharp" src={"/images/profile/user-3.jpg"} sx={{ width: 32, height: 32 }} />
    <Avatar alt="Remy Sharp" src={"/images/profile/user-4.jpg"} />
    <Avatar alt="Remy Sharp" src={"/images/profile/user-5.jpg"} sx={{ width: 50, height: 50 }} />
    <Avatar alt="Remy Sharp" src={"/images/profile/user-6.jpg"} sx={{ width: 60, height: 60 }} />
    <Avatar alt="Remy Sharp" src={"/images/profile/user-7.jpg"} sx={{ width: 65, height: 65 }} />
</Stack>`}
            </CodeDialog>
        </>
    );
};

export default SizesCode;
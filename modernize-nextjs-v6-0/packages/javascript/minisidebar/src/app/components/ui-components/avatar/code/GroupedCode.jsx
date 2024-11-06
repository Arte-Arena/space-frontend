import CodeDialog from "@/app/components/shared/CodeDialog";
import React from "react";
const GroupedCode = () => {
    return (
        <>
            <CodeDialog>
                {`
"use client";
import * as React from 'react';
import { Avatar, AvatarGroup, Stack } from '@mui/material';
import { IconMoodSmile } from '@tabler/icons-react';

<Stack direction="row" spacing={1} justifyContent="center">
    <AvatarGroup max={4}>
        <Avatar alt="Remy Sharp" src={"/images/profile/user-4.jpg"} />
        <Avatar alt="Travis Howard" src={"/images/profile/user-2.jpg"} />
        <Avatar alt="Cindy Baker" src={"/images/profile/user-3.jpg"} />
    </AvatarGroup>
</Stack>`}
            </CodeDialog>
        </>
    );
};

export default GroupedCode;
import CodeDialog from "@/app/components/shared/CodeDialog";
import React from "react";
const GroupedSizeCode = () => {
    return (
        <>
            <CodeDialog>
                {`
"use client";
import * as React from 'react';
import { Avatar, AvatarGroup, Badge, Stack } from '@mui/material';
import { IconMoodSmile } from '@tabler/icons-react';

<Stack direction="row" spacing={1} justifyContent="center">
    <AvatarGroup max={4}>
        <Avatar alt="Remy Sharp" sx={{ width: 56, height: 56 }} src={"/images/profile/user-4.jpg"} />
        <Avatar alt="Travis Howard" sx={{ width: 56, height: 56 }} src={"/images/profile/user-2.jpg"} />
        <Avatar alt="Cindy Baker" sx={{ width: 56, height: 56 }} src={"/images/profile/user-3.jpg"} />
    </AvatarGroup>
</Stack>`}
            </CodeDialog>
        </>
    );
};

export default GroupedSizeCode;
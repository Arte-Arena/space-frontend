import CodeDialog from "@/app/components/shared/CodeDialog";
import React from "react";
const FABSizeCode = () => {
    return (
        <>
            <CodeDialog>
                {`
"use client";
import * as React from 'react';
import { Fab, Tooltip, Stack } from '@mui/material';
import { IconSend } from '@tabler/icons-react';

<Stack spacing={1} direction="row" justifyContent="center">
    <Tooltip title="Bell">
        <Fab size="small" color="primary" aria-label="small-bell">
          <IconBell width={16} />
        </Fab>
    </Tooltip>
    <Tooltip title="Bell">
        <Fab size="medium" color="secondary" aria-label="medium-bell">
          <IconBell width={18} />
        </Fab>
    </Tooltip>
    <Tooltip title="Bell">
        <Fab size="large" color="warning" aria-label="large-bell">
          <IconBell width={20} />
        </Fab>
    </Tooltip>
</Stack>`}
            </CodeDialog>
        </>
    );
};

export default FABSizeCode;
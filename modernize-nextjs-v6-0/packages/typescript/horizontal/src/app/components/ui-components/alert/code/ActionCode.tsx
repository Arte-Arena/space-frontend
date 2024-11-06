import CodeDialog from "@/app/components/shared/CodeDialog";
import React from "react";
const ActionCode = () => {
    return (
        <>
            <CodeDialog>
                {`
"use client";
import * as React from 'react';
import {
  Grid,
  Stack,
  Button,
  IconButton,
  Collapse,
  Alert,
  AlertTitle,
} from "@mui/material";

<Stack spacing={1}>
    <Alert variant="filled" severity="warning">
        This is a success alert — check it out!
    </Alert>
    <Alert
        variant="filled"
        severity="info"
        action={
            <Button color="inherit" size="small">
                UNDO
            </Button>
        }
    >
        This is a success alert — check it out!
    </Alert>
</Stack>`}
            </CodeDialog>
        </>
    );
};

export default ActionCode;
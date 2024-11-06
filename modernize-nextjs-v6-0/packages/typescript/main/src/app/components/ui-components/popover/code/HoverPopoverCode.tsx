import CodeDialog from "@/app/components/shared/CodeDialog";
import React from "react";
const HoverPopoverCode = () => {
    return (
        <>
            <CodeDialog>
                {`
"use client";
import * as React from 'react';
import { 
  Popover, 
  Box, 
  Typography 
} from '@mui/material';


const [anchorEl, setAnchorEl] = React.useState(null);
a
const handlePopoverOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
};

const handlePopoverClose = () => {
    setAnchorEl(null);
};

const open = Boolean(anchorEl);

return (
    <>
        <Typography
            aria-owns={open ? 'mouse-over-popover' : undefined}
            aria-haspopup="true"
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
        >
            Hover with a Popover.
        </Typography>
        <Popover
            id="mouse-over-popover"
            sx={{
                pointerEvents: 'none',
            }}
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
        >
            <Box p={2}>
                <Typography variant="h6" mb={1}>
                    Hover Popover
                </Typography>
                <Typography color="textSecondary">
                    The component is built on top of the Modal component.
                </Typography>
            </Box>
      </Popover>
    </>
);`}
            </CodeDialog>
        </>
    );
};

export default HoverPopoverCode;
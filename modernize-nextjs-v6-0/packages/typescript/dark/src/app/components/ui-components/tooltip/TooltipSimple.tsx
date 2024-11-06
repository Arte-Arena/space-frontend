"use client";

import { IconButton, Button, Stack, Fab } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

// common component
import ChildCard from "@/app/components/shared/ChildCard";

import SimpleTooltipCode from "@/app/components/ui-components/tooltip/code/SimpleTooltipCode";

import { IconPlus, IconTrash } from "@tabler/icons-react";

const TooltipSimple = () => (
  <ChildCard title="Simple" codeModel={<SimpleTooltipCode />}>
    <Stack direction="row" spacing={2} alignItems="center">
      <Tooltip title="Delete">
        <IconButton>
          <IconTrash width={20} height={20} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Add">
        <Button variant="outlined" color="primary">
          Button
        </Button>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton color="error">
          <IconTrash width={20} height={20} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Add">
        <Fab color="secondary">
          <IconPlus width={20} height={20} />
        </Fab>
      </Tooltip>
    </Stack>
  </ChildCard>
);
export default TooltipSimple;

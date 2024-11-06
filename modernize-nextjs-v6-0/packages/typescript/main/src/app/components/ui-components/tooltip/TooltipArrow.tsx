"use client";
import { Fab, Box } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

// common component
import ChildCard from "@/app/components/shared/ChildCard";

import ArrowTooltipCode from "@/app/components/ui-components/tooltip/code/ArrowTooltipCode";

import { IconPlus } from "@tabler/icons-react";

const TooltipArrow = () => (
  <ChildCard title="Arrow" codeModel={<ArrowTooltipCode />}>
    <Box textAlign="center">
      <Tooltip title="Delete" arrow>
        <Fab color="secondary">
          <IconPlus width={20} height={20} />
        </Fab>
      </Tooltip>
    </Box>
  </ChildCard>
);
export default TooltipArrow;

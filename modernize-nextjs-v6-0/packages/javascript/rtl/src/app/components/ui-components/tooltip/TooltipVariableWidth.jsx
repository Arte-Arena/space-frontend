'use client';
import { styled } from '@mui/material/styles';
import { Button, Stack } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

// common component
import ChildCard from '@/app/components/shared/ChildCard';

// CodeModels
import VariableWidthCode from '@/app/components/ui-components/tooltip/code/VariableWidthCode';

// variable width
const CustomWidthTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 500,
    },
});

const NoMaxWidthTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 'none',
    },
});

const longText = `
Aliquam eget finibus ante, non facilisis lectus. Sed vitae dignissim est, vel aliquam tellus.
Praesent non nunc mollis, fermentum neque at, semper arcu.
Nullam eget est sed sem iaculis gravida eget vitae justo.
`;

const TooltipVariableWidth = () => (

    <ChildCard title="Variable Width" codeModel={<VariableWidthCode />}>
        <Stack spacing={1} direction="row">
            <Tooltip title={longText}>
                <Button variant="outlined">Default Width [300px]</Button>
            </Tooltip>
            <CustomWidthTooltip title={longText}>
                <Button color="secondary" variant="outlined">
                    Custom Width [500px]
                </Button>
            </CustomWidthTooltip>
            <NoMaxWidthTooltip title={longText}>
                <Button color="warning" variant="outlined">
                    No wrapping
                </Button>
            </NoMaxWidthTooltip>
        </Stack>
    </ChildCard>
);
export default TooltipVariableWidth;

'use client';
import * as React from 'react';
import { Rating, Stack, Box } from '@mui/material';
import { IconStar } from '@tabler/icons-react';
import ChildCard from '@/app/components/shared/ChildCard';

const labels = {
    0.5: 'Useless',
    1: 'Useless+',
    1.5: 'Poor',
    2: 'Poor+',
    2.5: 'Ok',
    3: 'Ok+',
    3.5: 'Good',
    4: 'Good+',
    4.5: 'Excellent',
    5: 'Excellent+',
};

function getLabelText(value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

const HoverFeedback = () => {
    const [value, setValue] = React.useState(2);
    const [hover, setHover] = React.useState(-1);
    return (

        <ChildCard title="Hover feedback">
            <Stack direction="row" spacing={2} alignItems="center">
                <Rating
                    name="hover-feedback"
                    value={value}
                    precision={0.5}
                    getLabelText={getLabelText}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                    onChangeActive={(event, newHover) => {
                        setHover(newHover);
                    }}
                    emptyIcon={<IconStar width={20} style={{ opacity: 0.55 }} fontSize="inherit" />}
                />
                {value !== null && <Box>{labels[hover !== -1 ? hover : value]}</Box>}
            </Stack>
        </ChildCard>

    );
};
export default HoverFeedback;

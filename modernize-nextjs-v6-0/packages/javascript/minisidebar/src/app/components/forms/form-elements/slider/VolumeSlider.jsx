'use client';
import React from 'react'
import { Slider, Stack } from '@mui/material'
import { IconVolume, IconVolume2 } from '@tabler/icons-react';

const VolumeSlider = () => {
    const [value, setValue] = React.useState(30);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <>
            <Stack direction="row" spacing={1}>
                <IconVolume2 width={20} />
                <Slider aria-label="Volume" value={value} onChange={handleChange} />
                <IconVolume width={20} />
            </Stack>
        </>
    )
}

export default VolumeSlider

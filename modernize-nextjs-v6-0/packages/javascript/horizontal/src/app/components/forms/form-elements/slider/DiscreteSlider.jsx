'use client';
import { Slider } from '@mui/material';
import React from 'react'
const valuetext = (value) => `${value}°C`;
const DiscreteSlider = () => {
    return (
        <>
            <Slider
                aria-label="Temperature"
                defaultValue={30}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                step={10}
                marks
                min={10}
                max={110}
            />
        </>
    )
}

export default DiscreteSlider

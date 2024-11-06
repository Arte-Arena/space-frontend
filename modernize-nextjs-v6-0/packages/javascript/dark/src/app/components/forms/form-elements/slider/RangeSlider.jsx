'use client';
import React from 'react'
import CustomRangeSlider from '../../theme-elements/CustomRangeSlider'
import { Box, SliderThumb } from '@mui/material';


function AirbnbThumbComponent(props) {
    const { children, ...other } = props;

    return (
        <SliderThumb {...other}>
            {children}
            <Box
                sx={{
                    height: 9,
                    width: '2px',
                    backgroundColor: '#fff',
                }}
            />
            <Box
                sx={{
                    height: '14px',
                    width: '2px',
                    backgroundColor: '#fff',
                    ml: '2px',
                }}
            />
            <Box
                sx={{
                    height: 9,
                    width: '2px',
                    backgroundColor: '#fff',
                    ml: '2px',
                }}
            />
        </SliderThumb>
    );
}

const RangeSlider = () => {
    return (
        <>
            <CustomRangeSlider
                slots={{ thumb: AirbnbThumbComponent }}
                getAriaLabel={(index) => (index === 0 ? 'Minimum price' : 'Maximum price')}
                defaultValue={[20, 40]}
            />
        </>
    )
}

export default RangeSlider

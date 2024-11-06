'use client';
import { Slider } from '@mui/material'
import React from 'react'

function valuetext2(value) {
    return `${value}°C`;
  }
const RangeDefault = () => {
    const [value2, setValue2] = React.useState([20, 37]);
    const handleChange2 = (event2, newValue2) => {
      setValue2(newValue2);
    };
    return (
        <>
            <Slider
                getAriaLabel={() => 'Temperature range'}
                value={value2}
                onChange={handleChange2}
                valueLabelDisplay="auto"
                getAriaValueText={valuetext2}
            />
        </>
    )
}

export default RangeDefault

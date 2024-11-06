'use client';
import React from 'react'
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomSelect from '@/app/components/forms/theme-elements/CustomSelect';
import { MenuItem } from '@mui/material';
const FormSelect = () => {
    const [age, setAge] = React.useState('1');
    const handleChange = (event) => {
        setAge(event.target.value);
    };
    return (
        <>
            <CustomFormLabel htmlFor="demo-simple-select">Select Dropdown</CustomFormLabel>
            <CustomSelect
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                onChange={handleChange}
                fullWidth
            >
                <MenuItem value={1}>One</MenuItem>
                <MenuItem value={2}>Two</MenuItem>
                <MenuItem value={3}>Three</MenuItem>
            </CustomSelect>
        </>
    )
}

export default FormSelect

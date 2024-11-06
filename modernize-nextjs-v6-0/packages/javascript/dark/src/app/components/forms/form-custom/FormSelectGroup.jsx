'use client';
import { Grid, MenuItem } from '@mui/material';
import React from 'react'
import CustomSelect from '../theme-elements/CustomSelect';
import CustomFormLabel from '../theme-elements/CustomFormLabel';
import CustomSlider from '../theme-elements/CustomSlider';

const FormSelectGroup = () => {
    const [select1, setSelect] = React.useState('1');
    const [select2, setSelect2] = React.useState('1');


    const handleChange4 = (event2) => {
        setSelect(event2.target.value);
    };

    const handleChange5 = (event3) => {
        setSelect2(event3.target.value);
    };

    const [value3, setValue3] = React.useState(30);
    const handleChange6 = (event, newValue) => {
        setValue3(newValue);
    };

    return (
        <div>
            <Grid container spacing={2} mt={1}>
                <Grid item xs={12} sm={6} lg={6}>
                    <CustomSelect id="range1" value={select1} onChange={handleChange4} fullWidth>
                        <MenuItem value={1}>750</MenuItem>
                        <MenuItem value={2}>850</MenuItem>
                        <MenuItem value={3}>950</MenuItem>
                    </CustomSelect>
                </Grid>
                <Grid item xs={12} sm={6} lg={6}>
                    <CustomSelect id="rang2" value={select2} onChange={handleChange5} fullWidth>
                        <MenuItem value={1}>950</MenuItem>
                        <MenuItem value={2}>1050</MenuItem>
                        <MenuItem value={3}>1150</MenuItem>
                    </CustomSelect>
                </Grid>
            </Grid>
            <CustomFormLabel sx={{ mt: 3 }}>Volume</CustomFormLabel>
            <CustomSlider aria-label="Volume" value={value3} onChange={handleChange6} />
        </div>
    )
}

export default FormSelectGroup

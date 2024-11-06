'use client';
import React from 'react'
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const FormTimePicker = () => {
    const [value2, setValue2] = React.useState(null);
    return (
        <div>
            <CustomFormLabel htmlFor="time">Time</CustomFormLabel>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                    value={value2}
                    onChange={(newValue) => {
                        setValue2(newValue);
                    }}
                    renderInput={(params) => (
                        <CustomTextField
                            {...params}
                            fullWidth
                            sx={{
                                '& .MuiSvgIcon-root': {
                                    width: '18px',
                                    height: '18px',
                                },
                                '& .MuiFormHelperText-root': {
                                    display: 'none',
                                },
                            }}
                        />
                    )}
                />
            </LocalizationProvider>
        </div>
    )
}

export default FormTimePicker

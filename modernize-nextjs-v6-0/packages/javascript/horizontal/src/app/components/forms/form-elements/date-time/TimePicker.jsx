'use client';
import React from 'react'
import CustomTextField from '../../theme-elements/CustomTextField';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
const TimePickerDt = () => {
    const [value2, setValue2] = React.useState(new Date());
    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                    value={value2}
                    onChange={(newValue) => {
                        setValue2(newValue);
                    }}
                    renderInput={(params) => (
                        <CustomTextField
                            size="small"
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
        </>
    )
}

export default TimePickerDt

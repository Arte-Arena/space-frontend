'use client';
import React from 'react'
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
const DiffrentDesignDt = () => {

    const [value, setValue] = React.useState(new Date());
    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                    renderInput={(props) => (
                        <CustomTextField
                            {...props}
                            fullWidth
                            size="small"
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
                    value={value}
                    onChange={(newValue) => {
                        setValue(newValue);
                    }}
                />
            </LocalizationProvider>
        </>
    )
}

export default DiffrentDesignDt

'use client';
import React from 'react'
import dayjs from 'dayjs';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import CustomTextField from '../../theme-elements/CustomTextField';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const BasicDateTime = () => {
    const [value3, setValue3] = React.useState(dayjs('2018-01-01T00:00:00.000Z'));
    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MobileDateTimePicker
                    onChange={(newValue) => {
                        setValue3(newValue);
                    }}
                    renderInput={(inputProps) => (
                        <CustomTextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            inputProps={{ 'aria-label': 'basic date picker' }}
                            {...inputProps}
                        />
                    )}
                    value={value3}
                />
            </LocalizationProvider>
        </>
    )
}

export default BasicDateTime


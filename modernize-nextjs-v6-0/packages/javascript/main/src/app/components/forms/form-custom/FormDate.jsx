'use client';
import React from 'react'
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import { LocalizationProvider } from '@mui/x-date-pickers';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
const FormDate = () => {
    const [value, setValue] = React.useState(null);
  return (
    <div>
      
      <CustomFormLabel htmlFor="date">Date</CustomFormLabel>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                renderInput={(props) => (
                  <CustomTextField
                    {...props}
                    fullWidth
                    sx={{
                      '& .MuiSvgIcon-root': {
                        width: 18,
                        height: 18,
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
    </div>
  )
}

export default FormDate

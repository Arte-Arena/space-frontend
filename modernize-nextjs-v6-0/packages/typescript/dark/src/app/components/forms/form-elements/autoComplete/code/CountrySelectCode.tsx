import CodeDialog from "@/app/components/shared/CodeDialog";
import React from "react";
const CountrySelectAutocompleteCode = () => {
    return (
        <>
            <CodeDialog>
                {`
"use client";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';0...............................................0.
import Autocomplete from '@mui/material/Autocomplete';

const CustomTextField = styled((props: any) => <TextField {...props} />)(({ theme }) => ({
  '& .MuiOutlinedInput-input::-webkit-input-placeholder': {
    color: theme.palette.text.secondary,
    opacity: '0.8',
  },
  '& .MuiOutlinedInput-input.Mui-disabled::-webkit-input-placeholder': {
    color: theme.palette.text.secondary,
    opacity: '1',
  },
  '& .Mui-disabled .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.grey[200],
  },
}));

const countryData = [
    { code: 'AD', label: 'Andorra', phone: '376' },
    {
        code: 'AE',
        label: 'United Arab Emirates',
        phone: '971',
    },
    { code: 'AF', label: 'Afghanistan', phone: '93' },
    {
        code: 'AG',
        label: 'Antigua and Barbuda',
        phone: '1-268',
    },
    { code: 'AI', label: 'Anguilla', phone: '1-264' },
    { code: 'AL', label: 'Albania', phone: '355' },
    { code: 'AM', label: 'Armenia', phone: '374' },
    { code: 'AO', label: 'Angola', phone: '244' },
    { code: 'AQ', label: 'Antarctica', phone: '672' },
    { code: 'AR', label: 'Argentina', phone: '54' },
    { code: 'AS', label: 'American Samoa', phone: '1-684' },
    { code: 'AT', label: 'Austria', phone: '43' },
    {
        code: 'AU',
        label: 'Australia',
        phone: '61',
        suggested: true,
    },
];

<Autocomplete
    id="country-select-demo"
    fullWidth
    options={countryData}
    autoHighlight
    getOptionLabel={(option) => option.label}
    renderOption={(props, option) => (
        <Box
            component="li"
            sx={{ fontSize: 15, '& > span': { mr: '10px', fontSize: 18 } }}
            {...props}
        >
            <span>{countryToFlag(option.code)}</span>
            {option.label} ({option.code}) +{option.phone}
        </Box>
    )}
    renderInput={(params) => (
        <CustomTextField
            {...params}
            placeholder="Choose a country"
            aria-label="Choose a country"
            autoComplete="off"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password', // disable autocomplete and autofill
            }}
        />
    )}
/>
);`}
            </CodeDialog>
        </>
    );
};

export default CountrySelectAutocompleteCode;

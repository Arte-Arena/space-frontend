import CodeDialog from "@/app/components/shared/CodeDialog";
import React from "react";
const BasicHeaderFormCode = () => {
    return (
        <>
            <CodeDialog>
                {`
"use client";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { TextField } from '@mui/material';
import { Select } from '@mui/material';
import { FormControl } from '@mui/material';
import Radio, { RadioProps } from '@mui/material/Radio';

const BpIcon2 = styled('span')(({ theme }) => ({
  borderRadius: '50%',
  width: 21,
  height: 21,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 0 0 1px {theme.palette.grey[200]}'
      : 'inset 0 0 0 1px {theme.palette.grey[300]}',
  backgroundColor: 'transparent',
  '.Mui-focusVisible &': {
    outline:
      theme.palette.mode === 'dark'
        ? '0px auto {theme.palette.grey[200]}'
        : '0px auto  {theme.palette.grey[300]}',
    outlineOffset: 2,
  },
  'input:hover ~ &': {
    backgroundColor: theme.palette.primary,
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background: theme.palette.grey[100],
  },
}));

const BpCheckedIcon2 = styled(BpIcon2)(({ theme }) => ({
  boxShadow: 'none',
  '&:before': {
    display: 'block',
    width: 21,
    height: 21,
    backgroundImage:
      theme.palette.mode === 'dark'
        ? 'radial-gradient({theme.palette.background.paper},{theme.palette.background.paper} 28%,transparent 32%)'
        : 'radial-gradient(#fff,#fff 28%,transparent 32%)',
    content: '""',
  },
}));

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

const CustomFormLabel = styled((props: any) => (
  <Typography
    variant="subtitle1"
    fontWeight={600}
    {...props}
    component="label"
    htmlFor={props.htmlFor}
  />
))(() => ({
  marginBottom: '5px',
  marginTop: '25px',
  display: 'block',
}));

const CustomSelect = styled((props: any) => <Select {...props} />)(({}) => ({}));

function CustomRadio(props: RadioProps) {
  return (
    <Radio
      disableRipple
      color="default"
      checkedIcon={
        <BpCheckedIcon2
          sx={{
            backgroundColor: props.color ? '{props.color}.main' : 'primary.main',
          }}
        />
      }
      icon={<BpIcon2 />}
      inputProps={{ 'aria-label': 'Checkbox demo' }}
      {...props}
    />
  );
}

const currencies = [
  {
    value: 'female',
    label: 'Female',
  },
  {
    value: 'male',
    label: 'Male',
  },
  {
    value: 'other',
    label: 'Other',
  },
];

const countries = [
  {
    value: 'india',
    label: 'India',
  },
  {
    value: 'uk',
    label: 'United Kingdom',
  },
  {
    value: 'srilanka',
    label: 'Srilanka',
  },
];

const [currency, setCurrency] = React.useState('');

const handleChange2 = (event: any) => {
    setCurrency(event.target.value);
};

const [selectedValue, setSelectedValue] = React.useState('');

const handleChange3 = (event: any) => {
    setSelectedValue(event.target.value);
};

const [country, setCountry] = React.useState('');

const handleChange4 = (event: any) => {
    setCountry(event.target.value);
};

<form>
    <CustomFormLabel
        sx={{
            mt: 0,
        }}
        htmlFor="success-input"
    >
        Success Input
    </CustomFormLabel>
    <CustomTextField
        id="success-input"
        variant="outlined"
        defaultValue="Success value"
        fullWidth
        required
        sx={{
            '& input:valid + fieldset': {
              borderColor: '#39cb7f',
            },
            '& input:invalid + fieldset': {
              borderColor: '#fc4b6c',
            },
        }}
    />
    <CustomFormLabel htmlFor="error-input">Error Input</CustomFormLabel>
    <CustomTextField
        id="error-input"
        variant="outlined"
        fullWidth
        required
        error
    />
    <FormControl fullWidth error>
        <CustomFormLabel htmlFor="error-text-input">Input with Error text</CustomFormLabel>
        <CustomTextField
            id="error-text-input"
            variant="outlined"
            fullWidth
            required
            error
            helperText="Incorrect entry."
        />
    </FormControl>
</form>
`}
            </CodeDialog>
        </>
    );
};

export default BasicHeaderFormCode;
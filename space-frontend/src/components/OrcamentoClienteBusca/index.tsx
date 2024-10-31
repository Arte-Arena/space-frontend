'use client'

import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';

interface Option {
  label: string;
}

export default function OrcamentoClienteBusca() {
  const [value, setValue] = React.useState<Option | null>(null);
  const options: Option[] = [
    { label: 'Opção 1' },
    { label: 'Opção 2' },
    { label: 'Opção 3' },
  ];

  return (
    <>
      <Autocomplete
        style={{ backgroundColor: 'primary.contrastText', border: '1px solid #ccc' }}
        options={options}
        getOptionLabel={(option) => option.label}
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue as Option);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Escolha um cliente"
            sx={{ label: { color: 'primary.contrastText' } }}
          />
        )}
      />
      <Button
        sx={{
          backgroundColor: 'secondary.main',
          color: 'secondary.contrastText',
          '&:hover': {
            backgroundColor: 'primary.contrastText',
            color: 'secondary.dark',
          },
          my: 2,
          py: 1,
        }}
        variant="contained"
        color="info"
        onClick={() => {
          if (value) {
            alert(`Localizar orçamentos do cliente ${value.label}`);
          } else {
            alert('Selecione um cliente');
          }
        }}
      >
        Localizar orçamentos
      </Button>
    </>

  );
}
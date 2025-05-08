'use client'
import { TextField, FormControlLabel, Checkbox, Grid, MenuItem, FormControl, InputLabel, Select, SelectChangeEvent } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FormState } from '../../types';

interface FormProps {
  form: FormState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}

// chaveiro
// Cordão de Chaveiro
// mouse pad
// tirante


// CORDÃO DE CHAVEIRO
// DIMENSÕES APÓS A DOBRA (45CM)
// LARGURA (2CM)
// MATERIAL (FITA NÃO ALVEJADA)

// TIRANTE
// COMPRIMENTO (140CM)
// LARGURA (3, 4, 5CM)
// MATERIAL (FITA NÃO ALVEJADA)

const FormOutros: React.FC<FormProps> = ({ form, handleChange, handleCheckboxChange, setForm }) => {
  // const [disableDuplaFace, setDisableDuplaFace] = useState(false);

  let tecidos: any[] = [];
  if (form.produto?.toLowerCase().includes('tirante') || form.produto?.toLowerCase().includes('cordão de chaveiro')) {
    tecidos = ["FITA NÃO ALVEJADA"];
  } else if (form.produto?.toLowerCase().includes('mouse')) {
    tecidos = ["NEOPLEX"];
  } else {
    tecidos = ["Tactel", "Cetim", "Oxford", "Star Liso", "Microfibra"];
  }

  const handleSelectChange = (name: string) => (event: SelectChangeEvent<unknown>, _child: React.ReactNode) => {
    const { value } = event.target;
    setForm(prev => ({ ...prev, [name]: value as string }));
  };

  return (
    <>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Material</InputLabel>
            <Select
              value={form.material}
              label="Material"
              onChange={handleSelectChange('material')}
            >
              {tecidos.map((material) => (
                <MenuItem key={material} value={material}>
                  {material}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        

      </Grid>
    </>
  );
};

export default FormOutros;

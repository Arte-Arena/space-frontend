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

const FormBandeiraCarro: React.FC<FormProps> = ({ form, handleChange, handleCheckboxChange, setForm }) => {
  const [disableDuplaFace, setDisableDuplaFace] = useState(false);

  // Tecido fixo entre BEMBER e TACTEL
  const tecidos = ["Bember", "Tactel"];

  useEffect(() => {
    setForm(prev => ({ ...prev, haste: '42cm' }));
  }, [setForm]);

  useEffect(() => {
    if (form.material.toUpperCase() === 'BEMBER') {
      setForm(prev => ({ ...prev, duplaFace: false })); // zera o valor
      setDisableDuplaFace(true); // desabilita o checkbox
    } else {
      setDisableDuplaFace(false); // habilita o checkbox
    }
  }, [form.material, setForm]);

  const handleSelectChange = (name: string) => (event: SelectChangeEvent<unknown>, _child: React.ReactNode) => {
    const { value } = event.target;
    setForm(prev => ({ ...prev, [name]: value as string }));
  };

  return (
    <>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={4}>
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

        <Grid item xs={12} sm={3}>
          <TextField
            label="Composição"
            name="composicao"
            value={form.composicao}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={2}>
          <TextField
            label="Haste"
            name="haste"
            fullWidth
            disabled
            value="42cm"
          />
        </Grid>

        <Grid item xs={12} sm={2} sx={{ marginLeft: '5px' }}>
          <FormControlLabel
            control={
              <Checkbox
                name="duplaFace"
                checked={form.duplaFace}
                onChange={handleCheckboxChange}
                disabled={disableDuplaFace}
              />
            }
            label="Dupla Face"
          />
        </Grid>

      </Grid>
    </>
  );
};

export default FormBandeiraCarro;

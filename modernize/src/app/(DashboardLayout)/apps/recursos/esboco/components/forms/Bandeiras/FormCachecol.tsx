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

const FormCachecol: React.FC<FormProps> = ({ form, handleChange, handleCheckboxChange, setForm }) => {
  const [dimensoes, setDimensoes] = useState('');
  const tecidos = ["CHIMPA"];
  const dimensoesConst = ["130 X 18CM"];

  // CACHECOL
  // DIMENSÕES (130 X 18CM)
  // TECIDO (CHIMPA)
  // DUPLA FACE (NÃO, SIM)
  // FRANJAS (...*)

  const handleChangeDimensoes = (event: SelectChangeEvent<string>) => {
    const { value } = event.target;
    setDimensoes(value);
    if (value === "130 X 18CM") {
      setForm(prev => ({ ...prev, largura: '18', altura: '130' }));
    }
  };

  useEffect(() => {
    if (form.produto.includes('Braçadeira')) {
      setForm(prev => ({ ...prev, fechamento: 'VELCRO' }));
    }
  }, []);

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

        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Dimensões</InputLabel>
            <Select
              label="Dimensões"
              value={dimensoes}
              onChange={handleChangeDimensoes}
            >
              {dimensoesConst.map((dimensao) => (
                <MenuItem key={dimensao} value={dimensao}>
                  {dimensao}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            label="Franjas"
            name="franja"
            fullWidth
            onChange={handleChange}
            value={form.franja}
          />
        </Grid>

        <Grid item xs={12} sm={1.5}>
          <FormControlLabel
            control={
              <Checkbox
                name="duplaFace"
                checked={form.duplaFace}
                onChange={handleCheckboxChange}
              />
            }
            label="Dupla Face"
          />
        </Grid>
      </Grid>
    </>
  );
};

export default FormCachecol;

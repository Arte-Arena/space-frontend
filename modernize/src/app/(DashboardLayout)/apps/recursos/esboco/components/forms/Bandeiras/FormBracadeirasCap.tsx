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

const FormBracadeirasCap: React.FC<FormProps> = ({ form, handleChange, handleCheckboxChange, setForm }) => {
  const [dimensoes, setDimensoes] = useState('');
  const tecidos = ["NEOPRENE"];
  const dimensoesConst = ["ADULTO 38X7CM", "INFANTIL 30X7CM", "PERSONALIZÁVEL"];

  // BRAÇADEIRA DE CAPITÃO
  // DIMENSÕES (ADULTO 38X7CM, INFANTIL 30X7CM, PERSONALIZÁVEL)
  // MATERIAL (NEOPRENE)
  // FECHAMENTO (VELCRO)

  const handleChangeDimensoes = (event: SelectChangeEvent<string>) => {
    const { value } = event.target;
    setDimensoes(value); // || value === "2X2" || value === "3X3"
    if (value === "ADULTO 38X7CM") {
      setForm(prev => ({ ...prev, largura: '38', altura: '7' }));
    }
    if (value === "INFANTIL 30X7CM") {
      setForm(prev => ({ ...prev, largura: '30', altura: '7' }));
    }
    if (value === "PERSONALIZÁVEL") {
      setForm(prev => ({ ...prev, largura: '', altura: '' }));
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
            label="Fechamento"
            name="fechamento"
            fullWidth
            aria-readonly={true}
            value={form.fechamento}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default FormBracadeirasCap;

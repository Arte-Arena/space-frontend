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

const FormBolacao: React.FC<FormProps> = ({ form, handleChange, handleCheckboxChange, setForm }) => {
  const [dimensoes, setDimensoes] = useState('');
  const tecidos = ["Tactel"];
  const dimensoesConst = ["1X1", "1.5X1.5", "2X2", "3X3"];

  const handleChangeDimensoes = (event: SelectChangeEvent<string>) => {
    const { value } = event.target;
    setDimensoes(value); // || value === "2X2" || value === "3X3"
    if (value === "1X1") {
      setForm(prev => ({ ...prev, largura: '1', altura: '1' }));
    }
    if (value === "1.5X1.5") {
      setForm(prev => ({ ...prev, largura: '1.5', altura: '1.5' }));
    }
    if (value === "2X2") {
      setForm(prev => ({ ...prev, largura: '2', altura: '2' }));
    }
    if (value === "3X3") {
      setForm(prev => ({ ...prev, largura: '3', altura: '3' }));
    }
  };

  useEffect(() => {
    if (form.produto === 'Bolachão') {
      setForm(prev => ({ ...prev, estampa: 'SUBLIMADA' }));
    }
  }, []);

  const handleSelectChange = (name: string) => (event: SelectChangeEvent<unknown>, _child: React.ReactNode) => {
    const { value } = event.target;
    setForm(prev => ({ ...prev, [name]: value as string }));
  };

  useEffect(() => {
      const alturaM = parseFloat(form.altura || '0');
      const larguraM = parseFloat(form.largura || '0');
  
      const maior = Math.max(alturaM, larguraM);
      const menor = Math.min(alturaM, larguraM);
  
      if (form.ilhoses && alturaM && larguraM) {
        const ilhosesMaior = (Math.ceil(maior) + 1) * 2;
        const ilhosesMenor = Math.max(0, (Math.ceil(menor) - 2)) * 2;
        const totalIlhoses = ilhosesMaior + ilhosesMenor + 2;
  
        setForm(prev => ({ ...prev, qtdIlhoses: totalIlhoses.toString() }));
      }
    }, [form.altura, form.largura, form.ilhoses]);

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
            label="Estampa"
            name="estampa"
            fullWidth
            aria-readonly={true}
            value={form.estampa}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="ilhoses"
                  checked={form.ilhoses}
                  onChange={handleCheckboxChange}
                />
              }
              label="Ilhóses"
            />
            {form.ilhoses && (
              <TextField
                label="Quantidade"
                name="qtdIlhoses"
                type="number"
                size="small"
                sx={{
                  width: '100px',
                  marginLeft: '10px',
                  'input[type=number]::-webkit-outer-spin-button, input[type=number]::-webkit-inner-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0
                  },
                  'input[type=number]': {
                    MozAppearance: 'textfield'
                  }
                }}
                InputProps={{ inputProps: { min: 0, step: 1 } }}
                value={form.qtdIlhoses}
                onChange={handleChange}
              />
            )}
          </div>
        </Grid>

      </Grid>
    </>
  );
};

export default FormBolacao;

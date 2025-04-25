// ./components/forms/FormBandeira.tsx
import { TextField, FormControlLabel, Checkbox, Grid } from '@mui/material';
import React, { useEffect } from 'react';
import { FormState } from '../types';

interface FormProps {
  form: FormState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}

const FormBandeira: React.FC<FormProps> = ({ form, handleChange, handleCheckboxChange, setForm }) => {

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


  useEffect(() => {
    const alturaM = parseFloat(form.altura || '0');
    const larguraM = parseFloat(form.largura || '0');

    const maior = Math.max(alturaM, larguraM);
    const menor = Math.min(alturaM, larguraM);

    // Cálculo da composição
    if (menor >= 1.5) {
      const partes = Math.ceil(menor / 1.5);
      setForm(prev => ({ ...prev, composicao: `${partes} Partes` }));
    } else {
      setForm(prev => ({ ...prev, composicao: '' }));
    }
  }, [form.altura, form.largura]);

  return (
    <>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Altura (m)"
            name="altura"
            type="number"
            fullWidth
            value={form.altura}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label="Largura (m)"
            name="largura"
            type="number"
            fullWidth
            value={form.largura}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label="Composição"
            name="composicao"
            fullWidth
            value={form.composicao}
            onChange={handleChange}
          />
        </Grid>
      </Grid>

      {/* Linha 3 */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Opção"
            name="opcao"
            fullWidth
            value={form.opcao}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <FormControlLabel
            control={
              <Checkbox
                name="bordaMastro"
                checked={form.bordaMastro}
                onChange={handleCheckboxChange}
              />
            }
            label="Borda Mastro"
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

        <Grid item xs={12} sm={3}>
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

export default FormBandeira;

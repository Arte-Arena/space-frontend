import { Grid, FormControl, InputLabel, Select, MenuItem, TextField, SelectChangeEvent, FormControlLabel, Checkbox } from '@mui/material';
import { FormState } from '../../types';
import { useState } from 'react';
interface FormProps {
  form: FormState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}
// "Faixa de Campeão", "Faixa de Mão", "Sacochila", "Toalha", "Windbanner"

// CANGA
// DIMENSÕES (...)
// TECIDO (STAR LISO, TACTEL)
// ESTAMPA (SUBLIMADA)

// FAIXA DE CAMPEÃO
// DIMENSÕES (155 X 15CM)
// TECIDO (TACTEL, CETIM, OXFORD)
// ESTAMPA (SUBLIMADA)

// FAIXA DE MÃO
// DIMENSÕES (70 X 20CM, 100 X 25CM)
// MATERIAL (TACTEL)
// ESTAMPA (SUBLIMADA)

// SACOCHILA
// DIMENSÕES (40 X 30CM)
// TECIDO (MICROFIBRA)
// ESTAMPA (SUBLIMADA)
// FRENTE E VERSO (NÃO, SIM)

// TOALHA
// DIMENSÕES (140 X 70CM)
// TECIDO (ATOALHADO)
// ESTAMPA (SUBLIMADA)

// WINDBANNER
// DIMENSÃO (2M, 3M, 4M)
// TECIDO (MICROFIBRA)
// MODELO (FACA, VELA, GOTA, PENA)
// ESTAMPA (SUBLIMADA)
// BASE (NÃO, SIM)

const FormularioTresAtributos: React.FC<FormProps> = ({ form, handleChange, handleCheckboxChange, setForm }) => {
  const modelo: any[] = ["Faca", "Vela", "Gota", "Pena"];

  let dimensoes: any[] = [];
  if (form.produto?.toLowerCase().includes('canga')) {
    dimensoes = [""];
  }
  if (form.produto?.toLowerCase().includes('faixa de campeão')) {
    dimensoes = ["155 X 15"];
  }
  if (form.produto?.toLowerCase().includes('faixa de mão')) {
    dimensoes = ["70 X 20", "100 X 25"];
  }
  if (form.produto?.toLowerCase().includes('sacochila')) {
    dimensoes = ["40 X 30"];
  }
  if (form.produto?.toLowerCase().includes('toalha')) {
    dimensoes = ["70 X 140"];
  }
  if (form.produto?.toLowerCase().includes('windbanner')) {
    dimensoes = ["", "2X2", "3X3", "4X4"];
  }

  let tecidos: any[] = [];
  if (form.produto?.toLowerCase().includes('canga')) {
    tecidos = ["Star Liso", "Tactel"];
  } else if (form.produto?.toLowerCase().includes('faixa de campeão')) {
    tecidos = ["Tactel", "Cetim", "Oxford"];
  } else if (form.produto?.toLowerCase().includes('faixa de mão')) {
    tecidos = ["Tactel"];
  } else if (form.produto?.toLowerCase().includes('sacochila') || form.produto?.toLowerCase().includes('windbanner')) {
    tecidos = ["Microfibra"];
  } else if (form.produto?.toLowerCase().includes('toalha')) {
    tecidos = ["Atoalhado"];
  }

  const handleChangeDimensoes = (event: SelectChangeEvent<string>) => {
    const { value } = event.target;
    setForm(prev => ({ ...prev, dimensao: value }));
    let largura = '';
    let altura = '';
    const cleanValue = value.replace(/\s/g, '').toUpperCase(); // Ex: "140X70"
    if (cleanValue.includes('X')) {
      const [larg, alt] = cleanValue.split('X');
      largura = larg || '';
      altura = alt || '';
    }

    if (largura && altura) {
      setForm(prev => ({ ...prev, largura: largura, altura: altura }));
    }
    if (value === "2X2") {
      setForm(prev => ({ ...prev, largura: '2', altura: '2' }));
    }
    if (value === "3X3") {
      setForm(prev => ({ ...prev, largura: '3', altura: '3' }));
    }
    if (value === "4X4") {
      setForm(prev => ({ ...prev, largura: '4', altura: '4' }));
    }
  }


  const handleSelectChange = (name: string) => (event: SelectChangeEvent<string>) => {
    const { value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Grid container spacing={2} mb={2}>
      {/* Material (Tecido) */}
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

      {/* Estampa */}
      <Grid item xs={12} sm={2}>
        <TextField
          label="Estampa"
          name="estampa"
          fullWidth
          value="SUBLIMADA"
          InputProps={{
            readOnly: true,
          }}
        />
      </Grid>

      {/* Dimensões */}
      {!form.produto?.toLowerCase().includes('canga') && (
        <Grid item xs={12} sm={2}>
          <FormControl fullWidth>
            <InputLabel>dimensões</InputLabel>
            <Select
              value={form.dimensao}
              label="dimensao"
              onChange={handleChangeDimensoes}
            >
              {dimensoes.map((dimensao) => (
                <MenuItem key={dimensao} value={dimensao}>
                  {dimensao}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      )}

      {form.produto?.toLowerCase().includes('sacochila') && (
        <Grid item xs={12} sm={2} sx={{ marginLeft: '5px' }}>
          <FormControl fullWidth>
            <FormControlLabel
              control={
                <Checkbox
                  name="duplaFace"
                  checked={form.duplaFace}
                  onChange={handleCheckboxChange}
                />
              }
              label="Frente e Verso"
            />
          </FormControl>
        </Grid>
      )}

      {form.produto?.toLowerCase().includes('windbanner') && (
        <Grid item xs={12} sm={2}>
          <FormControl fullWidth>
            <InputLabel>Modelo</InputLabel>
            <Select
              value={form.modelo}
              label="Modelo"
              onChange={handleSelectChange('modelo')}
            >
              {modelo.map((modelo) => (
                <MenuItem key={modelo} value={modelo}>
                  {modelo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      )}

      {form.produto?.toLowerCase().includes('windbanner') && (
        <Grid item xs={12} sm={1} sx={{ marginLeft: '5px' }}>
          <FormControl fullWidth>
            <FormControlLabel
              control={
                <Checkbox
                  name="duplaFace"
                  checked={form.duplaFace}
                  onChange={handleCheckboxChange}
                />
              }
              label="Base"
            />
          </FormControl>
        </Grid>
      )}
    </Grid>
  );
};

export default FormularioTresAtributos;
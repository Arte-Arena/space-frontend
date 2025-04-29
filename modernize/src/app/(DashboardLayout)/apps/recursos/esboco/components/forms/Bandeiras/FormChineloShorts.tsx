import { Grid, FormControl, InputLabel, Select, MenuItem, TextField, SelectChangeEvent, FormControlLabel, Checkbox } from '@mui/material';
import { FormState } from '../../types';
import { useEffect } from 'react';
interface FormProps {
  form: FormState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}

// CHINELO DE DEDO
// COR DO SOLADO (BRANCO, PRETO, AZUL MARINHO, AZUL CLARO, ROSA, ROXO, VERMELHO, VERDE, AMARELO)
// COR DA TIRA (IGUAL AO SOLADO OBRIGATORIAMENTE)
// ESTAMPA (SUBLIMADA)

// CHINELO SLIDE
// COR DO SOLADO (BRANCO, PRETO, ROSA, AZUL, VERMELHO)
// ESTAMPA (SUBLIMADA)

// SHORTS PRAIA | SHORTS DOLL
// TECIDO (TACTEL)
// CORDÃO (NÃO, PRETO, BRANCO)
// BOLSOS (NÃO, SIM)
// ESTAMPA (SUBLIMADA)

const FormChineloShorts: React.FC<FormProps> = ({ form, handleChange, handleCheckboxChange, setForm }) => {
  const tecidos = ["Tactel"];
  const coresSolados = ["BRANCO", "PRETO", "AZUL MARINHO", "AZUL CLARO", "ROSA", "ROXO", "VERMELHO", "VERDE", "AMARELO"];
  const cordoes = ["NÃO", "PRETO", "BRANCO"];

  const handleSelectChange = (name: string) => (event: SelectChangeEvent<string>) => {
    const { value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    // if (form.produto?.toLowerCase().includes('chinelo de')) {
    setForm(prev => ({ ...prev, corTira: form.corSolado }));
    // }
  }, [form.corSolado]);

  return (
    <Grid container spacing={2} mb={2}>
      {form.produto?.toLowerCase().includes('shorts') && (
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
      )}

      {/* Estampa */}
      <Grid item xs={12} sm={3}>
        <TextField
          label="Estampa"
          name="estampa"
          fullWidth
          value={'Sublimada'}
        // onChange={handleChange}
        />
      </Grid>

      {/* cor do solado */}
      {form.produto?.toLowerCase().includes('chinelo') && (
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Cor do Solado</InputLabel>
            <Select
              value={form.corSolado}
              label="Cor do Solado"
              onChange={handleSelectChange('corSolado')}
            >
              {coresSolados.map((corSolado) => (
                <MenuItem key={corSolado} value={corSolado}>
                  {corSolado}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      )}

      {/* cor da tira */}
      {form.produto?.toLowerCase() === ('chinelo de dedo') && (
        <Grid item xs={12} sm={2}>
          <TextField
            label="Cor da Tira"
            name="corTira"
            fullWidth
            value={form.corTira}
            onChange={handleChange}
            inputProps={{ readOnly: true }}
          />
        </Grid>
      )}

      <Grid item xs={12} sm={3}>
        <FormControl fullWidth>
          <InputLabel>Cordão</InputLabel>
          <Select
            value={form.cordao}
            label="Cordão"
            onChange={handleSelectChange('cordao')}
          >
            {cordoes.map((cordao) => (
              <MenuItem key={cordao} value={cordao}>
                {cordao}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      {form.produto?.toLowerCase().includes('short') && (
        <>

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
                label="Bolsos"
              />
            </FormControl>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default FormChineloShorts;
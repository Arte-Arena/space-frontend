import { Grid, FormControl, InputLabel, Select, MenuItem, TextField, SelectChangeEvent, FormControlLabel, Checkbox } from '@mui/material';
import { FormState } from '../../types';
interface FormProps {
  form: FormState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}

// ESTANDARTE
// DIMENSÕES (...)
// TECIDO (TACTEL, CETIM, OXFORD)
// DUPLA FACE (NÃO, SIM)
// FRANJA (...*)

// FLÂMULA
// DIMENSÕES (...)
// TECIDO (CETIM, TACTEL, OXFORD)
// DUPLA FACE (NÃO, SIM)
// FRANJA (...*)

const FormularioQuatroAtributos: React.FC<FormProps> = ({ form, handleChange, handleCheckboxChange, setForm }) => {
  const tecidos = ["Cetim", "Tactel", "Oxford"];


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
          label="Franjas"
          name="franja"
          fullWidth
          value={form.franja}
          onChange={handleChange}
        />
      </Grid>

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
            label="Dupla Face"
          />
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default FormularioQuatroAtributos;
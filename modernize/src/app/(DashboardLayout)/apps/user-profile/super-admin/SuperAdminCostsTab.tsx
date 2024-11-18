import React from 'react';
import Typography from '@mui/material/Typography';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import { Button } from '@mui/material';


const SuperAdminCostsTab = () => {

  const [tecidoCost, setTecidoCost] = React.useState('');
  const [tintaCost, setTintaCost] = React.useState('');
  const [papelCost, setPapelCost] = React.useState('');
  const [impostoCost, setImpostoCost] = React.useState('');


  const handleTecidoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTecidoCost(e.target.value);
  };

  const handleTintaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTintaCost(e.target.value);
  };

  const handlePapelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPapelCost(e.target.value);
  };

  const handleImpostoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImpostoCost(e.target.value);
  };

  const salvarConfigs = () => {
    const dataBody = {
      tecidoCost: tecidoCost,
      tintaCost: tintaCost,
      papelCost: papelCost,
      impostoCost: impostoCost,
    };

    console.log('DataBody:', dataBody);
  };

  return (
    <>
      <div style={{ marginTop: '20px' }}>
        <Typography
          variant="h4"
          align="center"
          sx={{
            mt: 2,
            mb: 2,
            fontWeight: 'bold',
          }}
        >
          Custos Variáveis
        </Typography>

        <div>

          <CustomFormLabel
            sx={{
              mt: 0,
            }}
            htmlFor="custo-tecido"
          >
            Custo do Tecido
          </CustomFormLabel>
          <CustomTextField
            id="custo-tecido"
            helperText="O custo em reais do tecido."
            variant="outlined"
            fullWidth
            value={tecidoCost}
            onChange={handleTecidoChange}
          />

          <CustomFormLabel
            sx={{
              mt: 0,
            }}
            htmlFor="custo-tinta"
          >
            Custo da Tinta
          </CustomFormLabel>
          <CustomTextField
            id="custo-tinta"
            helperText="O custo em reais da tinta."
            variant="outlined"
            fullWidth
            value={tintaCost}
            onChange={handleTintaChange}
          />
          <CustomFormLabel
            sx={{
              mt: 0,
            }}
            htmlFor="custo-papel"
          >
            Custo do Papel
          </CustomFormLabel>
          <CustomTextField
            id="custo-papel"
            helperText="O custo em reais do papel."
            variant="outlined"
            fullWidth
            value={papelCost}
            onChange={handlePapelChange}
          />
          <CustomFormLabel
            sx={{
              mt: 0,
            }}
            htmlFor="custo-imposto"
          >
            Custo do Imposto
          </CustomFormLabel>
          <CustomTextField
            id="custo-imposto"
            helperText="O custo em reais do imposto."
            variant="outlined"
            fullWidth
            value={impostoCost}
            onChange={handleImpostoChange}
          />
        </div>
        <div style={{ marginTop: '20px' }}>
          <Button variant="contained" onClick={salvarConfigs}>Salvar Configurações</Button>
        </div>

      </div>
    </>
  );
};

export default SuperAdminCostsTab;

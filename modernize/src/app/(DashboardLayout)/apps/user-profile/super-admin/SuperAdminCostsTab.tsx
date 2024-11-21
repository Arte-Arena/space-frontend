import React, { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import { Button, InputAdornment } from '@mui/material';

const SuperAdminCostsTab = () => {
  const [tecidoCost, setTecidoCost] = React.useState('0.00');
  const [tintaCost, setTintaCost] = React.useState('0.00');
  const [papelCost, setPapelCost] = React.useState('0.00');
  const [impostoCost, setImpostoCost] = React.useState('0.00');

  const formatValue = (value: string) => {
    // Remove tudo exceto números e ponto
    const cleanValue = value.replace(/[^\d.]/g, '');
    // Garante que há apenas um ponto decimal
    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      parts[1] = parts.slice(1).join('');
    }
    // Limita a duas casas decimais
    if (parts[1]) {
      parts[1] = parts[1].slice(0, 2);
    }
    // Junta as partes e retorna
    return parts.join('.');
  };

  const handleCostChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatValue(e.target.value);
    setter(formattedValue);
  };

  const salvarConfigs = async () => {
    const dataBody = {
      user_id: 1,
      custo_tecido: parseFloat(tecidoCost),
      custo_tinta: parseFloat(tintaCost),
      custo_papel: parseFloat(papelCost),
      custo_imposto: parseFloat(impostoCost),
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/super-admin/upsert-config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        },
        body: JSON.stringify(dataBody),
      });

      if (!response.ok) {
        throw new Error(`Error saving configurations: ${response.status}`);
      }

      const data = await response.json();
      alert('Configurações salvas com sucesso.');
    } catch (error) {
      console.error('Error:', (error as Error).message);
      alert('Falha ao salvar as configurações.');
    }
  };

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/super-admin/get-config`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching configurations: ${response.status}`);
        }

        const data = await response.json();
        setTecidoCost(data.custo_tecido.toFixed(2));
        setTintaCost(data.custo_tinta.toFixed(2));
        setPapelCost(data.custo_papel.toFixed(2));
        setImpostoCost(data.custo_imposto.toFixed(2));
      } catch (error) {
        console.error('Error:', (error as Error).message);
        alert('Falha ao buscar as configurações.');
      }
    };

    fetchConfig();
  }, []);

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
            helperText="O custo em reais do tecido. (R$)"
            variant="outlined"
            fullWidth
            value={tecidoCost}
            onChange={handleCostChange(setTecidoCost)}
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
            helperText="O custo em reais da tinta. (R$)"
            variant="outlined"
            fullWidth
            value={tintaCost}
            onChange={handleCostChange(setTintaCost)}
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
            helperText="O custo em reais do papel. (R$)"
            variant="outlined"
            fullWidth
            value={papelCost}
            onChange={handleCostChange(setPapelCost)}
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
            helperText="O custo em percentagem do imposto. (%)"
            variant="outlined"
            fullWidth
            value={impostoCost}
            onChange={handleCostChange(setImpostoCost)}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
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

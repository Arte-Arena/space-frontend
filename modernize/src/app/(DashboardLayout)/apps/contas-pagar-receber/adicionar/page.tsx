'use client'
import React, { useState, useEffect } from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import { Button, Select, MenuItem, FormControl, FormControlLabel, Box } from '@mui/material';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomSelect from '@/app/components/forms/theme-elements/CustomSelect';
import ParentCard from '@/app/components/shared/ParentCard';
import { Grid } from "@mui/material";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import CustomCheckbox from '@/app/components/forms/theme-elements/CustomCheckbox';
import { NumericFormat } from 'react-number-format';
import { TextField } from '@mui/material';

const ContasPagarReceberAdicionarScreen = () => {

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [dataVencimento, setDataVencimento] = useState<Date | null>(null);
  const [status, setStatus] = useState('');
  const [tipo, setTipo] = useState('');
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequencia, setFrequencia] = useState('');
  const [vezes, setVezes] = useState('');
  const [proximaRecorrencia, setProximaRecorrencia] = useState<Date | null>(null);

  useEffect(() => {
    if (tipo === 'a pagar') {
      setStatusOptions(['pendente', 'pago']);
    } else if (tipo === 'a receber') {
      setStatusOptions(['pendente', 'recebido']);
    }
  }, [tipo]);

  const formatar = (value: string) => {
    const valorNumerico = value.replace(/[^\d,]/g, '');
    const valorFormatado = valorNumerico.replace(',', '.');
    return valorFormatado;
  };

  function calcularNovaData(dataVencimento: any, frequencia: string) {
    const date = new Date(dataVencimento);

    switch (frequencia) {
      case 'diaria':
        date.setDate(date.getDate() + 1);
        break;
      case 'semanal':
        date.setDate(date.getDate() + 7);
        break;
      case 'quinzenal':
        date.setDate(date.getDate() + 15);
        break;
      case 'mensal':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'anual':
        date.setFullYear(date.getFullYear() + 1);
        break;
    }

    return date;
  }

  const handleFrequecyChange = (value: string) => {
    return new Promise<void>((resolve) => {
      setFrequencia(value);
      setTimeout(() => {
        if (isRecurring && value && dataVencimento) {
          const nextDate = calcularNovaData(dataVencimento, value);
          setProximaRecorrencia(nextDate);
        }
        resolve();
      }, 0);
    });
  };

  const handleSubmit = async () => {

    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      console.error('Access token not found');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/conta`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          conta_titulo: titulo,
          conta_descricao: descricao,
          conta_valor: formatar(valor),
          conta_data_vencimento: dataVencimento?.toISOString().split('T')[0],
          conta_status: status,
          conta_tipo: tipo,
        }),
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        // throw new Error('Failed to create account');
        console.error('Error details:', errorDetails);
      }
      alert('Conta criada com sucesso!');
      setTitulo('');
      setDescricao('');
      setValor('');
      setDataVencimento(null);
      setStatus('');
      setTipo('');
      setStatusOptions([]);
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  return (
    <PageContainer title="Contas a Pagar e a Receber / Adicionar" description="Contas a Pagar e a Receber da Arte Arena">
      <Breadcrumb title="Contas a Pagar e a Receber / Adicionar" subtitle="Gerencie as contas a pagar e a receber da Arte Arena / Adicionar" />
      <ParentCard title="Adicionar Nova Conta" >
        <div>
          <CustomFormLabel
            sx={{
              mt: 0,
            }}
            htmlFor="titulo"
          >
            Título
          </CustomFormLabel>
          <CustomTextField
            id="titulo"
            value={titulo}
            autoFocus
            helperText="Título da conta a pagar ou a receber."
            variant="outlined"
            fullWidth
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitulo(e.target.value)}
          />
          <CustomFormLabel
            sx={{
              mt: 0,
            }}
            htmlFor="titulo"
          >
            Descrição
          </CustomFormLabel>
          <CustomTextField
            id="descricao"
            value={descricao}
            helperText="Descrição da conta."
            variant="outlined"
            fullWidth
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescricao(e.target.value)}
            multiline
          />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel
                htmlFor="valor"
              >Valor</CustomFormLabel>

              <NumericFormat
                value={valor}
                customInput={TextField}
                thousandSeparator='.'
                decimalSeparator=','
                prefix='R$ '
                allowNegative={false}
                fixedDecimalScale={true}
                decimalScale={2}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValor(e.target.value)}
              />

            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel
                htmlFor="data_vencimento"
              >
                Data de Vencimento
              </CustomFormLabel>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Data de Vencimento"
                  value={dataVencimento}
                  onChange={(newValue) => {
                    setDataVencimento(newValue);
                    console.log('dataVencimento atualizada: ', dataVencimento);
                  }}
                  renderInput={(params) => <CustomTextField {...params}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: (theme: any) =>
                          `${theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.12) !important'
                            : '#dee3e9 !important'
                          }`,
                      },

                      "& .MuiFormLabel-colorPrimary": {
                        color: (theme: any) =>
                          `${theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.12) !important'
                            : '#dee3e9 !important'
                          }`,
                      },
                    }}
                  />}
                  inputFormat="dd/MM/yyyy"
                />
              </LocalizationProvider>
            </Grid>
          </Grid>


          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="tipo">
                Tipo
              </CustomFormLabel>
              <FormControl fullWidth variant="outlined" sx={{ mb: '10px' }}>
                <Select
                  id="tipo"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as string)}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Selecione um tipo
                  </MenuItem>
                  <MenuItem value="a pagar">A Pagar</MenuItem>
                  <MenuItem value="a receber">A Receber</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="status">
                Status
              </CustomFormLabel>
              <FormControl fullWidth variant="outlined" sx={{ mb: '10px' }}>
                <CustomSelect
                  id="status"
                  value={status}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStatus(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Selecione um status
                  </MenuItem>
                  {statusOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </FormControl>
            </Grid>
          </Grid>


          <Box
            sx={{
              border: isRecurring ? '1px solid #E5E9F2' : 'none',
              borderRadius: '8px',
              paddingBottom: '20px',
              paddingLeft: '20px',
              paddingRight: '20px',
              marginTop: '20px',
              marginBottom: '20px',
            }}
          >

            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
              <FormControlLabel
                control={
                  <CustomCheckbox
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    name="recurring"
                    color="secondary"
                  />
                }
                label="Conta Recorrente"
                sx={{ marginBottom: '10px' }}
              />
            </div>

            {isRecurring && (
              <div>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4} md={4}>
                    <CustomFormLabel htmlFor="frequencia">
                      Frequencia
                    </CustomFormLabel>
                    <FormControl fullWidth variant="outlined" sx={{ mb: '10px' }}>
                      <CustomSelect
                        id="frequencia"
                        value={frequencia}
                        onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                          await handleFrequecyChange(e.target.value);
                        }}
                        displayEmpty
                      >
                        <MenuItem value="" disabled>
                          Selecione uma frequencia
                        </MenuItem>
                        <MenuItem value="diaria">Diaria</MenuItem>
                        <MenuItem value="semanal">Semanal</MenuItem>
                        <MenuItem value="quinzenal">Quinzenal</MenuItem>
                        <MenuItem value="mensal">Mensal</MenuItem>
                        <MenuItem value="anual">Anual</MenuItem>
                      </CustomSelect>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    <CustomFormLabel
                      htmlFor="proximaRecorrencia"
                    >
                      Data da Próxima Recorrência
                    </CustomFormLabel>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Data da Próxima Recorrência"
                        value={proximaRecorrencia}
                        onChange={(newValue) => {
                          setProximaRecorrencia(newValue);
                        }}
                        renderInput={(params) => <CustomTextField {...params}
                          value={proximaRecorrencia}
                          sx={{
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: (theme: any) =>
                                `${theme.palette.mode === 'dark'
                                  ? 'rgba(255, 255, 255, 0.12) !important'
                                  : '#dee3e9 !important'
                                }`,
                            },

                            "& .MuiFormLabel-colorPrimary": {
                              color: (theme: any) =>
                                `${theme.palette.mode === 'dark'
                                  ? 'rgba(255, 255, 255, 0.12) !important'
                                  : '#dee3e9 !important'
                                }`,
                            },
                          }}
                        />}
                        inputFormat="dd/MM/yyyy"
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    <CustomFormLabel htmlFor="vezes">
                      Recorrências restantes
                    </CustomFormLabel>
                    <CustomTextField
                      id="vezes"
                      type="number"
                      helperText="Quantas vezes esta conta deve ser recorrente."
                      value={vezes}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVezes(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </div>
            )}
          </Box>

          <div style={{ marginTop: '20px' }}>
            <Button
              color="primary"
              variant="contained"
              onClick={handleSubmit}
            >
              Adicionar Conta
            </Button>
          </div>
        </div>
      </ParentCard>
    </PageContainer >
  );
};

export default ContasPagarReceberAdicionarScreen;

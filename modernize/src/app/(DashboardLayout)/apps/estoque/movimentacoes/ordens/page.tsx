'use client';
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Autocomplete,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { Alert, AlertTitle } from '@mui/material'; // Importe o componente Alert do Material UI
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Estoque, Fornecedor, MovimentacaoFormData } from '../components/types';
import { useRouter } from 'next/navigation';
import NotificationSnackbar from '@/utils/snackbar';

export default function NovaMovimentacaoEstoquePage() {
  const [estoques, setEstoques] = useState<Estoque[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [form, setForm] = useState<MovimentacaoFormData>({
    estoque_id: 0,
    data_movimentacao: dayjs(),
    tipo_movimentacao: 'entrada',
    documento: '',
    numero_pedido: '',
    fornecedor_id: 0,
    localizacao_origem: '',
    quantidade: '',
    observacoes: '',
  });
  const [loading, setLoading] = useState(true); // Adicionado estado para controlar o carregamento
  const [error, setError] = useState<string | null>(null); // Adicionado estado para armazenar erros
  const [estoqueInputValue, setEstoqueInputValue] = useState('');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({ open: false, message: '', severity: 'success' });


  const router = useRouter();
  const dataFornecedores = localStorage.getItem('fornecedores');
  const accessToken = localStorage.getItem('accessToken');

  // proteção de rota
  if (!accessToken) {
    router.push('/auth/login');
    return null;
  }


  useEffect(() => {
    const fetchEstoques = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/estoque`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Erro ao buscar estoques: ${response.status}`);
        }
        const data = await response.json();
        setEstoques(data.data); // Ajuste para acessar data.data
      } catch (error: any) {
        setError(error.message);
        setSnackbar({
          open: true,
          message: error.message || 'erro ao pegar itens do estoque!',
          severity: 'warning',
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchFornecedores = async () => {
      try {
        if (dataFornecedores) {
          setFornecedores(JSON.parse(dataFornecedores));
        }
      } catch (error: any) {
        setError(error.message);
        setSnackbar({
          open: true,
          message: error.message || 'erro ao pegar fornecedores!',
          severity: 'warning',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEstoques();
    fetchFornecedores();
  }, []);

  const formatCEP = (cep: string): string => {
    return cep.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2');
  };

  const handleChange = (field: keyof MovimentacaoFormData) => (eventOrValue: any) => {
    let value: string;
    // Suporte a chamadas com evento (onChange) e valor direto (onBlur manual)
    if (typeof eventOrValue === 'string') {
      value = eventOrValue;
    } else if (eventOrValue?.target?.value !== undefined) {
      value = eventOrValue.target.value;
    } else {
      return;
    }
    // Normalização e validação para quantidade
    if (field === 'quantidade') {
      value = value.replace(',', '.');
      if (!/^\d*(\.\d{0,2})?$/.test(value) && value !== '') return;
    }
    setForm((prev) => ({ ...prev, [field]: value }));
  };


  const handleEstoqueChange = (event: any, newValue: Estoque | null) => {
    setForm(prev => ({
      ...prev,
      estoque_id: newValue ? newValue.id : 0, // Atualiza com o ID do objeto selecionado ou 0
    }));
  };

  const handleSubmit = async () => {
    try {
      const dataToSend = {
        ...form,
        data_movimentacao: form.data_movimentacao
          ? form.data_movimentacao.format('YYYY-MM-DD HH:mm:ss')
          : null,
      };

      const response = await fetch(process.env.NEXT_PUBLIC_API + '/api/movimentacao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error(`Erro ao registrar movimentação: ${response.status}`);
      }
      setSnackbar({
        open: true,
        message: 'Dados enviados com sucesso!',
        severity: 'warning',
      });
    } catch (error: any) {
      console.error('Erro ao registrar movimentação:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao registrar movimentação!',
        severity: 'error',
      });
    }
  };

  if (loading) {
    return (
      <Box p={4}>
        <Typography variant="h6">Carregando...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert severity="error">
          <AlertTitle>Erro</AlertTitle>
          {error}
        </Alert>
      </Box>
    );
  }


  return (
    <Box p={4}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" mb={3}>
          Nova Movimentação de Estoque
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={estoques}
              getOptionLabel={(option) => option.nome}
              value={estoques.find((estoque) => estoque.id === form.estoque_id) || null}
              onChange={handleEstoqueChange}
              inputValue={estoqueInputValue}
              onInputChange={(_, newInputValue) => {
                setEstoqueInputValue(newInputValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Item do Estoque"
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Data da Movimentação"
                inputFormat='dd/MM/yyyy'
                value={form.data_movimentacao || null}
                onChange={(date: Dayjs | null) =>
                  setForm((prev) => ({
                    ...prev,
                    data_movimentacao: date,
                  }))
                }
                renderInput={(params) => (
                  <TextField {...params} fullWidth />
                )}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Movimentação</InputLabel>
              <Select
                value={form.tipo_movimentacao}
                label="Tipo de Movimentação"
                onChange={handleChange('tipo_movimentacao')}
              >
                <MenuItem value="entrada">Entrada</MenuItem>
                <MenuItem value="saida">Saída</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label={form.tipo_movimentacao === 'entrada' ? 'N° do Documento' : 'N° do Pedido'}
              fullWidth
              value={form.tipo_movimentacao === 'entrada' ? form.documento : form.numero_pedido}
              onChange={handleChange(form.tipo_movimentacao === 'entrada' ? 'documento' : 'numero_pedido')}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Localização / CEP de Origem"
              fullWidth
              onBlur={(e) => {
                const cep = formatCEP(e.target.value);
                handleChange('localizacao_origem')(cep);
              }}
              value={form.localizacao_origem}
              onChange={handleChange('localizacao_origem')}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Quantidade"
              fullWidth
              type="text" // Alterado para "text"
              value={form.quantidade}
              onChange={handleChange('quantidade')}
              inputProps={{
                inputMode: 'decimal',
                pattern: '^[0-9]+([.,][0-9]{0,2})?$', // Adicionado padrão para números decimais
              }}
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <FormControl fullWidth disabled={form.tipo_movimentacao.includes("saida")}>
              <InputLabel>Fornecedor</InputLabel>
              <Select
                value={form.fornecedor_id}
                label="Fornecedor"
                onChange={handleChange('fornecedor_id')}
              >
                {fornecedores.map((forn) => (
                  <MenuItem key={forn.id} value={forn.id}>
                    {forn.nome_completo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Observações"
              multiline
              rows={4}
              fullWidth
              value={form.observacoes}
              onChange={handleChange('observacoes')}
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Salvar Movimentação
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <NotificationSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        autoHideDuration={900}
      />
    </Box>
  );
}


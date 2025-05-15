import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Button,
  FormHelperText,
  InputAdornment,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { CalendarToday, Add, Delete } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CustomSelect from '@/app/components/forms/theme-elements/CustomSelect';
import { useParams, useRouter } from 'next/navigation';
import NotificationSnackbar from '@/utils/snackbar';

// Tipos para as parcelas
interface Parcela {
  numero: number;
  valor: number;
  status: 'pendente' | 'pago' | 'atrasado' | 'cancelado';
  data: Date;
}

const validationSchema = yup.object({
  numero_pedido: yup.string(),
  documento: yup.string(),
  tipo_documento: yup
    .string(),
  valor_bruto: yup
    .number()
    .min(0, 'Valor deve ser maior ou igual a 0')
    .required('Campo obrigatório'),
  valor_liquido: yup
    .number()
    .min(0, 'Valor deve ser maior ou igual a 0')
    .required('Campo obrigatório'),
  data_operacao: yup.date().required('Data de Operação é obrigatória'),
  tipo: yup
    .string()
    .oneOf(['entrada', 'saida'], 'Tipo inválido')
    .required('Tipo é obrigatório'),
  etapa: yup.string().required('Etapa é obrigatória'),
  status: yup.string().required('Status é obrigatório'),
  observacoes: yup.string().optional(),
  metadados: yup.object({
    forma_pagamento: yup.string(),
    tipo_faturamento: yup.string(),
    parcelas: yup.array().of(
      yup.object({
        numero: yup.number().required(),
        valor: yup.number().min(0).required(),
        status: yup.string().required(),
        data: yup.date().required(),
      })
    ).max(3, 'Máximo de 3 parcelas permitidas'),
  }),
});

// Valores iniciais do formulário
const initialValues = {
  numero_pedido: '',
  documento: '',
  tipo_documento: 'nota fiscal',
  valor_bruto: 0,
  valor_liquido: 0,
  data_operacao: new Date(),
  data_lancamento: new Date(),
  tipo: 'entrada',
  etapa: 'pendente',
  status: 'pendente',
  observacoes: '',

  // Adicionais
  orcamento_id: null,
  orcamento_status_id: null,
  pedido_arte_final_id: null,
  carteira_id: null,
  conta_id: null,
  estoque_id: null,
  fornecedor_id: null,
  cliente_id: null,
  categoria_id: null,
  origin_type: '',
  origin_id: null,
  lista_produtos: [],
  metadados_cliente: {},

  userChangedTipoFaturamento: false,

  metadados: {
    forma_pagamento: '',
    tipo_faturamento: '',
    parcelas: [] as Parcela[],
  },
};

const FormMovimentacoes = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [initialFormValues, setInitialFormValues] = useState(initialValues);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // Carrega dados para edição
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem('accessToken');
          const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/movimentacoes-financeiras/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) throw new Error('Erro ao carregar dados');
          const data = await response.json();
          // Parse dos campos que estão como string JSON
          const parsedMetadados = typeof data.metadados === 'string' ? JSON.parse(data.metadados) : data.metadados;
          const parsedListaProdutos = typeof data.lista_produtos === 'string' ? JSON.parse(data.lista_produtos) : data.lista_produtos;
          const parsedMetadadosCliente = typeof data.metadados_cliente === 'string' ? JSON.parse(data.metadados_cliente) : data.metadados_cliente;
          // Ajusta os dados recebidos para o formato do formulário
          const formattedData = {
            ...data,
            valor_bruto: parseFloat(data.valor_bruto) || 0,
            valor_liquido: parseFloat(data.valor_liquido) || 0,
            data_operacao: data.data_operacao ? new Date(data.data_operacao) : new Date(),
            data_lancamento: data.data_lancamento ? new Date(data.data_lancamento) : new Date(),
            lista_produtos: parsedListaProdutos,
            metadados_cliente: parsedMetadadosCliente,
            metadados: {
              ...parsedMetadados,
              parcelas: parsedMetadados?.parcelas?.map((p: any) => ({
                ...p,
                valor: parseFloat(p.valor) || 0,
                data: p.data ? new Date(p.data) : new Date(),
              })) || [],
            },
          };
          setInitialFormValues(formattedData);
        } catch (error) {
          console.error('Erro ao formatar dados:', error);
          setSnackbar({
            open: true,
            message: 'Erro ao carregar dados da movimentação',
            severity: 'error',
          });
        }
      };
      fetchData();
    }
  }, [id]);

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setSnackbar({
          open: true,
          message: 'Autenticação necessária',
          severity: 'error',
        });
        return;
      }
      // Prepara o body da requisição
      const body = {
        ...values,
        origin_type: 'movimentacoes-financeiras',
        data_operacao: values.data_operacao.toISOString(),
        data_lancamento: values.data_lancamento.toISOString(),
        metadados: {
          ...values.metadados,
          parcelas: values.metadados.parcelas.map(p => ({
            ...p,
            data: p.data.toISOString(),
          })),
        },
      };

      const url = id
        ? `${process.env.NEXT_PUBLIC_API}/api/movimentacoes-financeiras/${id}`
        : `${process.env.NEXT_PUBLIC_API}/api/movimentacoes-financeiras`;
      const method = id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Erro ao salvar movimentação');
      }
      setSnackbar({
        open: true,
        message: id ? 'Movimentação atualizada com sucesso!' : 'Movimentação criada com sucesso!',
        severity: 'success',
      });
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Erro na comunicação com o servidor',
        severity: 'error',
      });
    } finally {
      router.push('/apps/contas-pagar-receber/movimentacoes');
    }
  };

  const handleAddParcela = (values: typeof initialValues, setFieldValue: any) => {
    if (values.metadados.parcelas.length >= 3) return;

    const total = values.valor_bruto;
    const novaQuantidadeParcelas = values.metadados.parcelas.length + 1;
    const valorParcela = total / novaQuantidadeParcelas;

    // Recria todas as parcelas com o novo valor proporcional
    const novasParcelas = Array.from({ length: novaQuantidadeParcelas }, (_, i) => ({
      numero: i + 1,
      valor: valorParcela,
      status: 'pendente',
      data: new Date(new Date().setMonth(new Date().getMonth() + i))
    }));

    setFieldValue('metadados.parcelas', novasParcelas);
  };

  const handleRemoveParcela = (index: number, values: typeof initialValues, setFieldValue: any) => {
    const total = values.valor_bruto;
    const novasParcelas = values.metadados.parcelas
      .filter((_, i) => i !== index)
      .map((p, i) => ({
        ...p,
        numero: i + 1,
        valor: total / (values.metadados.parcelas.length - 1), // Recalcula o valor
        data: new Date(new Date().setMonth(new Date().getMonth() + i))
      }));

    setFieldValue('metadados.parcelas', novasParcelas);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialFormValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange, setFieldValue }) => {

        useEffect(() => {
          if (id) return;
          const qtdParcelas = values.metadados.parcelas.length;
          const total = values.valor_bruto;

          // Se mudou o tipo de faturamento, ajusta as parcelas
          if (values.metadados.tipo_faturamento === 'a_vista' && qtdParcelas > 0) {
            setFieldValue('metadados.parcelas', []);
          }
          else if (values.metadados.tipo_faturamento === 'parcelado' && qtdParcelas !== 2) {
            const valorParcela = total / 2;
            const hoje = new Date();

            setFieldValue('metadados.parcelas', [
              {
                numero: 1,
                valor: valorParcela,
                status: 'pendente',
                data: hoje
              },
              {
                numero: 2,
                valor: valorParcela,
                status: 'pendente',
                data: new Date(hoje.setMonth(hoje.getMonth() + 1))
              }
            ]);
          }
          else if (values.metadados.tipo_faturamento === 'faturado' && qtdParcelas < 2) {
            const valorParcela = total / 3;
            const hoje = new Date();

            setFieldValue('metadados.parcelas', [
              {
                numero: 1,
                valor: valorParcela,
                status: 'pendente',
                data: hoje
              },
              {
                numero: 2,
                valor: valorParcela,
                status: 'pendente',
                data: new Date(hoje.setMonth(hoje.getMonth() + 1))
              },
              {
                numero: 3,
                valor: valorParcela,
                status: 'pendente',
                data: new Date(hoje.setMonth(hoje.getMonth() + 2))
              }
            ]);
          }
        }, [values.metadados.tipo_faturamento, values.valor_liquido, setFieldValue]);

        // Handler para mudança do tipo de faturamento
        const handleTipoFaturamentoChange = (e: React.ChangeEvent<{ value: unknown }>) => {
          const value = e.target.value as string;
          setFieldValue('metadados.tipo_faturamento', value);

          if (id) return;

          // Lógica específica para cada tipo
          if (value === 'a_vista') {
            setFieldValue('metadados.parcelas', []);
          }
          else if (value === 'parcelado') {
            const valorParcela = values.valor_liquido / 2;
            const hoje = new Date();

            setFieldValue('metadados.parcelas', [
              {
                numero: 1,
                valor: valorParcela,
                status: 'pendente',
                data: hoje
              },
              {
                numero: 2,
                valor: valorParcela,
                status: 'pendente',
                data: new Date(hoje.setMonth(hoje.getMonth() + 1))
              }
            ]);
          }
          else if (value === 'faturado') {
            const valorParcela = values.valor_liquido / 3;
            const hoje = new Date();

            setFieldValue('metadados.parcelas', [
              {
                numero: 1,
                valor: valorParcela,
                status: 'pendente',
                data: hoje
              },
              {
                numero: 2,
                valor: valorParcela,
                status: 'pendente',
                data: new Date(hoje.setMonth(hoje.getMonth() + 1))
              },
              {
                numero: 3,
                valor: valorParcela,
                status: 'pendente',
                data: new Date(hoje.setMonth(hoje.getMonth() + 2))
              }
            ]);
          }
        };

        return (
          <Form>
            <Grid container spacing={3}>
              {/* Número do Pedido */}
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  fullWidth
                  name="numero_pedido"
                  label="Número do Pedido"
                  error={touched.numero_pedido && !!errors.numero_pedido}
                  helperText={<ErrorMessage name="numero_pedido" />}
                />
              </Grid>

              {/* Documento */}
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  fullWidth
                  name="documento"
                  label="Documento"
                  error={touched.documento && !!errors.documento}
                  helperText={<ErrorMessage name="documento" />}
                />
              </Grid>

              {/* Tipo de Documento */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={touched.tipo_documento && !!errors.tipo_documento}>
                  <InputLabel>Tipo de Documento</InputLabel>
                  <Select
                    name="tipo_documento"
                    value={values.tipo_documento}
                    onChange={handleChange}
                    label="Tipo de Documento"
                  >
                    <MenuItem value="nota fiscal">Nota Fiscal</MenuItem>
                    <MenuItem value="recibo">Recibo</MenuItem>
                    <MenuItem value="orçamento">Orçamento</MenuItem>
                    <MenuItem value="outros">Outros</MenuItem>
                  </Select>
                  <FormHelperText>
                    <ErrorMessage name="tipo_documento" />
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/* Data de Operação */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={touched.data_operacao && !!errors.data_operacao}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Data de Operação"
                      value={values.data_operacao}
                      onChange={(date) => setFieldValue('data_operacao', date)}
                      inputFormat="dd/MM/yyyy"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={touched.data_operacao && !!errors.data_operacao}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <InputAdornment position="end">
                                <CalendarToday />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                  <FormHelperText>
                    <ErrorMessage name="data_operacao" />
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/* Data de Lançamento */}
              <Grid item xs={12} md={6} style={{ display: 'none' }}>
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Data de Lançamento"
                      value={values.data_lancamento}
                      onChange={(date) => setFieldValue('data_lancamento', date)}
                      inputFormat="dd/MM/yyyy"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <InputAdornment position="end">
                                <CalendarToday />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </FormControl>
              </Grid>

              {/* Valor Bruto */}
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  fullWidth
                  name="valor_bruto"
                  label="Valor Bruto"
                  value={values.valor_bruto.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = parseFloat(e.target.value.replace(/\./g, '').replace(',', '.')) || 0;
                    setFieldValue('valor_bruto', value);
                  }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      color: values.tipo === 'entrada' ? 'success.main' : 'error.main',
                    },
                  }}
                  error={touched.valor_bruto && !!errors.valor_bruto}
                  helperText={touched.valor_bruto && errors.valor_bruto ?
                    <ErrorMessage name="valor_bruto" /> :
                    "Valor Bruto com taxas ou descontos"}
                />
              </Grid>

              {/* Valor Líquido */}
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  fullWidth
                  type="number"
                  name="valor_liquido"
                  label="Valor Líquido"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  }}
                  error={touched.valor_liquido && !!errors.valor_liquido}
                  helperText={touched.valor_liquido && errors.valor_liquido ? <ErrorMessage name="valor_liquido" /> : "Valor Líquido sem taxas ou descontos"}
                />
              </Grid>

              {/* Tipo */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={touched.tipo && !!errors.tipo}>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    name="tipo"
                    value={values.tipo}
                    onChange={handleChange}
                    label="Tipo"
                  >
                    <MenuItem value="entrada">Entrada</MenuItem>
                    <MenuItem value="saida">Saída</MenuItem>
                  </Select>
                  <FormHelperText>
                    <ErrorMessage name="tipo" />
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/* Status Conciliação */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={touched.status && !!errors.status}>
                  <InputLabel>Status</InputLabel>
                  <CustomSelect
                    disabled={!id}
                    name="status"
                    value={values.status}
                    onChange={handleChange}
                    label="Status"
                  >
                    <MenuItem value="">Limpar</MenuItem>
                    <MenuItem value={values.status === "pendente" ? "pendente" : "pendente conciliação"}>
                      Pendente
                    </MenuItem>
                    <MenuItem value="conciliado">conciliado</MenuItem>
                  </CustomSelect>
                  <FormHelperText>
                    {touched.status && errors.status ? (
                      <ErrorMessage name="status" />
                    ) : (
                      "Status da Conciliação"
                    )}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/* Observações */}
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  multiline
                  rows={4}
                  name="observacoes"
                  label="Observações"
                  error={touched.observacoes && !!errors.observacoes}
                  helperText={<ErrorMessage name="observacoes" />}
                />
              </Grid>

              {/* Forma de Pagamento */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={touched.metadados?.forma_pagamento && !!errors.metadados?.forma_pagamento}>
                  <InputLabel>Forma de pagamento</InputLabel>
                  <CustomSelect
                    name="metadados.forma_pagamento"
                    value={values.metadados.forma_pagamento}
                    onChange={handleChange}
                  >
                    <MenuItem value="dinheiro">Dinheiro físico</MenuItem>
                    <MenuItem value="pix">PIX</MenuItem>
                    <MenuItem value="boleto">Boleto</MenuItem>
                    <MenuItem value="debito">Cartão de Débito</MenuItem>
                    <MenuItem value="credito">Cartão de Crédito</MenuItem>
                  </CustomSelect>
                  <FormHelperText>
                    <ErrorMessage name="metadados.forma_pagamento" />
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/* Tipo de Faturamento */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={touched.metadados?.tipo_faturamento && !!errors.metadados?.tipo_faturamento}>
                  <InputLabel>Tipo do faturamento</InputLabel>
                  <CustomSelect
                    name="metadados.tipo_faturamento"
                    value={values.metadados.tipo_faturamento}
                    onChange={handleTipoFaturamentoChange}
                  >
                    <MenuItem value="a_vista">À Vista</MenuItem>
                    <MenuItem value="parcelado">Parcelado (metade/metade)</MenuItem>
                    <MenuItem value="faturado">Faturado</MenuItem>
                  </CustomSelect>
                  <FormHelperText>
                    <ErrorMessage name="metadados.tipo_faturamento" />
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/* Seção de Parcelas */}
              <Grid item xs={12}>
                <Box sx={{ border: '1px solid #eee', borderRadius: 1, p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Parcelas</Typography>
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={() => handleAddParcela(values, setFieldValue)}
                      disabled={values.metadados.parcelas.length >= 3}
                    >
                      Adicionar Parcela
                    </Button>
                  </Box>

                  {values.metadados.parcelas.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                      Nenhuma parcela adicionada
                    </Typography>
                  ) : (
                    <Grid container spacing={2}>
                      {values.metadados.parcelas.map((parcela, index) => (
                        <Grid item xs={12} key={index}>
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle2">Parcela #{parcela.numero}</Typography>
                            </Box>

                            <Box sx={{ flex: 2 }}>
                              <TextField
                                fullWidth
                                type="number"
                                label="Valor"
                                value={parcela.valor}
                                onChange={(e) => {
                                  const novasParcelas = [...values.metadados.parcelas];
                                  novasParcelas[index].valor = Number(e.target.value);
                                  setFieldValue('metadados.parcelas', novasParcelas);
                                }}
                                InputProps={{
                                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                }}
                              />
                            </Box>

                            <Box sx={{ flex: 2 }}>
                              <FormControl fullWidth>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                  <DatePicker
                                    label="Data de Vencimento"
                                    value={parcela.data}
                                    onChange={(date) => {
                                      const novasParcelas = [...values.metadados.parcelas];
                                      novasParcelas[index].data = date || new Date();
                                      setFieldValue('metadados.parcelas', novasParcelas);
                                    }}
                                    inputFormat="dd/MM/yyyy"
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                  />
                                </LocalizationProvider>
                              </FormControl>
                            </Box>

                            <Box sx={{ flex: 2 }}>
                              <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                  value={parcela.status}
                                  onChange={(e) => {
                                    const novasParcelas = [...values.metadados.parcelas];
                                    novasParcelas[index].status = e.target.value as any;
                                    setFieldValue('metadados.parcelas', novasParcelas);
                                  }}
                                  label="Status"
                                >
                                  <MenuItem value="pendente">Pendente</MenuItem>
                                  <MenuItem value="pago">Pago</MenuItem>
                                  <MenuItem value="atrasado">Atrasado</MenuItem>
                                  <MenuItem value="cancelado">Cancelado</MenuItem>
                                </Select>
                              </FormControl>
                            </Box>

                            <Box>
                              <IconButton
                                onClick={() => handleRemoveParcela(index, values, setFieldValue)}
                                color="error"
                              >
                                <Delete />
                              </IconButton>
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              </Grid>

              {/* Botões */}
              <Grid item xs={12} container justifyContent="flex-end" spacing={2}>
                <Grid item>
                  <Button variant="outlined" type="button">
                    Cancelar
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" type="submit">
                    Salvar
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <NotificationSnackbar
              open={snackbar.open}
              message={snackbar.message}
              severity={snackbar.severity}
              onClose={() => setSnackbar({ open: false, message: '', severity: 'success' })}
            />
          </Form>
        )
      }}
    </Formik>
  );
};

export default FormMovimentacoes;
'use client'
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  Paper,
  Avatar,
  CircularProgress,
  Alert,
  Snackbar,
  InputAdornment,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  AlertProps,
  useTheme,
  ThemeProvider,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
  Collapse,
} from '@mui/material';
import {
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Link as LinkIcon,
  Assignment as AssignmentIcon,
  HelpOutline as HelpOutlineIcon,
} from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { IconCoin, IconUser } from '@tabler/icons-react';

// Opções para os selects
const SETORES_OPTIONS = [
  { label: 'Design', hex: '#1E88E5' },
  { label: 'Impressão', hex: '#43A047' },
  { label: 'Sublimação', hex: '#FB8C00' },
  { label: 'Corte & Confêrencia', hex: '#8E24AA' },
  { label: 'Costura', hex: '#F4511E' },
  { label: 'Expedição', hex: '#3949AB' },
  { label: 'Comercial', hex: '#00897B' },
  { label: 'Administrativo', hex: '#D81B60' },
  { label: 'Backoffice', hex: '#5E35B1' },
];

const STATUS_OPTIONS = [
  { label: 'Pendente', color: 'error', hex: '#e53935' },
  { label: 'Em Análise', color: 'info', hex: '#1e88e5' },
  { label: 'Em Correção', color: 'warning', hex: '#fb8c00' },
  { label: 'Resolvido', color: 'primary', hex: '#43a047' },
  { label: 'Recusado', color: 'default', hex: '#4a1b9a' },
];

// Schema de validação
const validationSchema = Yup.object().shape({

  numero_pedido: Yup.number()
    // .required('Número do pedido é obrigatório')
    .integer('Deve ser um número inteiro')
    .positive('Deve ser um número positivo'),

  prejuizo: Yup.number()
    .min(0, 'O prejuízo não pode ser negativo')
    .max(999999.99, 'Valor máximo excedido')
    .nullable(),

  responsavel: Yup.string()
    .max(100, 'Máximo de 100 caracteres'),

  setor: Yup.array()
    .of(Yup.string().required())
    .min(1, 'Selecione pelo menos um setor')
    .required('Setor é obrigatório'),

  link_trello: Yup.string()
    // .required('Link do Trello é obrigatório')
    .url('Deve ser uma URL válida'),

  detalhes: Yup.string()
    .required('Detalhes são obrigatórios')
    .max(500, 'Máximo de 500 caracteres'),

  status: Yup.string()
    .required('Status é obrigatório'),

  solucao: Yup.string()
    .max(500, 'Máximo de 500 caracteres')

});

const ErroForm = () => {
  const [mostrarSolucao, setMostrarSolucao] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: AlertProps['severity'];
  }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const router = useRouter();
  const theme = useTheme();
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    console.error('Access token is missing');
    router.push('/auth/login');
  }

  const params = useParams();
  const id = params.id;

  const searchParams = useSearchParams();
  const numero_pedido = searchParams.get('numero_pedido');

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/erros/${id}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            }
          });
          if (!response.ok) {
            throw new Error('Erro ao buscar os dados');
          }
          const data = await response.json();
          console.log('Dados recebidos:', data);
          formik.setValues({
            numero_pedido: data.numero_pedido ?? '',
            setor: Array.isArray(data.setor)
              ? data.setor
              : (typeof data.setor === 'string' ? data.setor.split(',').map((s: string) => s.trim()) : []),
            responsavel: data.responsavel ?? '',
            prejuizo: data.prejuizo ?? null,
            link_trello: data.link_trello ?? '',
            detalhes: data.detalhes ?? '',
            status: data.status ?? 'Pendente',
            solucao: data.solucao ?? ''
          });
        } catch (error) {
          console.error(error);
          setSnackbar({
            open: true,
            message: 'Erro ao carregar dados para edição',
            severity: 'error'
          });
        }
      }
    };

    fetchData();
  }, [id]);


  // handle submit
  const formik = useFormik({
    initialValues: {
      numero_pedido: numero_pedido ?? '',
      setor: [] as string[],
      responsavel: '',
      prejuizo: null,
      link_trello: '',
      detalhes: '',
      status: 'Pendente',
      solucao: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/erros`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(values)
        });

        if (!response.ok) {
          throw new Error('Erro ao registrar o erro');
        }

        setSnackbar({
          open: true,
          message: 'Erro registrado com sucesso!',
          severity: 'success'
        });
        formik.resetForm();
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Erro ao registrar. Tente novamente.',
          severity: 'error'
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, boxShadow: 15 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 56, height: 56 }}>
              <ErrorIcon fontSize="large" />
            </Avatar>
            <Typography component="h1" variant="h4" sx={{ mt: 2 }}>
              {id ? 'Editar Erro' : 'Registrar Erro'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Preencha todos os campos obrigatórios para registrar um novo erro
            </Typography>
          </Box>

          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              {/* Linha 1: Número do Pedido e Setor */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="numero_pedido"
                  name="numero_pedido"
                  label="Número do Pedido"
                  type="number"
                  value={formik.values.numero_pedido}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.numero_pedido && Boolean(formik.errors.numero_pedido)}
                  helperText={formik.touched.numero_pedido && formik.errors.numero_pedido}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AssignmentIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={formik.touched.setor && Boolean(formik.errors.setor)}>
                  <InputLabel id="setor-label">Setores</InputLabel>
                  <Select
                    labelId="setor-label"
                    id="setor"
                    name="setor"
                    multiple
                    value={formik.values.setor || []}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {Array.isArray(selected) ? selected.map((value) => {
                          const setorOption = SETORES_OPTIONS.find((s) => s.label === value);
                          return (
                            <Chip
                              key={value}
                              label={value}
                              size="small"
                              sx={{
                                backgroundColor: setorOption?.hex || '#9e9e9e',
                                color: 'white',
                                fontWeight: 500,
                              }}
                            />
                          );
                        }) : null}
                      </Box>
                    )}
                  >
                    {SETORES_OPTIONS.map((option) => (
                      <MenuItem key={option.label} value={option.label}>
                        <Checkbox checked={formik.values.setor?.includes(option.label)} />
                        <ListItemText primary={option.label} />
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.setor && formik.errors.setor && (
                    <Typography variant="caption" color="error">
                      {formik.errors.setor}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Linha 2: Responsável e Prejuízo */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="responsavel"
                  name="responsavel"
                  label="Responsável"
                  value={formik.values.responsavel}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.responsavel && Boolean(formik.errors.responsavel)}
                  helperText={formik.touched.responsavel && formik.errors.responsavel}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconUser size={20} color="white" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="prejuizo"
                  name="prejuizo"
                  label="Prejuízo Financeiro (R$)"
                  type="number"
                  value={formik.values.prejuizo ?? ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.prejuizo && Boolean(formik.errors.prejuizo)}
                  helperText={formik.touched.prejuizo && formik.errors.prejuizo}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconCoin size={20} color="white" />
                      </InputAdornment>
                    ),
                    inputProps: {
                      step: "0.01",
                      min: "0"
                    }
                  }}

                />
              </Grid>

              {/* Linha 3: Link do Trello */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="link_trello"
                  name="link_trello"
                  label="Link do Trello"
                  value={formik.values.link_trello}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.link_trello && Boolean(formik.errors.link_trello)}
                  helperText={formik.touched.link_trello && formik.errors.link_trello}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LinkIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Abrir link em nova aba">
                          <IconButton
                            edge="end"
                            onClick={() => window.open(formik.values.link_trello, '_blank')}
                            disabled={!formik.values.link_trello}
                          >
                            <HelpOutlineIcon />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              {/* Linha 4: Status */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="status"
                  name="status"
                  label="Status"
                  select
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.status && Boolean(formik.errors.status)}
                  helperText={formik.touched.status && formik.errors.status}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option.label} value={option.label}>
                      {/* <Chip
                        label={option.label}
                        size="small"
                        color={option.color as any}
                        sx={{ mr: 1 }}
                      /> */}
                      <Chip
                        label={option.label}
                        size="small"
                        sx={{
                          mr: 1,
                          backgroundColor: option.hex,
                          color: 'white',
                          fontWeight: 500
                        }}
                      />
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Divider */}
              <Grid item xs={12}>
                <Divider>
                  <Chip label="Detalhes do Erro" color="primary" />
                </Divider>
              </Grid>

              {/* Detalhes */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="detalhes"
                  name="detalhes"
                  label="Detalhes do Erro"
                  multiline
                  rows={4}
                  value={formik.values.detalhes}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.detalhes && Boolean(formik.errors.detalhes)}
                  helperText={
                    formik.touched.detalhes && formik.errors.detalhes
                      ? formik.errors.detalhes
                      : `${formik.values.detalhes.length}/500 caracteres`
                  }
                  inputProps={{
                    maxLength: 500
                  }}
                />
              </Grid>

              {/* Solução (Opcional) */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', mb: 1 }}>
                  <Typography variant="subtitle1">Solução Proposta (Opcional)</Typography>
                  <IconButton
                    size="small"
                    onClick={() => setMostrarSolucao(!mostrarSolucao)}
                  >
                    {mostrarSolucao ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Box>

                <Collapse in={mostrarSolucao} timeout="auto" unmountOnExit>
                  <TextField
                    fullWidth
                    id="solucao"
                    name="solucao"
                    multiline
                    rows={3}
                    value={formik.values.solucao}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.solucao && Boolean(formik.errors.solucao)}
                    helperText={
                      formik.touched.solucao && formik.errors.solucao
                        ? formik.errors.solucao
                        : `${formik.values.solucao.length}/500 caracteres`
                    }
                    inputProps={{
                      maxLength: 500
                    }}
                  />
                </Collapse>
              </Grid>

              {/* Botões de Ação */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => formik.resetForm()}
                    disabled={isSubmitting}
                  >
                    Limpar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting || !formik.isValid}
                    startIcon={isSubmitting ? <CircularProgress size={20} /> : <CheckCircleIcon />}
                  >
                    {isSubmitting ? (id ? 'Atualizando...' : 'Registrando...') : (id ? 'Atualizar Erro' : 'Registrar Erro')}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>

      {/* Snackbar de Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '12px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(4px)',
            backgroundColor: snackbar.severity === 'success'
              ? 'rgba(46, 125, 50, 0.9)'
              : 'rgba(211, 47, 47, 0.9)'
          }
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          icon={false}
          sx={{
            width: '100%',
            alignItems: 'center',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'common.white',
            '& .MuiAlert-message': {
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default ErroForm;
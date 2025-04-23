'use client'
import React, { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  AlertProps,
  useTheme,
  ThemeProvider
} from '@mui/material';
import {
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Link as LinkIcon,
  Assignment as AssignmentIcon,
  AddCircle as AddCircleIcon,
  Close as CloseIcon,
  HelpOutline as HelpOutlineIcon
} from '@mui/icons-material';
import { useRouter, useSearchParams } from 'next/navigation';

// Opções para os selects
const SETORES = [
  'Design',
  'Impressão',
  'Confeccção',
  'Qualidade',
  'Expedição',
  'Administrativo'
];

const STATUS = [
  'Pendente',
  'Em Análise',
  'Em Correção',
  'Resolvido',
  'Recusado'
];

// Schema de validação
const validationSchema = Yup.object().shape({

  numero_pedido: Yup.number()
    .required('Número do pedido é obrigatório')
    .integer('Deve ser um número inteiro')
    .positive('Deve ser um número positivo'),

  setor: Yup.string()
    .required('Setor é obrigatório'),

  link_trello: Yup.string()
    .required('Link do Trello é obrigatório')
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
  // const [openDialog, setOpenDialog] = useState(false);
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

  const searchParams = useSearchParams();
  const numero_pedido = searchParams.get('numero_pedido');
  
  // handle submit
  const formik = useFormik({
    initialValues: {
      numero_pedido: numero_pedido ?? '',
      setor: '',
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

  // const handleOpenDialog = () => {
  //   setOpenDialog(true);
  // };

  // const handleCloseDialog = () => {
  //   setOpenDialog(false);
  // };

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
              Registro de Erros
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Preencha todos os campos obrigatórios para registrar um novo erro
            </Typography>
          </Box>

          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              {/* Número do Pedido */}
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

              {/* Setor */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="setor"
                  name="setor"
                  label="Setor"
                  select
                  value={formik.values.setor}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.setor && Boolean(formik.errors.setor)}
                  helperText={formik.touched.setor && formik.errors.setor}
                >
                  {SETORES.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Link do Trello */}
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

              {/* Status */}
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
                  {STATUS.map((option) => (
                    <MenuItem key={option} value={option}>
                      <Chip
                        label={option}
                        size="small"
                        color={
                          option === 'Resolvido' ? 'success' :
                            option === 'Pendente' ? 'error' :
                              option === 'Em Correção' ? 'warning' : 'default'
                        }
                        sx={{ mr: 1 }}
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
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1">Solução Proposta (Opcional)</Typography>
                  {/* <Tooltip title="Adicionar solução">
                    <IconButton onClick={handleOpenDialog} color="primary">
                      <AddCircleIcon />
                    </IconButton>
                  </Tooltip> */}
                </Box>
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
                    {isSubmitting ? 'Registrando...' : 'Registrar Erro'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>

      {/* Dialog para Solução Detalhada */}
      {/* <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <ErrorIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Descreva a Solução</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="solucao-dialog"
            name="solucao"
            label="Solução Detalhada"
            type="text"
            fullWidth
            multiline
            rows={8}
            variant="outlined"
            value={formik.values.solucao}
            onChange={formik.handleChange}
            inputProps={{
              maxLength: 500
            }}
            helperText={`${formik.values.solucao.length}/500 caracteres`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleCloseDialog} color="primary">
            Aplicar
          </Button>
        </DialogActions>
      </Dialog> */}

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
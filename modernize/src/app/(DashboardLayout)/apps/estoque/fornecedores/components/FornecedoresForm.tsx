'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import {
  Alert,
  AlertProps,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import { IconUser, IconBuilding } from '@tabler/icons-react';
import { FornecedorForm, ViaCEPResponse } from './Types';


const validationSchema = Yup.object().shape({
  tipo_pessoa: Yup.string().oneOf(['F', 'J']).required(),
  nome: Yup.string().when('tipo_pessoa', {
    is: 'F',
    then: Yup.string().required('Nome é obrigatório'),
  }),
  rg: Yup.string().when('tipo_pessoa', {
    is: 'F',
    then: Yup.string().required('RG é obrigatório'),
  }),
  cpf: Yup.string().when('tipo_pessoa', {
    is: 'F',
    then: Yup.string().required('CPF é obrigatório'),
  }),
  razao_social: Yup.string().when('tipo_pessoa', {
    is: 'J',
    then: Yup.string().required('Razão Social é obrigatória'),
  }),
  cnpj: Yup.string().when('tipo_pessoa', {
    is: 'J',
    then: Yup.string().required('CNPJ é obrigatório'),
  }),
  inscricao_estadual: Yup.string().when('tipo_pessoa', {
    is: 'J',
    then: Yup.string().required('Inscrição Estadual é obrigatória'),
  }),
  email: Yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
  celular: Yup.string().required('Telefone é obrigatório'),
  cep: Yup.string()
    .matches(/^\d{5}-\d{3}$/, 'Formato de CEP inválido')
    .required('CEP é obrigatório'),
  endereco: Yup.string().required('Endereço é obrigatório'),
  numero: Yup.string().required('Número é obrigatório'),
  complemento: Yup.string(),
  bairro: Yup.string().required('Bairro é obrigatório'),
  cidade: Yup.string().required('Cidade é obrigatória'),
  uf: Yup.string().required('UF é obrigatório'),
  produtos_fornecidos: Yup.string().required('Produtos Fornecidos é obrigatório'),
});

const GenericClienteForm: React.FC = () => {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get('id');

  const [loading, setLoading] = useState<boolean>(Boolean(id));
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isCepLoading, setIsCepLoading] = useState<{ [key: string]: boolean }>({
    cep: false,
    cep_cobranca: false
  });
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: AlertProps['severity'];
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const formik = useFormik<FornecedorForm>({
    initialValues: {
      tipo_pessoa: 'F',
      nome: '',
      rg: '',
      cpf: '',
      razao_social: '',
      cnpj: '',
      inscricao_estadual: '',
      email: '',
      celular: '',
      cep: '',
      endereco: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: '',
      produtos_fornecidos: [],
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        const { tipo_pessoa, ...payload } = values;
        const url = id
          ? `${process.env.NEXT_PUBLIC_API}/clientes/${id}`
          : `${process.env.NEXT_PUBLIC_API}/clientes`;
        const method = id ? 'PUT' : 'POST';

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Erro ao salvar');
        router.push('/clientes');
      } catch (err) {
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/clientes/${id}`);
        if (!res.ok) throw new Error('Não encontrado');
        const data: FornecedorForm = await res.json();
        formik.setValues(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatCEP = (cep: string): string => {
    return cep.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2');
  };

  const fetchAddressByCEP = async (cep: string): Promise<ViaCEPResponse | null> => {
    try {
      const cleanCEP = cep.replace(/\D/g, '');
      if (cleanCEP.length !== 8) return null;

      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data: ViaCEPResponse = await response.json();

      if (data.erro) return null;
      return data;
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      return null;
    }
  };

  const handleCEPChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const formatted = formatCEP(e.target.value);
    const cepField = 'cep';

    formik.setFieldValue('cep', formatted);

    if (!/^\d{5}-\d{3}$/.test(formatted)) return;
    setIsCepLoading(prev => ({ ...prev, [cepField]: true }));
    try {
      const address = await fetchAddressByCEP(formatted);
      if (address) {
        formik.setFieldValue('endereco', address.logradouro);
        formik.setFieldValue('bairro', address.bairro);
        formik.setFieldValue('cidade', address.localidade);
        formik.setFieldValue('uf', address.uf);
      } else {
        setSnackbar({
          open: true,
          message: `${'CEP não encontrado. Verifique o CEP informado.'}`,
          severity: 'error'
        });
      }
    } catch {
      setSnackbar({
        open: true,
        message: `${'Erro ao buscar o endereço. Tente novamente.'}`,
        severity: 'error'
      });      
    } finally {
      setIsCepLoading(prev => ({ ...prev, [cepField]: false }));
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth={'80%'} mx="auto" mt={4}>
      <Typography variant="h5" mb={3}>
        {id ? 'Editar Cliente' : 'Cadastrar Cliente'}
      </Typography>

      <form onSubmit={formik.handleSubmit} noValidate>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Tipo de Cliente
            </Typography>
            <Stack direction="row" spacing={2}>
              <Card
                sx={{
                  flex: 1,
                  cursor: 'pointer',
                  border: (theme) =>
                    `2px solid ${formik.values.tipo_pessoa === 'F' ? theme.palette.primary.main : 'transparent'}`,
                  '&:hover': { borderColor: 'primary.main' },
                }}
                onClick={() => formik.setFieldValue('tipo_pessoa', 'F')}
              >
                <CardContent>
                  <Stack spacing={1} alignItems="center">
                    <IconUser
                      size={40}
                      color={
                        formik.values.tipo_pessoa === 'F' ? '#1976d2' : '#757575'
                      }
                    />
                    <Typography
                      variant="h6"
                      color={
                        formik.values.tipo_pessoa === 'F'
                          ? 'primary'
                          : 'text.secondary'
                      }
                    >
                      Pessoa Física
                    </Typography>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      Para clientes individuais, com CPF
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>

              <Card
                sx={{
                  flex: 1,
                  cursor: 'pointer',
                  border: (theme) =>
                    `2px solid ${formik.values.tipo_pessoa === 'J' ? theme.palette.primary.main : 'transparent'}`,
                  '&:hover': { borderColor: 'primary.main' },
                }}
                onClick={() => formik.setFieldValue('tipo_pessoa', 'J')}
              >
                <CardContent>
                  <Stack spacing={1} alignItems="center">
                    <IconBuilding
                      size={40}
                      color={
                        formik.values.tipo_pessoa === 'J' ? '#1976d2' : '#757575'
                      }
                    />
                    <Typography
                      variant="h6"
                      color={
                        formik.values.tipo_pessoa === 'J'
                          ? 'primary'
                          : 'text.secondary'
                      }
                    >
                      Pessoa Jurídica
                    </Typography>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      Para empresas, com CNPJ
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Box>

          {formik.values.tipo_pessoa === 'F' ? (
            <>
              <CustomTextField
                fullWidth
                label="Nome Completo"
                name="nome"
                value={formik.values.nome}
                onChange={formik.handleChange}
                error={!!(formik.touched.nome && formik.errors.nome)}
                helperText={formik.touched.nome && formik.errors.nome}
              />
              <CustomTextField
                fullWidth
                label="CPF"
                name="cpf"
                value={formik.values.cpf}
                onChange={formik.handleChange}
                error={!!(formik.touched.cpf && formik.errors.cpf)}
                helperText={formik.touched.cpf && formik.errors.cpf}
              />
              <CustomTextField
                fullWidth
                label="RG"
                name="rg"
                value={formik.values.rg}
                onChange={formik.handleChange}
                error={!!(formik.touched.rg && formik.errors.rg)}
                helperText={formik.touched.rg && formik.errors.rg}
              />
            </>
          ) : (
            <>
              <CustomTextField
                fullWidth
                label="Razão Social"
                name="razao_social"
                value={formik.values.razao_social}
                onChange={formik.handleChange}
                error={!!(formik.touched.razao_social && formik.errors.razao_social)}
                helperText={formik.touched.razao_social && formik.errors.razao_social}
              />
              <CustomTextField
                fullWidth
                label="CNPJ"
                name="cnpj"
                value={formik.values.cnpj}
                onChange={formik.handleChange}
                error={!!(formik.touched.cnpj && formik.errors.cnpj)}
                helperText={formik.touched.cnpj && formik.errors.cnpj}
              />
              <CustomTextField
                fullWidth
                label="Inscrição Estadual"
                name="inscricao_estadual"
                value={formik.values.inscricao_estadual}
                onChange={formik.handleChange}
                error={!!(formik.touched.inscricao_estadual && formik.errors.inscricao_estadual)}
                helperText={formik.touched.inscricao_estadual && formik.errors.inscricao_estadual}
              />
            </>
          )}

          <CustomTextField
            fullWidth
            label="E-mail"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={!!(formik.touched.email && formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <CustomTextField
            fullWidth
            label="Telefone"
            name="celular"
            value={formik.values.celular}
            onChange={formik.handleChange}
            error={!!(formik.touched.celular && formik.errors.celular)}
            helperText={formik.touched.celular && formik.errors.celular}
          />

          <Typography variant="h6" mt={2}>
            Endereço
          </Typography>
          <CustomTextField
            fullWidth
            label="CEP"
            name="cep"
            value={formik.values.cep}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              formik.handleChange(e); // 1. Chama o handler padrão do Formik
              handleCEPChange(e);    // 2. Chama sua função customizada
            }}
            error={!!(formik.touched.cep && formik.errors.cep)}
            helperText={formik.touched.cep && formik.errors.cep}
            InputProps={{
              endAdornment: isCepLoading.cep && (
                <CircularProgress size={20} color="inherit" />
              ),
            }}
          />
          <CustomTextField
            fullWidth
            label="Endereço"
            name="endereco"
            value={formik.values.endereco}
            onChange={formik.handleChange}
            error={!!(formik.touched.endereco && formik.errors.endereco)}
            helperText={formik.touched.endereco && formik.errors.endereco}
          />
          <CustomTextField
            fullWidth
            label="Número"
            name="numero"
            value={formik.values.numero}
            onChange={formik.handleChange}
            error={!!(formik.touched.numero && formik.errors.numero)}
            helperText={formik.touched.numero && formik.errors.numero}
          />
          <CustomTextField
            fullWidth
            label="Complemento"
            name="complemento"
            value={formik.values.complemento}
            onChange={formik.handleChange}
          />
          <CustomTextField
            fullWidth
            label="Bairro"
            name="bairro"
            value={formik.values.bairro}
            onChange={formik.handleChange}
            error={!!(formik.touched.bairro && formik.errors.bairro)}
            helperText={formik.touched.bairro && formik.errors.bairro}
          />
          <CustomTextField
            fullWidth
            label="Cidade"
            name="cidade"
            value={formik.values.cidade}
            onChange={formik.handleChange}
            error={!!(formik.touched.cidade && formik.errors.cidade)}
            helperText={formik.touched.cidade && formik.errors.cidade}
          />
          <CustomTextField
            fullWidth
            label="UF"
            name="uf"
            select
            value={formik.values.uf}
            onChange={formik.handleChange}
            error={!!(formik.touched.uf && formik.errors.uf)}
            helperText={formik.touched.uf && formik.errors.uf}
            SelectProps={{ native: true }}
          >
            <option value="">Selecione</option>
            {['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].map((uf) => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </CustomTextField>


          <Typography variant="h6" mt={2}>
            Produtos Fornecidos
          </Typography>
          <CustomTextField
            fullWidth
            label="Produtos Fornecidos"
            name="produtos_fornecidos"
            value={formik.values.produtos_fornecidos}
            onChange={formik.handleChange}
            error={!!(formik.touched.produtos_fornecidos && formik.errors.produtos_fornecidos)}
            helperText={formik.touched.produtos_fornecidos && formik.errors.produtos_fornecidos}
          />

          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting || !formik.isValid}
            >
              {submitting ? <CircularProgress size={24} /> : id ? 'Atualizar' : 'Salvar'}
            </Button>
          </Box>
        </Stack>
      </form>

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

    </Box>
  );
};

export default GenericClienteForm;

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import {
  Alert,
  AlertProps,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import { IconUser, IconBuilding } from '@tabler/icons-react';
import { FornecedorForm, Produto, ViaCEPResponse } from './Types';



const validationSchema = Yup.object().shape({
  tipo_pessoa: Yup.string().oneOf(['PF', 'PJ']).required(),
  nome_completo: Yup.string().nullable().when('tipo_pessoa', {
    is: 'PF',
    then: Yup.string().required('Nome_completo é obrigatório'),
  }),
  rg: Yup.string().nullable().when('tipo_pessoa', {
    is: 'PF',
    then: Yup.string().required('RG é obrigatório'),
  }),
  cpf: Yup.string().nullable().when('tipo_pessoa', {
    is: 'PF',
    then: Yup.string().required('CPF é obrigatório'),
  }),
  razao_social: Yup.string().when('tipo_pessoa', {
    is: 'PJ',
    then: Yup.string().required('Razão Social é obrigatória'),
  }),
  cnpj: Yup.string().when('tipo_pessoa', {
    is: 'PJ',
    then: Yup.string().required('CNPJ é obrigatório'),
  }),
  inscricao_estadual: Yup.string().when('tipo_pessoa', {
    is: 'PJ',
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
  produtos: Yup.array()
    .min(1, 'Selecione ao menos um produto')
    .of(
      Yup.object().shape({
        id: Yup.number().required(),
        nome: Yup.string().required(),
      })
    )
    .required('Produtos Fornecidos é obrigatório'),
});

const GenericFornecedorForm: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const dataProdutos = localStorage.getItem("produtosConsolidadosOrcamento");
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    router.push('/login');
    return null;
  }

  const [isCepLoading, setIsCepLoading] = useState(false);
  const [produtosInputValue, setProdutosInputValue] = useState<string | undefined>('');
  const [currentPageProdutos, setCurrentPageProdutos] = useState(1);
  const [searchQueryProdutos, setSearchQueryProdutos] = useState<string>("");
  const [isLoadingProdutos, setIsLoadingProdutos] = useState(false);
  const [allProdutos, setAllProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState<boolean>(Boolean(id));
  const [submitting, setSubmitting] = useState<boolean>(false);
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
      tipo_pessoa: 'PJ',
      nome_completo: '',
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
      produtos: [],
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        const { tipo_pessoa, ...payload } = values;
        const url = id
          ? `${process.env.NEXT_PUBLIC_API}/api/fornecedor/${id}`
          : `${process.env.NEXT_PUBLIC_API}/api/fornecedor`;
        const method = id ? 'PUT' : 'POST';
        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Erro ao salvar');
        router.push('/apps/estoque/fornecedores');
        setSnackbar({
          open: true,
          message: 'Dados enviados com sucesso!',
          severity: 'success',
        });
      } catch (err) {
        console.error(err);
        setSnackbar({
          open: true,
          message: 'Erro ao enviar os Dados',
          severity: 'error',
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/fornecedor/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });
        const fornecedor: FornecedorForm = await res.json();
        // pré-enche todos os campos do form, incluindo produtos
        formik.setValues({
          tipo_pessoa: fornecedor.tipo_pessoa ?? 'PJ',
          nome_completo: fornecedor.nome_completo ?? '',
          rg: fornecedor.rg ?? '',
          cpf: fornecedor.cpf ?? '',
          razao_social: fornecedor.razao_social ?? '',
          cnpj: fornecedor.cnpj ?? '',
          inscricao_estadual: fornecedor.inscricao_estadual ?? '',
          email: fornecedor.email ?? '',
          celular: fornecedor.celular ?? '',
          cep: fornecedor.cep ?? '',
          endereco: fornecedor.endereco ?? '',
          numero: fornecedor.numero ?? '',
          complemento: fornecedor.complemento ?? '',
          bairro: fornecedor.bairro ?? '',
          cidade: fornecedor.cidade ?? '',
          uf: fornecedor.uf ?? '',
          produtos: fornecedor.produtos ?? [],
        });

        setAllProdutos(prev => {
          const selecionados = fornecedor.produtos;
          const novos = selecionados.filter(
            p => !prev.some(existing => existing.id === p.id)
          );
          return [...novos, ...prev];
        });
      } catch (err) {
        console.error(err);
        setSnackbar({
          open: true,
          message: 'Erro ao carregar os dados do fornecedor.',
          severity: 'error',
        });
      } finally {
        setSnackbar({
          open: true,
          message: 'Dados carregados com sucesso!',
          severity: 'success',
        });
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    console.log('tipo_pessoa agora é', formik.values.tipo_pessoa);
  }, [formik.values.tipo_pessoa]);



  useEffect(() => {
    if (!dataProdutos) return;
    const produtosArray = JSON.parse(dataProdutos) as Produto[];
    setAllProdutos(produtosArray);
  }, [dataProdutos]);

  const handleKeyPressProdutos = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      setCurrentPageProdutos(1);
      setAllProdutos([]);
      handleSearchProdutos();
    }
  };

  const handleBlurProduto = () => {
    setCurrentPageProdutos(1);
    setAllProdutos([]);
    handleSearchProdutos();
  };

  const handleSearchProdutos = () => {
    setIsLoadingProdutos(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API}/api/search-produtos-consolidados?search=${searchQueryProdutos}&page=${currentPageProdutos}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Dados recebidos [Produtos]:", data);
        if (Array.isArray(data.data) && data.data.length === 0) {
          console.log("Sem opções disponíveis para essa busca [Produtos]");
          setAllProdutos([
            {
              id: 1,
              nome: searchQueryProdutos,
              preco: 0,
              quantidade: 0,
              prazo: 0,
              peso: 0,
              comprimento: 0,
              largura: 0,
              altura: 0,
              type: " ",
            },
          ]);
        } else {
          // console.log('Opções encontradas [busca de Produtos]');
          setAllProdutos(data.data);
        }
      })
      .catch((error) => console.error("Erro ao buscar Produtos:", error))
      .finally(() => setIsLoadingProdutos(false));
  };

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

  const handleCEPChange = async (cep: string) => {
    const formatted = formatCEP(cep);
    const cepField = 'cep';

    formik.setFieldValue('cep', formatted);

    if (!/^\d{5}-\d{3}$/.test(formatted)) return;
    setIsCepLoading(true);
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
      setIsCepLoading(false);
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
        {id ? 'Editar Fornecedor' : 'Cadastrar Fornecedor'}
      </Typography>

      <form onSubmit={formik.handleSubmit} noValidate>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h6" gutterBottom mb={1}>
              Tipo de Fornecedor
            </Typography>
            <Stack direction="row" spacing={2}>
              <Card
                sx={{
                  flex: 1,
                  cursor: 'pointer',
                  border: (theme) =>
                    `2px solid ${formik.values.tipo_pessoa === 'PF' ? theme.palette.primary.main : 'transparent'}`,
                  '&:hover': { borderColor: 'primary.main' },
                }}
                onClick={() => {
                  formik.setFieldValue('tipo_pessoa', 'PF');
                  if (!id) {
                    formik.setFieldValue('razao_social', '');
                    formik.setFieldValue('cnpj', '');
                    formik.setFieldValue('inscricao_estadual', '');
                  }
                  console.log(formik.values);
                }}
              >
                <CardContent>
                  <Stack spacing={1} alignItems="center">
                    <IconUser
                      size={40}
                      color={
                        formik.values.tipo_pessoa === 'PF' ? '#1976d2' : '#757575'
                      }
                    />
                    <Typography
                      variant="h6"
                      color={
                        formik.values.tipo_pessoa === 'PF'
                          ? 'primary'
                          : 'text.secondary'
                      }
                    >
                      Pessoa Física
                    </Typography>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      Para Fornecedores individuais, com CPF
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>

              <Card
                sx={{
                  flex: 1,
                  cursor: 'pointer',
                  border: (theme) =>
                    `2px solid ${formik.values.tipo_pessoa === 'PJ' ? theme.palette.primary.main : 'transparent'}`,
                  '&:hover': { borderColor: 'primary.main' },
                }}
                onClick={() => {
                  formik.setFieldValue('tipo_pessoa', 'PJ')
                  if (!id) {
                    formik.setFieldValue('nome_completo', '');
                    formik.setFieldValue('rg', '');
                    formik.setFieldValue('cpf', '');
                  }
                  console.log(formik.values);
                }}
              >
                <CardContent>
                  <Stack spacing={1} alignItems="center">
                    <IconBuilding
                      size={40}
                      color={
                        formik.values.tipo_pessoa === 'PJ' ? '#1976d2' : '#757575'
                      }
                    />
                    <Typography
                      variant="h6"
                      color={
                        formik.values.tipo_pessoa === 'PJ'
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

          {formik.values.tipo_pessoa === 'PF' ? (
            <>
              <CustomTextField
                fullWidth
                label="Nome_completo Completo"
                name="nome_completo"
                value={formik.values.nome_completo}
                onChange={formik.handleChange}
                error={!!(formik.touched.nome_completo && formik.errors.nome_completo)}
                helperText={formik.touched.nome_completo && formik.errors.nome_completo}
              />
              <CustomTextField
                fullWidth
                label="CPF"
                name="cpf"
                value={formik.values.cpf || ''}
                onChange={formik.handleChange}
                error={!!(formik.touched.cpf && formik.errors.cpf)}
                helperText={formik.touched.cpf && formik.errors.cpf}
              />
              <CustomTextField
                fullWidth
                label="RG"
                name="rg"
                value={formik.values.rg || ''}
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

          <Divider sx={{ my: 6 }} />

          <Typography variant="h6" mt={2}>
            Endereço
          </Typography>
          <CustomTextField
            fullWidth
            label="CEP"
            name="cep"
            value={formik.values.cep}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              const v = formatCEP(e.target.value);
              formik.setFieldValue('cep', v);
              handleCEPChange(v);
            }}
            error={!!(formik.touched.cep && formik.errors.cep)}
            helperText={formik.touched.cep && formik.errors.cep}
            InputProps={{
              endAdornment: isCepLoading && (
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

          <Divider sx={{ my: 6 }} />

          <Typography variant="h6" mt={2}>
            Produtos Fornecidos
          </Typography>

          <Autocomplete
            multiple
            disablePortal
            fullWidth
            id="produtos-multi"
            loading={isLoadingProdutos}
            options={allProdutos}
            getOptionLabel={(opt) => `${opt.nome}${opt.preco ? ` - R$ ${opt.preco}` : ''}`}
            filterSelectedOptions
            value={formik.values.produtos}
            isOptionEqualToValue={(option, value) =>
              option.id === value.id && option.type === value.type
            }
            onChange={(_, newValue) => {
              formik.setFieldValue('produtos', newValue);
            }}
            onKeyDown={handleKeyPressProdutos}
            onBlur={handleBlurProduto}
            inputValue={produtosInputValue}
            onInputChange={(_, v) => {
              setSearchQueryProdutos(v);
              setProdutosInputValue(v);
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, idx) => {
                const tagProps = getTagProps({ index: idx });
                return (
                  <Chip
                    {...tagProps}
                    label={`${option.nome} - R$ ${option.preco}`}
                  />
                );
              })
            }
            renderInput={(params) => (
              <CustomTextField
                {...params}
                placeholder="Selecione produtos"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: isCepLoading && <CircularProgress size={20} />,
                }}
              />
            )}
          />

          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              onClick={() => {
                console.log('isValid?', formik.isValid, 'errors:', formik.errors);
              }}
            // disabled={submitting || !formik.isValid}
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

export default GenericFornecedorForm;

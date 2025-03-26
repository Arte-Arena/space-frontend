'use client';
import React, { useState } from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Button, 
  FormControlLabel, 
  Checkbox,
  Alert,
  Snackbar,
  Stack,
  Card,
  CardContent,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { IconDeviceFloppy, IconBuilding, IconUser } from '@tabler/icons-react';
import { logger } from '@/utils/logger';

const REGEX = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  cpf: /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/,
  cnpj: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/,
  cep: /^\d{5}-?\d{3}$/,
  onlyNumbers: /^\d+$/,
  onlyLetters: /^[a-zA-ZÀ-ÿ\s]+$/,
};

interface ValidationError {
  field: string;
  message: string;
}

interface AlertMessage {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface ClienteCadastroForm {
  tipo_pessoa: 'J' | 'F';
  nome: string;
  rg: string;
  cpf: string;
  email: string;
  celular: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  razao_social: string;
  cnpj: string;
  inscricao_estadual: string;
  cep_cobranca: string;
  endereco_cobranca: string;
  numero_cobranca: string;
  complemento_cobranca: string;
  bairro_cobranca: string;
  cidade_cobranca: string;
  uf_cobranca: string;
  endereco_cobranca_diferente: boolean;
  orcamento_id: number;
  situacao: string;
}

interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

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

const OrcamentoBackofficeScreen: React.FC = () => {
  const searchParams = useSearchParams();
  const navigate = useRouter();
  const orcamento_id = searchParams.get('id');

  React.useEffect(() => {
    if (!orcamento_id) {
      setAlert({
        type: 'error',
        message: 'ID do orçamento não fornecido. Redirecionando...'
      });

      setTimeout(() => {
        navigate.push('/apps/orcamento/backoffice');
      }, 3000);
    }
  }, [orcamento_id, navigate]);

  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<ClienteCadastroForm>({
    tipo_pessoa: 'F',
    nome: '',
    rg: '',
    cpf: '',
    email: '',
    celular: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    razao_social: '',
    cnpj: '',
    inscricao_estadual: '',
    cep_cobranca: '',
    endereco_cobranca: '',
    numero_cobranca: '',
    complemento_cobranca: '',
    bairro_cobranca: '',
    cidade_cobranca: '',
    uf_cobranca: '',
    endereco_cobranca_diferente: false,
    orcamento_id: Number(orcamento_id),
    situacao: "A"
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [alert, setAlert] = useState<AlertMessage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [openConfirmEditDialog, setOpenConfirmEditDialog] = useState(false);
  const [isCepLoading, setIsCepLoading] = useState<{[key: string]: boolean}>({
    cep: false,
    cep_cobranca: false
  });

  const fetchClientData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/orcamento/backoffice/get-cliente-by-orcamento?orcamento_id=${orcamento_id}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setIsEditing(true);
          setFormData({
            ...formData,
            tipo_pessoa: data.tipo_pessoa === 'PJ' ? 'J' : 'F',
            nome: data.nome_completo || '',
            rg: data.rg || '',
            cpf: data.cpf || '',
            email: data.email || '',
            celular: data.celular || '',
            cep: data.cep || '',
            endereco: data.endereco || '',
            numero: data.numero || '',
            complemento: data.complemento || '',
            bairro: data.bairro || '',
            cidade: data.cidade || '',
            uf: data.uf || '',
            razao_social: data.razao_social || '',
            cnpj: data.cnpj || '',
            inscricao_estadual: data.inscricao_estadual || '',
            cep_cobranca: data.cep_cobranca || '',
            endereco_cobranca: data.endereco_cobranca || '',
            numero_cobranca: data.numero_cobranca || '',
            complemento_cobranca: data.complemento_cobranca || '',
            bairro_cobranca: data.bairro_cobranca || '',
            cidade_cobranca: data.cidade_cobranca || '',
            uf_cobranca: data.uf_cobranca || '',
            endereco_cobranca_diferente: !!(data.endereco_cobranca || data.cep_cobranca),
          });
          setAlert({
            type: 'info',
            message: 'Cliente encontrado! Os dados foram carregados no formulário.'
          });
        }
      }
    } catch (error) {
      logger.error('Error fetching client data:', error);
      setAlert({
        type: 'error',
        message: 'Erro ao carregar dados do cliente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (orcamento_id) {
      fetchClientData();
    } else {
      setIsLoading(false);
    }
  }, [orcamento_id]);

  const validateField = (name: string, value: string): ValidationError | null => {
    if (!value || value.trim() === '') {
      return { field: name, message: `O campo ${name} é obrigatório.` };
    }

    switch (name) {
      case 'email':
        if (!REGEX.email.test(value)) {
          return { field: name, message: 'E-mail inválido.' };
        }
        break;
      case 'cpf':
        if (!REGEX.cpf.test(value)) {
          return { field: name, message: 'CPF inválido. Use o formato: 000.000.000-00' };
        }
        break;
      case 'cnpj':
        if (!REGEX.cnpj.test(value)) {
          return { field: name, message: 'CNPJ inválido. Use o formato: 00.000.000/0000-00' };
        }
        break;
      case 'cep':
      case 'cep_cobranca':
        if (!REGEX.cep.test(value)) {
          return { field: name, message: 'CEP inválido. Use o formato: 00000-000' };
        }
        break;
      case 'nome':
      case 'razao_social':
        if (!REGEX.onlyLetters.test(value)) {
          return { field: name, message: 'Este campo deve conter apenas letras.' };
        }
        break;
    }

    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationError[] = [];
    
    const commonFields = ['email', 'celular', 'cep', 'endereco', 'numero', 'bairro', 'cidade', 'uf'];
    commonFields.forEach(field => {
      const error = validateField(field, formData[field as keyof ClienteCadastroForm] as string);
      if (error) newErrors.push(error);
    });

    if (formData.tipo_pessoa === 'F') {
      ['nome', 'cpf', 'rg'].forEach(field => {
        const error = validateField(field, formData[field as keyof ClienteCadastroForm] as string);
        if (error) newErrors.push(error);
      });
    } else {
      ['razao_social', 'cnpj', 'inscricao_estadual'].forEach(field => {
        const error = validateField(field, formData[field as keyof ClienteCadastroForm] as string);
        if (error) newErrors.push(error);
      });
    }

    if (formData.endereco_cobranca_diferente) {
      const billingFields = ['cep_cobranca', 'endereco_cobranca', 'numero_cobranca', 'bairro_cobranca', 'cidade_cobranca', 'uf_cobranca'];
      billingFields.forEach(field => {
        const error = validateField(field, formData[field as keyof ClienteCadastroForm] as string);
        if (error) newErrors.push(error);
      });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    setErrors(prev => prev.filter(error => error.field !== name));
    
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => [...prev.filter(e => e.field !== name), error]);
    }
  };

  const handleCEPChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, isBilling: boolean = false) => {
    const { value } = e.target;
    const formattedCEP = formatCEP(value);
    const cepField = isBilling ? 'cep_cobranca' : 'cep';
    
    setFormData(prev => ({
      ...prev,
      [cepField]: formattedCEP
    }));

    setErrors(prev => prev.filter(error => error.field !== cepField));

    const cleanCEP = formattedCEP.replace(/\D/g, '');
    if (cleanCEP.length === 8) {
      setIsCepLoading(prev => ({ ...prev, [cepField]: true }));
      try {
        const address = await fetchAddressByCEP(cleanCEP);
        
        if (address) {
          const addressFields = {
            [isBilling ? 'endereco_cobranca' : 'endereco']: address.logradouro,
            [isBilling ? 'bairro_cobranca' : 'bairro']: address.bairro,
            [isBilling ? 'cidade_cobranca' : 'cidade']: address.localidade,
            [isBilling ? 'uf_cobranca' : 'uf']: address.uf,
          };

          setFormData(prev => ({
            ...prev,
            ...addressFields
          }));

          setErrors(prev => prev.filter(error => !Object.keys(addressFields).includes(error.field)));
        } else {
          setAlert({
            type: 'error',
            message: 'CEP não encontrado. Por favor, verifique o CEP informado.'
          });
        }
      } catch (error) {
        setAlert({
          type: 'error',
          message: 'Erro ao buscar o endereço. Por favor, tente novamente.'
        });
      } finally {
        setIsCepLoading(prev => ({ ...prev, [cepField]: false }));
      }
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      endereco_cobranca_diferente: checked,
      ...(checked ? {} : {
        cep_cobranca: '',
        endereco_cobranca: '',
        numero_cobranca: '',
        complemento_cobranca: '',
        bairro_cobranca: '',
        cidade_cobranca: '',
        uf_cobranca: '',
      }),
    }));
    setErrors(prev => prev.filter(error => !error.field.includes('_cobranca')));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setAlert({
        type: 'error',
        message: 'Por favor, corrija os erros no formulário antes de continuar.'
      });
      return;
    }

    if (isEditing) {
      setOpenConfirmEditDialog(true);
      return;
    }

    await saveClient();
  };

  const saveClient = async () => {
    setIsSubmitting(true);
    
    try {
      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_API}/api/orcamento/backoffice/cliente-cadastro/${formData.orcamento_id}`
        : `${process.env.NEXT_PUBLIC_API}/api/orcamento/backoffice/cliente-cadastro`;

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.success === false) {
          setAlert({
            type: 'error',
            message: data.message || 'Erro ao salvar o cliente.'
          });
          return;
        }

        setOpenSuccessDialog(true);
        setIsEditing(true);
        
        if (data.cliente) {
          setFormData(prev => ({
            ...prev,
            ...data.cliente
          }));
        }
      } else {
        const errorData = await response.json();
        setAlert({
          type: 'error',
          message: errorData.message || 'Erro ao salvar o cliente.'
        });
      }
    } catch (error) {
      console.error(error);
      setAlert({
        type: 'error',
        message: 'Ocorreu um erro ao salvar o cliente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (fieldName: string): string | undefined => {
    const error = errors.find(e => e.field === fieldName);
    return error?.message;
  };

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
  ];

  if (isLoading) {
    return (
      <PageContainer>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Stack spacing={2} alignItems="center">
            <CircularProgress size={40} />
            <Typography variant="h6">Carregando dados do cliente...</Typography>
          </Stack>
        </Box>
      </PageContainer>
    );
  }

  if (!orcamento_id) {
    return (
      <PageContainer>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Stack spacing={2} alignItems="center">
            <Typography variant="h6" color="error">
              ID do orçamento não fornecido. Redirecionando...
            </Typography>
            <CircularProgress size={40} />
          </Stack>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Orçamento / Backoffice / Cadastro de Cliente" description="Cadastrar Cliente da Arte Arena">
      <Breadcrumb title="Orçamento / Backoffice / Cadastro de Cliente" subtitle="Cadastrar Cliente da Arte Arena / Backoffice" />
      
      <Snackbar
        open={!!alert}
        autoHideDuration={6000}
        onClose={() => setAlert(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setAlert(null)} 
          severity={alert?.type || 'info'} 
          sx={{ width: '100%' }}
        >
          {alert?.message || ''}
        </Alert>
      </Snackbar>

      <ParentCard title={isEditing ? "Editar Cliente" : "Cadastro de Cliente"}>
        <Stack spacing={3}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Selecione o tipo de cliente
            </Typography>
            <Stack direction="row" spacing={2}>
              <Card 
                sx={{ 
                  width: '100%',
                  cursor: 'pointer',
                  border: (theme) => `2px solid ${formData.tipo_pessoa === 'F' ? theme.palette.primary.main : 'transparent'}`,
                  '&:hover': {
                    borderColor: 'primary.main',
                  }
                }}
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    tipo_pessoa: 'F',
                    nome: '',
                    rg: '',
                    cpf: '',
                    razao_social: '',
                    cnpj: '',
                    inscricao_estadual: '',
                  }));
                  setErrors([]);
                }}
              >
                <CardContent>
                  <Stack spacing={2} alignItems="center">
                    <IconUser size={40} color={formData.tipo_pessoa === 'F' ? '#1976d2' : '#757575'} />
                    <Typography variant="h6" color={formData.tipo_pessoa === 'F' ? 'primary' : 'text.secondary'}>
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
                  width: '100%',
                  cursor: 'pointer',
                  border: (theme) => `2px solid ${formData.tipo_pessoa === 'J' ? theme.palette.primary.main : 'transparent'}`,
                  '&:hover': {
                    borderColor: 'primary.main',
                  }
                }}
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    tipo_pessoa: 'J',
                    nome: '',
                    rg: '',
                    cpf: '',
                    razao_social: '',
                    cnpj: '',
                    inscricao_estadual: '',
                  }));
                  setErrors([]);
                }}
              >
                <CardContent>
                  <Stack spacing={2} alignItems="center">
                    <IconBuilding size={40} color={formData.tipo_pessoa === 'J' ? '#1976d2' : '#757575'} />
                    <Typography variant="h6" color={formData.tipo_pessoa === 'J' ? 'primary' : 'text.secondary'}>
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

          <Stack spacing={3}>
            {formData.tipo_pessoa === 'F' && (
              <>
                <CustomTextField
                  label="Nome Completo"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  fullWidth
                  error={!!getFieldError('nome')}
                  helperText={getFieldError('nome')}
                  required
                />
                <CustomTextField
                  label="CPF"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  fullWidth
                  error={!!getFieldError('cpf')}
                  helperText={getFieldError('cpf')}
                  required
                />
                <CustomTextField
                  label="RG"
                  name="rg"
                  value={formData.rg}
                  onChange={handleInputChange}
                  fullWidth
                  error={!!getFieldError('rg')}
                  helperText={getFieldError('rg')}
                  required
                />
              </>
            )}

            {formData.tipo_pessoa === 'J' && (
              <>
                <CustomTextField
                  label="Razão Social"
                  name="razao_social"
                  value={formData.razao_social}
                  onChange={handleInputChange}
                  fullWidth
                  error={!!getFieldError('razao_social')}
                  helperText={getFieldError('razao_social')}
                  required
                />
                <CustomTextField
                  label="CNPJ"
                  name="cnpj"
                  value={formData.cnpj}
                  onChange={handleInputChange}
                  fullWidth
                  error={!!getFieldError('cnpj')}
                  helperText={getFieldError('cnpj')}
                  required
                />
                <CustomTextField
                  label="Inscrição Estadual"
                  name="inscricao_estadual"
                  value={formData.inscricao_estadual}
                  onChange={handleInputChange}
                  fullWidth
                  error={!!getFieldError('inscricao_estadual')}
                  helperText={getFieldError('inscricao_estadual')}
                  required
                />
              </>
            )}

            <CustomTextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              error={!!getFieldError('email')}
              helperText={getFieldError('email')}
              required
            />
            <CustomTextField
              label="Telefone Celular"
              name="celular"
              value={formData.celular}
              onChange={handleInputChange}
              fullWidth
              error={!!getFieldError('celular')}
              helperText={getFieldError('celular')}
              required
            />

            <h3>Endereço</h3>
            <Stack spacing={2}>
              <CustomTextField
                label="CEP"
                name="cep"
                value={formData.cep}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleCEPChange(e)}
                fullWidth
                error={!!getFieldError('cep')}
                helperText={getFieldError('cep')}
                required
                InputProps={{
                  endAdornment: isCepLoading.cep && (
                    <CircularProgress size={20} color="inherit" />
                  ),
                }}
              />
              <CustomTextField
                label="Endereço"
                name="endereco"
                value={formData.endereco}
                onChange={handleInputChange}
                fullWidth
                error={!!getFieldError('endereco')}
                helperText={getFieldError('endereco')}
                required
              />
              <CustomTextField
                label="Número"
                name="numero"
                value={formData.numero}
                onChange={handleInputChange}
                fullWidth
                error={!!getFieldError('numero')}
                helperText={getFieldError('numero')}
                required
              />
              <CustomTextField
                label="Complemento"
                name="complemento"
                value={formData.complemento}
                onChange={handleInputChange}
                fullWidth
              />
              <CustomTextField
                label="Bairro"
                name="bairro"
                value={formData.bairro}
                onChange={handleInputChange}
                fullWidth
                error={!!getFieldError('bairro')}
                helperText={getFieldError('bairro')}
                required
              />
              <CustomTextField
                label="Cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleInputChange}
                fullWidth
                error={!!getFieldError('cidade')}
                helperText={getFieldError('cidade')}
                required
              />
              <CustomTextField
                label="UF"
                name="uf"
                value={formData.uf}
                onChange={handleInputChange}
                select
                fullWidth
                error={!!getFieldError('uf')}
                helperText={getFieldError('uf')}
                required
                SelectProps={{
                  native: true,
                }}
              >
                <option value="">Selecione</option>
                {estados.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </CustomTextField>
            </Stack>

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.endereco_cobranca_diferente}
                  onChange={handleCheckboxChange}
                  name="endereco_cobranca_diferente"
                  color="primary"
                />
              }
              label="Endereço de Cobrança Diferente"
            />

            {formData.endereco_cobranca_diferente && (
              <>
                <h3>Endereço de Cobrança</h3>
                <Stack spacing={2}>
                  <CustomTextField
                    label="CEP Cobrança"
                    name="cep_cobranca"
                    value={formData.cep_cobranca}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleCEPChange(e, true)}
                    fullWidth
                    error={!!getFieldError('cep_cobranca')}
                    helperText={getFieldError('cep_cobranca')}
                    required
                    InputProps={{
                      endAdornment: isCepLoading.cep_cobranca && (
                        <CircularProgress size={20} color="inherit" />
                      ),
                    }}
                  />
                  <CustomTextField
                    label="Endereço Cobrança"
                    name="endereco_cobranca"
                    value={formData.endereco_cobranca}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!getFieldError('endereco_cobranca')}
                    helperText={getFieldError('endereco_cobranca')}
                    required
                  />
                  <CustomTextField
                    label="Número Cobrança"
                    name="numero_cobranca"
                    value={formData.numero_cobranca}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!getFieldError('numero_cobranca')}
                    helperText={getFieldError('numero_cobranca')}
                    required
                  />
                  <CustomTextField
                    label="Complemento Cobrança"
                    name="complemento_cobranca"
                    value={formData.complemento_cobranca}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <CustomTextField
                    label="Bairro Cobrança"
                    name="bairro_cobranca"
                    value={formData.bairro_cobranca}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!getFieldError('bairro_cobranca')}
                    helperText={getFieldError('bairro_cobranca')}
                    required
                  />
                  <CustomTextField
                    label="Cidade Cobrança"
                    name="cidade_cobranca"
                    value={formData.cidade_cobranca}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!getFieldError('cidade_cobranca')}
                    helperText={getFieldError('cidade_cobranca')}
                    required
                  />
                  <CustomTextField
                    label="UF Cobrança"
                    name="uf_cobranca"
                    value={formData.uf_cobranca}
                    onChange={handleInputChange}
                    select
                    fullWidth
                    error={!!getFieldError('uf_cobranca')}
                    helperText={getFieldError('uf_cobranca')}
                    required
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="">Selecione</option>
                    {estados.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </CustomTextField>
                </Stack>
              </>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '16px' }}>
              <Button
                color="primary"
                variant="contained"
                onClick={handleSubmit}
                disabled={isSubmitting || errors.length > 0}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <>
                    <IconDeviceFloppy style={{ marginRight: '8px' }} />
                    {isEditing ? 'Editar Cliente' : 'Salvar Cliente'}
                  </>
                )}
              </Button>
            </div>
          </Stack>
        </Stack>
      </ParentCard>

      <Dialog
        open={openSuccessDialog}
        onClose={() => setOpenSuccessDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', color: 'success.main' }}>
          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <Typography variant="h6" component="span">
              Cliente {isEditing ? 'Atualizado' : 'Cadastrado'} com Sucesso!
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" align="center" sx={{ mt: 2 }}>
            Os dados do cliente foram {isEditing ? 'atualizados' : 'salvos'} com sucesso no sistema.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenSuccessDialog(false)}
          >
            Continuar Editando
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate.push('/apps/orcamento/backoffice')}
          >
            Voltar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openConfirmEditDialog}
        onClose={() => setOpenConfirmEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', color: 'warning.main' }}>
          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7h20L12 2z"/>
              <path d="M2 17h20v-7H2v7z"/>
              <path d="M12 22v-5"/>
            </svg>
            <Typography variant="h6" component="span">
              Confirmar Edição
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" align="center" sx={{ mt: 2 }}>
            Tem certeza de que deseja editar os dados do cliente?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              setOpenConfirmEditDialog(false);
              await saveClient();
            }}
          >
            Confirmar
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setOpenConfirmEditDialog(false)}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default OrcamentoBackofficeScreen;

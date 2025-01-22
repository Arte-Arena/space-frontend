'use client';
import React, { useState, useEffect } from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CircularProgress from '@mui/material/CircularProgress';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, FormControl, FormControlLabel, RadioGroup, Radio, Checkbox } from '@mui/material';
import { IconDeviceFloppy } from '@tabler/icons-react';

interface ClienteCadastroForm {
  tipo_pessoa: 'PJ' | 'PF';
  nome_completo: string;
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
}

const OrcamentoBackofficeScreen: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id') ?? null;

  const [formData, setFormData] = useState<ClienteCadastroForm>({
    tipo_pessoa: 'PF',
    nome_completo: '',
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
    uf: '', // Inicializando com valor vazio
    razao_social: '',
    cnpj: '',
    inscricao_estadual: '',
    cep_cobranca: '',
    endereco_cobranca: '',
    numero_cobranca: '',
    complemento_cobranca: '',
    bairro_cobranca: '',
    cidade_cobranca: '',
    uf_cobranca: '', // Inicializando com valor vazio
    endereco_cobranca_diferente: false,
  });

  const [isTipoPessoaSelected, setIsTipoPessoaSelected] = useState(false);

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    throw new Error('Access token is missing');
  }

  const { isFetching, error } = useQuery({
    queryKey: ['clientData'],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API}/api/orcamento/backoffice/get-cliente-cadastro?id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((res) => res.json()),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTipoPessoaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, tipo_pessoa: event.target.value as 'PJ' | 'PF' }));
    setIsTipoPessoaSelected(true);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, endereco_cobranca_diferente: e.target.checked }));
  };

  const handleSubmit = async () => {
    try {

      const formDataWithOrcamentoId = { ...formData, orcamentoId: id };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/orcamento/backoffice/cliente-cadastro`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formDataWithOrcamentoId),
      });

      if (response.ok) {
        alert('Cliente salvo com sucesso!');
        setFormData({
          tipo_pessoa: 'PF',
          nome_completo: '',
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
        });
        setIsTipoPessoaSelected(false);
      } else {
        const errorData = await response.json();
        alert(`Erro ao salvar: ${errorData.message}`);
      }
    } catch (error) {
      console.error(error);
      alert('Ocorreu um erro ao salvar o cliente.');
    }
  };

  if (isFetching) return <CircularProgress />;
  if (error) return <p>Ocorreu um erro ao buscar os dados do cliente.</p>;

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
  ];

  return (
    <PageContainer title="Orçamento / Backoffice / Cadastro de Cliente" description="Cadastrar Cliente da Arte Arena">
      <Breadcrumb title="Orçamento / Backoffice / Cadastro de Cliente" subtitle="Cadastrar Cliente da Arte Arena / Backoffice" />
      <ParentCard title="Cadastro de Cliente">
        <div>
          <FormControl component="fieldset">
            <RadioGroup row aria-label="tipo_pessoa" name="tipo_pessoa" onChange={handleTipoPessoaChange}>
              <FormControlLabel value="PF" control={<Radio />} label="Pessoa Física" />
              <FormControlLabel value="PJ" control={<Radio />} label="Pessoa Jurídica" />
            </RadioGroup>
          </FormControl>

          {isTipoPessoaSelected && (
            <>
              {formData.tipo_pessoa === 'PF' && (
                <>
                  <CustomTextField
                    label="Nome Completo"
                    name="nome_completo"
                    value={formData.nome_completo}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                  <CustomTextField
                    label="CPF"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                  <CustomTextField
                    label="RG"
                    name="rg"
                    value={formData.rg}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </>
              )}

              {formData.tipo_pessoa === 'PJ' && (
                <>
                  <CustomTextField
                    label="Razão Social"
                    name="razao_social"
                    value={formData.razao_social}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                  <CustomTextField
                    label="CNPJ"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                  <CustomTextField
                    label="Inscrição Estadual"
                    name="inscricao_estadual"
                    value={formData.inscricao_estadual}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </>
              )}

              <CustomTextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <CustomTextField
                label="Telefone Celular"
                name="celular"
                value={formData.celular}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />

              {/* Endereço */}
              <h3>Endereço</h3>
              <CustomTextField
                label="CEP"
                name="cep"
                value={formData.cep}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <CustomTextField
                label="Endereço"
                name="endereco"
                value={formData.endereco}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <CustomTextField
                label="Número"
                name="numero"
                value={formData.numero}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <CustomTextField
                label="Complemento"
                name="complemento"
                value={formData.complemento}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <CustomTextField
                label="Bairro"
                name="bairro"
                value={formData.bairro}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <CustomTextField
                label="Cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <CustomTextField
                name="uf"
                value={formData.uf || ''} // Garantindo que "AC" não seja selecionado por padrão
                onChange={handleInputChange}
                select
                fullWidth
                margin="normal"
                variant="outlined"
                SelectProps={{
                  native: true,
                }}
              >
                <option value="">Selecione</option> {/* Opção vazia para evitar seleção inicial do AC */}
                {estados.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </CustomTextField>

              {/* Endereço de Cobrança Diferente */}
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
                  <CustomTextField
                    label="CEP Cobrança"
                    name="cep_cobranca"
                    value={formData.cep_cobranca}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                  <CustomTextField
                    label="Endereço Cobrança"
                    name="endereco_cobranca"
                    value={formData.endereco_cobranca}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                  <CustomTextField
                    label="Número Cobrança"
                    name="numero_cobranca"
                    value={formData.numero_cobranca}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                  <CustomTextField
                    label="Complemento Cobrança"
                    name="complemento_cobranca"
                    value={formData.complemento_cobranca}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                  <CustomTextField
                    label="Bairro Cobrança"
                    name="bairro_cobranca"
                    value={formData.bairro_cobranca}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                  <CustomTextField
                    label="Cidade Cobrança"
                    name="cidade_cobranca"
                    value={formData.cidade_cobranca}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                  <CustomTextField
                    name="uf_cobranca"
                    value={formData.uf_cobranca || ''} // Garantindo que "AC" não seja selecionado por padrão
                    onChange={handleInputChange}
                    select
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="">Selecione</option> {/* Opção vazia para evitar seleção inicial do AC */}
                    {estados.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </CustomTextField>
                </>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '16px' }}>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleSubmit}
                >
                  <IconDeviceFloppy style={{ marginRight: '8px' }} />
                  Salvar Cliente
                </Button>
              </div>
            </>
          )}
        </div>
      </ParentCard>
    </PageContainer>
  );
};

export default OrcamentoBackofficeScreen;

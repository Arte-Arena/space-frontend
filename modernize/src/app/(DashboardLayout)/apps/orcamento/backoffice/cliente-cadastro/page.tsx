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

const OrcamentoBackofficeScreen: React.FC = () => {
  const searchParams = useSearchParams();
  const navigate = useRouter();
  const id = searchParams.get('id') ?? null;

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
    orcamento_id: Number(id),
    situacao: "A"
  });


  const [isTipoPessoaSelected, setIsTipoPessoaSelected] = useState(false);

  // const accessToken = localStorage.getItem('accessToken');
  // if (!accessToken) {
  //   throw new Error('Access token is missing');
  // }

  // const { isFetching, error } = useQuery({
  //   queryKey: ['clientData'],
  //   queryFn: () =>
  //     fetch(`${process.env.NEXT_PUBLIC_API}/api/orcamento/backoffice/get-cliente-cadastro?id=${id}`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }).then((res) => res.json()),
  // });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTipoPessoaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as 'J' | 'F';
    setFormData((prev) => ({ ...prev, tipo_pessoa: value }));
    setIsTipoPessoaSelected(true);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, endereco_cobranca_diferente: e.target.checked }));
  };

  const handleSubmit = async () => {

    // console.log(formData);

    // validação de CNPJ
    if (formData.tipo_pessoa == 'J') {
      if (formData.razao_social === "" || formData.razao_social === null || formData.razao_social === undefined) {
        alert("razao social é um campo obrigatorio.");
        return;
      }
      if (formData.cnpj === "" || formData.cnpj === null || formData.cnpj === undefined) {
        alert("cnpj é um campo obrigatorio.");
        return;
      }
      if (formData.inscricao_estadual === "" || formData.inscricao_estadual === null || formData.inscricao_estadual === undefined) {
        alert("inscricao estadual é um campo obrigatorio.");
        return;
      }
    }

    // validação de CPF
    if (formData.tipo_pessoa == 'F') {
      if (formData.nome === "" || formData.nome === null || formData.nome === undefined) {
        alert("nome é um campo obrigatorio.");
        return;
      }
      if (formData.cpf === "" || formData.cpf === null || formData.cpf === undefined) {
        alert("CPF é um campo obrigatorio.");
        return;
      }
      if (formData.rg === "" || formData.rg === null || formData.rg === undefined) {
        alert("RG é um campo obrigatorio.");
        return;
      }
    }

    console.log('chegou aqui 1');
    for (const [key, value] of Object.entries(formData)) {
      if (value === "" || value === null || value === undefined) {
        console.log('chegou aqui 2');
        let mensagem;
    
        if (key === "email" && !/\S+@\S+\.\S+/.test(value)) {
          alert("E-mail inválido.");
          return;
        }
        console.log('chegou aqui 3');
    
        if (key === "email") mensagem = "O campo E-mail é obrigatório.";
        else if (key === "celular") mensagem = "O campo Celular é obrigatório.";
        else if (key === "cep") mensagem = "O campo CEP é obrigatório.";
        else if (key === "endereco") mensagem = "O campo Endereço é obrigatório.";
        else if (key === "numero") mensagem = "O campo Número é obrigatório.";
        else if (key === "bairro") mensagem = "O campo Bairro é obrigatório.";
        else if (key === "cidade") mensagem = "O campo Cidade é obrigatório.";
        else if (key === "uf") mensagem = "O campo UF é obrigatório.";
        
        if (formData.endereco_cobranca_diferente) {
          if (key === "cep_cobranca") mensagem = "O campo CEP de Cobrança é obrigatório.";
          else if (key === "endereco_cobranca") mensagem = "O campo Endereço de Cobrança é obrigatório.";
          else if (key === "numero_cobranca") mensagem = "O campo Número de Cobrança é obrigatório.";
          else if (key === "bairro_cobranca") mensagem = "O campo Bairro de Cobrança é obrigatório.";
          else if (key === "cidade_cobranca") mensagem = "O campo Cidade de Cobrança é obrigatório.";
          else if (key === "uf_cobranca") mensagem = "O campo UF de Cobrança é obrigatório.";
        }
    
        if (mensagem) {
          alert(mensagem);
        }
      }
    }

    console.log('chegou aqui 5');

    try {
      console.log('chegou aqui 6');

      const formDataWithOrcamentoId = { ...formData, orcamentoId: id };


      console.log("Payload enviado:", JSON.stringify(formDataWithOrcamentoId, null, 2));


      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/orcamento/backoffice/cliente-cadastro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataWithOrcamentoId),
      });

      console.log("Status da resposta:", response.status);
      const data = await response.json();
      console.log("Resposta completa:", data);

      if (data.retorno.status === "Erro") {
        const registros = data.retorno.registros;
        const ultimoRegistro = registros[registros.length - 1];
        if (ultimoRegistro && ultimoRegistro.registro && ultimoRegistro.registro.erros && ultimoRegistro.registro.erros.length > 0) {
          const ultimoErro = ultimoRegistro.registro.erros[ultimoRegistro.registro.erros.length - 1];
          const mensagemErro = ultimoErro.erro;
          alert('Cliente não salvo! ' + mensagemErro);
          return
        }
      }

      if (response.ok) {
        alert('Cliente salvo com sucesso!');
        setIsTipoPessoaSelected(false);
        // levar a pessoa pra uma pagina de sucesso pra ela não se confundir e mandar duas vezes ou mais a requisição.
        navigate.push('/apps/orcamento/backoffice/cliente-cadastro/sucesso');
      } else {
        const errorData = await response.json();
        console.log(errorData.message)
        alert(`Erro ao salvar: ${errorData.message}`);
      }
    } catch (error) {
      console.error(error);
      alert('Ocorreu um erro ao salvar o cliente.');
    }
  };

  // if (isFetching) return <CircularProgress />;
  // if (error) return <p>Ocorreu um erro ao buscar os dados do cliente.</p>;

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
  ];

  return (
    <PageContainer title="Orçamento / Backoffice / Cadastro de Cliente" description="Cadastrar Cliente da Arte Arena">
      <Breadcrumb title="Orçamento / Backoffice / Cadastro de Cliente" subtitle="Cadastrar Cliente da Arte Arena / Backoffice" />
      <ParentCard title="Cadastro de Cliente">
        <>
          <FormControl component="fieldset">
            <RadioGroup row aria-label="tipo_pessoa" name="tipo_pessoa" onChange={handleTipoPessoaChange}>
              <FormControlLabel value="F" control={<Radio />} label="Pessoa Física" />
              <FormControlLabel value="J" control={<Radio />} label="Pessoa Jurídica" />
            </RadioGroup>
          </FormControl>

          {isTipoPessoaSelected && (
            <>
              {formData.tipo_pessoa === 'F' && (
                <>
                  <CustomTextField
                    label="Nome Completo"
                    name="nome"
                    value={formData.nome}
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

              {formData.tipo_pessoa === 'J' && (
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
        </>
      </ParentCard>
    </PageContainer>
  );
};

export default OrcamentoBackofficeScreen;

'use client'
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Grid,
  Autocomplete,
  Container,
  CircularProgress,
  AlertProps,
  Chip,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { Fornecedor, Produto } from './Types';
import NotificationSnackbar from '../../../../../utils/snackbar';

export interface EstoqueData {
  nome: string;
  descricao: string;
  variacoes: string[];
  unidade_medida: string;
  quantidade: number;
  estoque_min: number;
  estoque_max: number;
  categoria: string;
  fornecedores: Fornecedor[];
  produto_id: number | '';
  produto_table: string;
  produtos?: Produto[];
}

interface EstoqueFormProps {
  initialValues?: Partial<EstoqueData>;
  onSubmit: (values: EstoqueData) => void;
}

export default function EstoqueForm({ initialValues = {}, onSubmit }: EstoqueFormProps) {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const dataProdutos = localStorage.getItem("produtosConsolidadosOrcamento");
  const dataFornecedores = localStorage.getItem("fornecedores");
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    router.push('/login');
    return null;
  }

  const [fornecedoresInputValue, setFornecedoresInputValue] = useState('');
  const [searchQueryFornecedores, setSearchQueryFornecedores] = useState('');
  const [isLoadingFornecedores, setIsLoadingFornecedores] = useState(false);
  const [allFornecedores, setAllFornecedores] = useState<Fornecedor[]>([]);
  const [selectedFornecedores, setSelectedFornecedores] = useState<Fornecedor[]>([]);
  const [currentPageFornecedores, setCurrentPageFornecedores] = useState(1);
  //
  const [produtosInputValue, setProdutosInputValue] = useState<string | undefined>('');
  const [currentPageProdutos, setCurrentPageProdutos] = useState(1);
  const [searchQueryProdutos, setSearchQueryProdutos] = useState<string>("");
  const [isLoadingProdutos, setIsLoadingProdutos] = useState(false);
  const [allProdutos, setAllProdutos] = useState<Produto[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(
    null
  );
  const [values, setValues] = useState<EstoqueData>({
    nome: initialValues.nome || '',
    descricao: initialValues.descricao || '',
    variacoes: initialValues.variacoes || [],
    unidade_medida: initialValues.unidade_medida || '',
    quantidade: initialValues.quantidade || 0,
    estoque_min: initialValues.estoque_min || 0,
    estoque_max: initialValues.estoque_max || 0,
    categoria: initialValues.categoria || '',
    fornecedores: initialValues.fornecedores || [],
    produto_id: initialValues.produto_id ?? '',
    produto_table: initialValues.produto_table || '',
  });


  const handleChange = (field: keyof EstoqueData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setValues((prev) => ({
      ...prev,
      [field]: field === 'quantidade' || field === 'estoque_min' || field === 'estoque_max' || field === 'produto_id'
        ? Number(value)
        : value,
    } as any));
  };

  useEffect(() => {
    if (!dataProdutos) return;
    const produtosArray = JSON.parse(dataProdutos) as Produto[];
    setAllProdutos(produtosArray);
  }, [dataProdutos]);


  useEffect(() => {
    if (!dataFornecedores) return;
    const fornecedoresArray = JSON.parse(dataFornecedores) as Fornecedor[];
    setAllFornecedores(fornecedoresArray);
  }, [dataFornecedores]);


  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
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

  const handleSearchFornecedores = () => {
    setIsLoadingFornecedores(true);
    fetch(`${process.env.NEXT_PUBLIC_API}/api/search-fornecedores?search=${searchQueryFornecedores}&page=${currentPageFornecedores}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })
      .then(res => res.json())
      .then(data => {
        setAllFornecedores(Array.isArray(data.data) ? data.data : []);
      })
      .finally(() => setIsLoadingFornecedores(false));
  };

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setCurrentPageFornecedores(1);
      setAllFornecedores([]);
      handleSearchFornecedores();
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
        {/* <Typography variant="h4" gutterBottom textAlign="center">
          Adicionar Produto ao Estoque
        </Typography> */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(values);
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nome"
                value={values.nome}
                onChange={handleChange('nome')}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Categoria"
                value={values.categoria}
                onChange={handleChange('categoria')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descrição"
                value={values.descricao}
                onChange={handleChange('descricao')}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Quantidade"
                type="number"
                value={values.quantidade}
                onChange={handleChange('quantidade')}
                fullWidth
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Unidade de Medida"
                value={values.unidade_medida}
                onChange={handleChange('unidade_medida')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Estoque Mínimo"
                type="number"
                value={values.estoque_min}
                onChange={handleChange('estoque_min')}
                fullWidth
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Estoque Máximo"
                type="number"
                value={values.estoque_max}
                onChange={handleChange('estoque_max')}
                fullWidth
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                freeSolo
                disabled={true}
                options={[]}
                value={values.variacoes}
                onChange={(e, newValue) =>
                  setValues((prev) => ({ ...prev, variacoes: newValue }))
                }
                renderInput={(params) => <TextField {...params} label="Variações" />}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                freeSolo
                disablePortal
                options={allFornecedores}
                getOptionLabel={opt => typeof opt === 'string' ? opt : opt.nome_completo}
                filterSelectedOptions
                value={selectedFornecedores}
                onChange={(_, newValue) => {
                  const norm = newValue.map(v => typeof v === 'string'
                    ? ({ id: 0, tipo_pessoa: '', nome_completo: v, rg: '', cpf: '', razao_social: '', cnpj: '', inscricao_estadual: '', email: '', celular: '', cep: '', endereco: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '', produtos: [], created_at: new Date(), updated_at: new Date() })
                    : v
                  );
                  setSelectedFornecedores(norm);
                  setValues(prev => ({ ...prev, fornecedores: norm }));
                }}
                inputValue={fornecedoresInputValue}
                onInputChange={(_, v) => { setFornecedoresInputValue(v); setSearchQueryFornecedores(v); }}
                loading={isLoadingFornecedores}
                onKeyDown={e => handleKeyDownInput(e)}
                onBlur={() => { setCurrentPageFornecedores(1); setAllFornecedores([]); handleSearchFornecedores(); }}
                renderTags={(value, getTagProps) => value.map((opt, idx) => (
                  <Chip {...getTagProps({ index: idx })} label={opt.nome_completo} />
                ))}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Fornecedores"
                    placeholder="Digite para buscar ou criar"
                    helperText="Selecione ou digite nomes e pressione Enter"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: isLoadingFornecedores && <CircularProgress size={20} />
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <Autocomplete
                options={allProdutos}
                getOptionLabel={opt => opt.nome ?? ''}
                value={selectedProduct}
                onChange={(_, newValue) => {
                  setSelectedProduct(newValue);
                  setValues(prev => ({
                    ...prev,
                    nome: newValue?.nome ?? '',
                    produto_id: newValue?.id ?? '',
                    produto_table: newValue?.type ?? '',
                  }));
                }}
                inputValue={produtosInputValue}
                onInputChange={(_, v) => { setProdutosInputValue(v); setSearchQueryProdutos(v); }}
                loading={isLoadingProdutos}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Produto (opcional)"
                    fullWidth
                    onKeyDown={handleInputKeyDown}
                    helperText="Selecione um produto já cadastrado ou pressione Enter para buscar"
                  />
                )}
              />
            </Grid>
          </Grid>
          <Box textAlign="center" mt={4}>
            <Button variant="contained" size="large" type="submit">
              Salvar
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}

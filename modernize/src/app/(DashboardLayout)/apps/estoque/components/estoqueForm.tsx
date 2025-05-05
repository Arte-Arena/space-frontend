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
  Chip,
  Checkbox,
  FormControlLabel,
  InputAdornment,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { Fornecedor, Produto, ProdutoForm, Variacoes } from './Types';

export interface EstoqueData {
  nome: string;
  descricao: string;
  variacoes: Variacoes[];
  unidade_medida: string;
  quantidade: number;
  estoque_min: number;
  estoque_max: number;
  categoria: string;
  fornecedores: Fornecedor[];
  produto_id: number | '';
  preco_produto: number | '';
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
  const id = (params as any).id;
  
  // LocalStorage e autenticação
  const dataProdutos = localStorage.getItem('produtosConsolidadosOrcamento');
  const dataFornecedores = localStorage.getItem('fornecedores');
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    router.push('/login');
  }

  // Estados de Fornecedores
  const [fornecedoresInputValue, setFornecedoresInputValue] = useState('');
  const [searchQueryFornecedores, setSearchQueryFornecedores] = useState('');
  const [isLoadingFornecedores, setIsLoadingFornecedores] = useState(false);
  const [allFornecedores, setAllFornecedores] = useState<Fornecedor[]>([]);
  const [currentPageFornecedores, setCurrentPageFornecedores] = useState(1);
  
  // Estados de Produtos
  const [produtosInputValue, setProdutosInputValue] = useState('');
  const [currentPageProdutos, setCurrentPageProdutos] = useState(1);
  const [searchQueryProdutos, setSearchQueryProdutos] = useState('');
  const [isLoadingProdutos, setIsLoadingProdutos] = useState(false);
  const [allProdutos, setAllProdutos] = useState<Produto[]>([]);
  
  
  const [selectedFornecedores, setSelectedFornecedores] = useState<Fornecedor[]>(
    initialValues.fornecedores ?? []
  );

  // 2) Pré-seleciona produto (cria um objeto Produto mínimo):
  const [selectedProduct, setSelectedProduct] = useState<ProdutoForm | null>(
    initialValues.produto_id
      ? {
          id: initialValues.produto_id as number,
          nome: initialValues.nome as string,
          preco: initialValues.preco_produto as number,
          type: initialValues.produto_table as string,
        }
      : null
  );
  
  // Estado do formulário
  const [values, setValues] = useState<EstoqueData>({
    nome: initialValues.nome || '',
    descricao: initialValues.descricao || '',
    unidade_medida: initialValues.unidade_medida || '',
    quantidade: initialValues.quantidade || 0,
    estoque_min: initialValues.estoque_min || 0,
    estoque_max: initialValues.estoque_max || 0,
    categoria: initialValues.categoria || '',
    fornecedores: initialValues.fornecedores || [],
    preco_produto: initialValues.preco_produto ?? '',
    produto_id: initialValues.produto_id ?? '',
    produto_table: initialValues.produto_table || '',
    variacoes:
      initialValues.variacoes && initialValues.variacoes.length > 0
        ? initialValues.variacoes
        : [
            { color: '', material: '', tamanhos: '', franjas: '', altura: '', largura: '', comprimento: '', preco: '' },
          ],
  });

  // Handlers gerais
  const handleChange = (field: keyof Omit<EstoqueData, 'variacoes' | 'fornecedores' | 'produtos'>) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const raw = event.target.value;
    const value = ['quantidade', 'estoque_min', 'estoque_max', 'produto_id'].includes(field)
      ? Number(raw)
      : raw;
    setValues(prev => ({ ...prev, [field]: value } as any));
  };

  const handleVariacaoChange =
    (index: number, field: keyof Variacoes) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValues(prev => {
        const novo = [...prev.variacoes];
        novo[index] = { ...novo[index], [field]: value };
        return { ...prev, variacoes: novo };
      });
    };

  const addVariacao = () => {
    setValues(prev => ({
      ...prev,
      variacoes: [...prev.variacoes, { color: '', material: '', tamanhos: '', franjas: '', altura: '', largura: '', comprimento: '', preco: '' }],
    }));
  };

  const removeVariacao = (idx: number) => {
    setValues(prev => ({
      ...prev,
      variacoes: prev.variacoes.filter((_, i) => i !== idx),
    }));
  };

  // Efeitos de carregamento
  useEffect(() => {
    if (dataProdutos) {
      setAllProdutos(JSON.parse(dataProdutos));
    }
  }, [dataProdutos]);

  useEffect(() => {
    if (dataFornecedores) {
      setAllFornecedores(JSON.parse(dataFornecedores));
    }
  }, [dataFornecedores]);

  // Busca Produtos
  const handleSearchProdutos = () => {
    setIsLoadingProdutos(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API}/api/search-produtos-consolidados?search=${searchQueryProdutos}&page=${currentPageProdutos}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
      .then(res => res.json())
      .then(data => {
        setAllProdutos(
          Array.isArray(data.data) && data.data.length > 0
            ? data.data
            : [
                { id: 0, nome: searchQueryProdutos, preco: 0, quantidade: 0, prazo: 0, peso: 0, comprimento: 0, largura: 0, altura: 0, type: '' },
              ]
        );
      })
      .finally(() => setIsLoadingProdutos(false));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setCurrentPageProdutos(1);
      handleSearchProdutos();
    }
  };

  // Busca Fornecedores
  const handleSearchFornecedores = () => {
    setIsLoadingFornecedores(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API}/api/search-fornecedores?search=${searchQueryFornecedores}&page=${currentPageFornecedores}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
      .then(res => res.json())
      .then(data => setAllFornecedores(Array.isArray(data.data) ? data.data : []))
      .finally(() => setIsLoadingFornecedores(false));
  };

  const handleKeyDownFornecedores = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setCurrentPageFornecedores(1);
      handleSearchFornecedores();
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSubmit(values);
          }}
        >
          <Grid container spacing={2}>
            {/* Dados básicos */}
            <Grid item xs={12}>
              <Box mb={1} fontWeight="bold">Dados Gerais</Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Nome" value={values.nome} onChange={handleChange('nome')} required fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Categoria" value={values.categoria} onChange={handleChange('categoria')} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descrição"
                value={values.descricao}
                onChange={handleChange('descricao')}
                multiline rows={3} fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Unidade de Medida"
                value={values.unidade_medida}
                onChange={handleChange('unidade_medida')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Quantidade"
                type="number"
                value={values.quantidade}
                onChange={handleChange('quantidade')}
                InputProps={{ inputProps: { min: 0 } }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Estoque Mínimo"
                type="number"
                value={values.estoque_min}
                onChange={handleChange('estoque_min')}
                InputProps={{ inputProps: { min: 0 } }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Estoque Máximo"
                type="number"
                value={values.estoque_max}
                onChange={handleChange('estoque_max')}
                InputProps={{ inputProps: { min: 0 } }}
                fullWidth
              />
            </Grid>

            {/* Variações */}
            <Grid item xs={12}>
              <Box mb={1} fontWeight="bold">Variações</Box>
            </Grid>
            {values.variacoes.map((v, idx) => (
              <React.Fragment key={idx}>
                <Grid item xs={12} sm={2}>
                  <TextField
                    label="Cor"
                    value={v.color}
                    onChange={handleVariacaoChange(idx, 'color')}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    label="Material"
                    value={v.material}
                    onChange={handleVariacaoChange(idx, 'material')}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={1.5}>
                  <TextField
                    label="Tamanhos"
                    placeholder="ex: P,M,G"
                    value={v.tamanhos}
                    onChange={handleVariacaoChange(idx, 'tamanhos')}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={1.15}>
                  <TextField
                    label="Altura (cm)"
                    type="number"
                    value={v.altura}
                    onChange={handleVariacaoChange(idx, 'altura')}
                    InputProps={{ inputProps: { min: 0 } }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={1.15}>
                  <TextField
                    label="Largura (cm)"
                    type="number"
                    value={v.largura}
                    onChange={handleVariacaoChange(idx, 'largura')}
                    InputProps={{ inputProps: { min: 0 } }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={1.15}>
                  <TextField
                    label="Comprimento (cm)"
                    type="number"
                    value={v.comprimento}
                    onChange={handleVariacaoChange(idx, 'comprimento')}
                    InputProps={{ inputProps: { min: 0 } }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <TextField
                    label="Preço (R$)"
                    type="number"
                    value={v.preco}
                    onChange={handleVariacaoChange(idx, 'preco')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                      inputProps: { min: 0, step: 0.01 },
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={0.5}>
                  <FormControlLabel
                    control={<Checkbox
                      checked={v.franjas === 'true'}
                      onChange={e => handleVariacaoChange(idx, 'franjas')({
                        target: { value: e.target.checked ? 'true' : 'false' }
                      } as any)}
                    />}
                    label="Franjas"
                  />
                </Grid>
                <Grid item xs={12} sm={1} textAlign={'right'}>
                  <Button variant="outlined" color="error" onClick={() => removeVariacao(idx)}>
                    –
                  </Button>
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12}>
              <Button variant="contained" onClick={addVariacao}>
                + Adicionar Variação
              </Button>
            </Grid>

            {/* Fornecedores */}
            <Grid item xs={12}>
              <Box my={1} fontWeight="bold">Dados Complementares</Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple freeSolo disablePortal
                options={allFornecedores}
                getOptionLabel={opt => typeof opt === 'string' ? opt : opt.nome_completo}
                filterSelectedOptions
                value={selectedFornecedores}
                onChange={(_, newVal) => {
                  const norm = newVal.map(v => typeof v === 'string'
                    ? { id: 0, nome_completo: v } as Fornecedor
                    : v
                  );
                  setSelectedFornecedores(norm);
                  setValues(prev => ({ ...prev, fornecedores: norm }));
                }}
                inputValue={fornecedoresInputValue}
                onInputChange={(_, v) => { setFornecedoresInputValue(v); setSearchQueryFornecedores(v); }}
                loading={isLoadingFornecedores}
                onKeyDown={handleKeyDownFornecedores}
                onBlur={() => { setCurrentPageFornecedores(1); handleSearchFornecedores(); }}
                renderTags={(value, getTagProps) => value.map((opt, i) => (
                  <Chip {...getTagProps({ index: i })} label={opt.nome_completo} />
                ))}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Fornecedores"
                    placeholder="Digite e pressione Enter"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: isLoadingFornecedores && <CircularProgress size={20} />
                    }}
                  />
                )}
              />
            </Grid>

            {/* Produto consolidado */}
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={allProdutos}
                getOptionLabel={opt => opt.nome || ''}
                value={selectedProduct}
                onChange={(_, newVal) => {
                  setSelectedProduct(newVal);
                  setValues(prev => ({
                    ...prev,
                    nome: newVal?.nome || '',
                    produto_id: newVal?.id || '',
                    produto_table: newVal?.type || '',
                  }));
                }}
                inputValue={produtosInputValue}
                onInputChange={(_, v) => { setProdutosInputValue(v); setSearchQueryProdutos(v); }}
                loading={isLoadingProdutos}
                onKeyDown={handleInputKeyDown}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Produto (opcional)"
                    fullWidth
                    helperText="Selecione ou pressione Enter"
                  />
                )}
              />
            </Grid>

            {/* Botão Salvar */}
            <Grid item xs={12}>
              <Box textAlign="end" mt={4}>
                <Button type="submit" variant="contained" size="large">
                  Salvar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
}

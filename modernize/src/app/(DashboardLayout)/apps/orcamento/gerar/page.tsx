'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/utils/useAuth';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import ParentCard from '@/app/components/shared/ParentCard';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { NumericFormat } from 'react-number-format';
import { IconCopy } from '@tabler/icons-react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogProps,
  Box,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  Stack,
  Alert,
  // CircularProgress
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import useDebounce from '@/utils/useDebounce';
import Fuse from 'fuse.js';

interface Cliente {
  number: string;
  contact_name: string;
  channel: string;
  agent_name: string;
}

interface Product {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  prazo: number;
  peso: number;
  comprimento: number;
  largura: number;
  altura: number;
}

const OrcamentoGerarScreen = () => {
  const isLoggedIn = useAuth();
  const [clientId, setClientId] = useState('');
  const [allClients, setAllClients] = useState<Cliente[]>([]);
  const [produtosData, setProdutosData] = useState<Product[]>([]); // Todos os dados da API
  const [openProduct, setOpenProduct] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const debouncedInputValue = useDebounce(inputValue, 300); // Atraso de 300ms para processamento de filtragem
  const [options, setOptions] = useState<Product[]>([]); // Opções filtradas para o autocomplete
  const [filteredOptions, setFilteredOptions] = useState<Product[]>([]); // Declare filteredOptions
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // Armazenando o produto selecionado
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [openBudget, setOpenBudget] = React.useState(false);
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
  const [orçamentoTexto, setOrçamentoTexto] = useState('');
  const [cep, setCEP] = useState('');
  const [cepError, setCepError] = useState(false);
  const [address, setAddress] = useState('');
  const [shippingOption, setShippingOption] = useState('');
  const [precoPac, setPrecoPac] = useState('');
  const [precoSedex, setPrecoSedex] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const descriptionElementRef = React.useRef<HTMLElement>(null);
  const accessToken = localStorage.getItem('accessToken');
  const [fuse, setFuse] = useState<Fuse<Product> | null>(null);

  // console.log('Options in Autocomplete:', options);

  const fuseOptions = {
    keys: ['nome'], // Campo do objeto a ser buscado
    threshold: 0.5, // Permite maior flexibilidade nas correspondências
    distance: 100,
    includeScore: true, // Pontua a relevância, mas não é necessário exibir
    useExtendedSearch: true, // Habilita correspondências mais complexas
    tokenize: true, // Divide o texto em palavras (tokens)
    shouldSort: true, // Ordena os resultados por relevância
    findAllMatches: true, // Encontra todas as correspondências possíveis
    minMatchCharLength: 2, // Tamanho mínimo de caracteres por token para considerar uma correspondência
  };

  //   const fuseOptions = {
  //   keys: ['nome'],
  //   threshold: 0.3,
  //   distance: 100,
  //   minMatchCharLength: 2,
  //   shouldSort: true,
  //   includeScore: true,
  //   useExtendedSearch: true,
  // };

  const fetchProdutos = async (page = 1, perPage = 500) => {
    const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/produto?page=${page}&per_page=${perPage}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setProdutosData(prevProdutos => [...prevProdutos, ...data.data]);

      if (data.current_page < data.last_page) {
        await fetchProdutos(data.current_page + 1, perPage);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
    await delay(7000);
  };

  // Função para filtrar os produtos com base no valor de input
  const filterProducts = (input: string) => {
    if (!input || !fuse) return produtosData;

    // Tokeniza o input do usuário para busca multi-palavra
    const searchQuery = input
      .trim()
      .toLowerCase()
      .split(/\s+/) // Divide em palavras
      .join(' '); // Une como uma string novamente para Fuse.js

    // Realiza a busca fuzzy com Fuse.js
    const results = fuse.search(searchQuery);

    // Retorna os produtos correspondentes
    return results.map((result) => result.item);
  };

  // Função para lidar com a mudança de input
  const handleProductInputChange = useCallback(
    (event: React.SyntheticEvent<Element, Event>, newInputValue: string) => {
      setInputValue(newInputValue);
    },
    []
  );

  const handleProductChange = (event: any, newProductValue: any) => {
    if (typeof newProductValue === 'string') {
      setSelectedProduct(null);
    } else {
      setSelectedProduct(newProductValue);
    }
  }

  const handleOpenProduct = useCallback(() => setOpenProduct(true), []);
  const handleCloseProduct = useCallback(() => setOpenProduct(false), []);

  const handleSubmit = async () => {
    const isValidCEP = await validateCEP(cep);
    if (isValidCEP) {
      gerarOrcamento();
    } else {
      setCepError(true);
      gerarOrcamento();
    }
  };

  const handleCloseBudget = () => {
    setOpenBudget(false);
  };

  const gerarOrcamento = () => {
    let totalOrçamento = 0;
    let produtosTexto = '';
    const larguraMaxima = 40;
    const larguraPrecoTotal = 15;

    productsList.forEach((product) => {
      const produtoTotal = product.preco * product.quantidade;

      // Formatação da linha do produto para garantir alinhamento
      const quantidade = `${product.quantidade} un`.padEnd(larguraMaxima, ' ');
      const nomeProduto = product.nome.padEnd(larguraMaxima, ' ');
      const precoUnitario = `R$${product.preco.toFixed(2)}`.padStart(larguraPrecoTotal, ' ');
      const totalProduto = `R$${produtoTotal.toFixed(2)}`.padStart(larguraPrecoTotal, ' ');

      // Concatena as informações do produto
      produtosTexto += `${quantidade} ${nomeProduto} ${precoUnitario} ${totalProduto}\n`;
      totalOrçamento += produtoTotal;
    });

    // Definindo o frete fixo
    const frete = 38.00;
    totalOrçamento += frete;

    // Montando o texto do orçamento
    const prazoParaConfecao = 10; // prazo fixo para confecção
    const prazoEnvio = 3; // dias úteis para envio via Correios

    const textoOrcamento = `
${produtosTexto.trim()}
Frete:        R$${frete.toFixed(2)} - (Dia da postagem + ${prazoEnvio} dias úteis via Correios Sedex)
  
Total:        R$${totalOrçamento.toFixed(2)}
  
Prazo para confecção é de ${prazoParaConfecao} dias úteis + prazo de envio.
Prazo inicia-se após aprovação da arte e pagamento confirmado.
  
Orçamento válido por 30 dias.
`.trim();

    setOrçamentoTexto(textoOrcamento);
    setOpenBudget(true);
  }

  const validateCEP = async (cep: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (response.ok && data.cep) {
        console.log('cep válido');
        console.log(data);
        setAddress(data.logradouro + " " + data.localidade + " " + data.uf + " " + data.cep);
        return true;
      } else {
        console.log('CEP inválido');
        return false;
      }
    } catch (error) {
      console.error('Error validating CEP:', error);
      return false;
    }
  };

  function adicionarProduto(novoProduto: Product) {
    // Se o produto não tiver nenhuma quantidade, então atribua (ou atualize) quantidade para 1 ao adicioná-lo na lista
    if (isNaN(novoProduto.quantidade) || novoProduto.quantidade === 0) {
      novoProduto.quantidade = 1;
    }
    // Se já está na productsList, não adiciona novamente, soma 1 na sua quantidade.
    const existingProduct = productsList.find((product) => product.id === novoProduto.id);
    if (existingProduct) {
      const updatedProduct = {
        ...existingProduct,
        quantidade: isNaN(existingProduct.quantidade) ? 1 : existingProduct.quantidade + 1,
      };
      const updatedProductsList = productsList.map((product) =>
        product.id === existingProduct.id ? updatedProduct : product
      );
      setProductsList(updatedProductsList);
    } else {
      setProductsList([...productsList, novoProduto]);
    }
  }

  const removerProduto = (productToRemove: Product) => {
    const updatedProductsList = productsList.map((product) => {
      if (product.id === productToRemove.id) {
        if (product.quantidade > 1) {
          // Reduz a quantidade em 1 unidade
          return { ...product, quantidade: product.quantidade - 1 };
        } else {
          // Remove o produto completamente
          return null;
        }
      }
      return product;
    });

    // Remove os elementos null (produtos removidos) do array
    setProductsList(updatedProductsList.filter((product): product is Product => product !== null));
  };

  const atualizarProduto = (updatedProduct: Product) => {
    const updatedProductsList = productsList.map((product) =>
      product.id === updatedProduct.id ? updatedProduct : product
    );
    setProductsList(updatedProductsList);
  };

  const handleCEPBlur = useCallback(() => {
    console.log('CEP: ', cep);
  }, [cep]);

  useEffect(() => {
    if (openBudget) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [openBudget]);

  useEffect(() => {
    if (debouncedInputValue.trim() === '') {
      setOptions([]); // Esvazia as opções se o campo de busca estiver vazio
    } else {
      const filteredOptions = filterProducts(debouncedInputValue); // Busca produtos
      // console.log('Filtered Options:', filteredOptions); // Para debug
      setOptions(filteredOptions.slice(0, 50)); // Atualiza e Mostra no máximo 50 opções
    }
  }, [debouncedInputValue, fuse]);

  useEffect(() => {
    if (produtosData.length) {
      setFuse(new Fuse(produtosData, fuseOptions));
    }
  }, [produtosData]);

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/chat-octa`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();

        if (Array.isArray(data)) {
          setAllClients(data.map((item: Cliente) => ({ number: item.number, contact_name: item.contact_name, channel: item.channel, agent_name: item.agent_name })));
        } else {
          console.error('Dados inválidos recebidos da API:', data);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do chat:', error);
      }
    };

    fetchChatData();
  }, []); // Executa apenas na montagem do componente

  useEffect(() => {
    fetchProdutos();
  }, []);

  useEffect(() => {
    console.log('O valor de productsList mudou para:', productsList);
  }, [productsList]);

  useEffect(() => {
    console.log('CEP não encontrado.', cep);
  }, [cepError]);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    setLoading(false);
  }, [isLoggedIn]);

  // Lógica de filtragem usando Fuse.js
  useEffect(() => {
    const result = fuse?.search(inputValue)?.map(({ item }) => item) || [];
    setFilteredOptions(result); // Atualiza filteredOptions com os resultados da busca
  }, [inputValue, produtosData]); // Refiltra sempre que o input ou os produtos mudam

  // Atualiza as opções a serem exibidas
  useEffect(() => {
    setOptions(filteredOptions); // Atualiza options com filteredOptions
  }, [filteredOptions]);

  // Indicador de carregamento baseado no input e nas opções filtradas
  // const loading = filteredOptions.length === 0 && inputValue.length > 0;


  return (
    <PageContainer title="Orçamento / Gerar" description="Gerar Orçamento da Arte Arena">
      <Breadcrumb title="Orçamento / Gerar" subtitle="Gerencie os Orçamentos da Arte Arena / Adicionar" />
      <ParentCard title="Gerar Novo Orçamento" >
        <div>
          <CustomFormLabel
            sx={{
              mt: 0,
            }}
            htmlFor="titulo"
          >
            Cliente
          </CustomFormLabel>

          <Autocomplete
            disablePortal
            id="cliente"
            options={allClients}
            getOptionLabel={(option) => `${option.number} :: ${option.contact_name} :: (${option.channel} ${option.agent_name ? ` - ${option.agent_name}` : ''})`}
            fullWidth
            onChange={(event, value) => setClientId(value ? value.number : '')}
            renderInput={(params) => (
              <CustomTextField {...params} placeholder="Selecione um cliente" aria-label="Selecione um cliente" />
            )}
          />

          <div style={{ marginTop: '20px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <div style={{ flex: 1 }}>
                <Box sx={{ width: '100%' }}>
                  <Autocomplete
                    freeSolo
                    fullWidth
                    id="produto-autocomplete"
                    open={openProduct}
                    onOpen={handleOpenProduct}
                    onClose={handleCloseProduct}
                    value={selectedProduct} // Produto selecionado
                    inputValue={inputValue}
                    loading={filteredOptions.length === 0 && inputValue.length > 0}
                    filterOptions={(x) => x}
                    onInputChange={handleProductInputChange} // Chama a função de filtragem sem debounce
                    options={options} // Opções filtradas de produtos
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.nome)} // Garante compatibilidade com freeSolo
                    noOptionsText="Nenhum produto encontrado"
                    loadingText="Carregando produtos..."
                    onChange={handleProductChange} // Atualiza o produto selecionado
                    renderInput={(params) => (
                      <CustomTextField
                        {...params}
                        label="Buscar Produto"
                        variant="outlined"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loading ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                    renderOption={(props, option) => {
                      // Generate a unique key for each option, even if it's a freeSolo entry
                      const key = typeof option === 'string' ? option : option.id; // Replace 'id' with the actual unique identifier

                      return (
                        <li {...props} key={key}>
                          {option?.nome || ''}
                        </li>
                      );
                    }}
                  />
                </Box>
              </div>

              <div style={{ marginLeft: '20px' }}>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    if (selectedProduct) {
                      adicionarProduto(selectedProduct);
                    } else {
                      alert('Por favor, selecione um produto');
                    }
                  }}
                >
                  Adicionar
                </Button>
              </div>
            </div>

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Produto</TableCell>
                    <TableCell align="right">Preço</TableCell>
                    <TableCell align="right">Quantidade</TableCell>
                    <TableCell align="right">Prazo</TableCell>
                    <TableCell align="right">Peso</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productsList.map((product: Product, index) => (
                    <TableRow key={index}>

                      <TableCell>{product.nome}</TableCell>

                      <TableCell align="right">
                        <NumericFormat
                          value={product.preco}
                          customInput={CustomTextField}
                          thousandSeparator="."
                          decimalSeparator=","
                          prefix="R$ "
                          allowNegative={false}
                          fixedDecimalScale={true}
                          decimalScale={2}
                          onValueChange={(values) => {
                            const updatedProduct = { ...product, preco: values.floatValue || 0 };
                            atualizarProduto(updatedProduct);
                          }}
                          variant="outlined"
                          size="small"
                          sx={{ width: '150px' }}
                        />
                      </TableCell>

                      <TableCell align="right">
                        <CustomTextField
                          value={product.quantidade}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const newProductValue = Math.max(0, +event.target.value);
                            const updatedProduct = { ...product, quantidade: newProductValue };
                            atualizarProduto(updatedProduct);
                          }}
                          type="number"
                          variant="outlined"
                          size="small"
                          sx={{ width: '90px' }}
                        />
                      </TableCell>

                      <TableCell align="right">
                        <CustomTextField
                          value={product.prazo}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const newProductValue = Math.max(0, +event.target.value);
                            const updatedProduct = { ...product, prazo: newProductValue };
                            atualizarProduto(updatedProduct);
                          }}
                          type="number"
                          variant="outlined"
                          size="small"
                          sx={{ width: '80px' }}
                        />
                      </TableCell>

                      <TableCell align="right">
                        <CustomTextField
                          value={product.peso}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const newProductValue = Math.max(0, +event.target.value);
                            const updatedProduct = { ...product, peso: newProductValue };
                            atualizarProduto(updatedProduct);
                          }}
                          type="number"
                          variant="outlined"
                          size="small"
                          sx={{ width: '100px' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => removerProduto(product)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'left', mt: 2 }}>
              <CustomTextField
                label="CEP do cliente"
                value={cep}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCEP(event.target.value)}
                onBlur={handleCEPBlur}
                variant="outlined"
                size="small"
                sx={{ width: '200px' }}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'left', mt: 2 }}>
              <CustomTextField
                label="Endereço do Cliente"
                value={address}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAddress(event.target.value)}
                variant="outlined"
                size="small"
                fullWidth
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'left', mt: 2, flexDirection: 'row' }}>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={shippingOption}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => setShippingOption(event.target.value)}
                  row
                >
                  <FormControlLabel value={"Retirada - R$ 0,00"} control={<Radio />} label="Retirada" />
                  <FormControlLabel value={"PAC - R$ " + precoPac} control={<Radio />} label="PAC" />
                  <FormControlLabel value={"SEDEX R$ " + precoSedex} control={<Radio />} label="SEDEX" />
                </RadioGroup>
              </FormControl>
            </Box>

            <div style={{ marginTop: '20px' }}>
              <Button
                color="primary"
                variant="contained"
                onClick={handleSubmit}
              >
                Visualizar Orçamento
              </Button>

              <IconButton>
                <IconCopy />
                <Typography variant="body2">Copiar Orçamento</Typography>
              </IconButton>
            </div>
          </div>

          <Dialog
            open={openBudget}
            onClose={handleCloseBudget}
            scroll={scroll}
            maxWidth="lg"
            fullWidth
          >
            <DialogTitle id="scroll-dialog-title">Orçamento Arte Arena</DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
              <DialogContentText
                ref={descriptionElementRef}
                tabIndex={-1}
              >
                <pre>{orçamentoTexto}</pre>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleCloseBudget} color="primary">
                Fechar
              </Button>
            </DialogActions>
          </Dialog>

        </div>
      </ParentCard>
    </PageContainer >
  );
};

export default OrcamentoGerarScreen;

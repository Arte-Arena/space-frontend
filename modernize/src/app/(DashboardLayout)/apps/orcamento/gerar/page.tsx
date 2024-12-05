'use client'
import React, { useState, useEffect } from 'react';
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
  CircularProgress
} from '@mui/material';

import { debounce } from 'lodash'; // Importando a função debounce do lodash

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
  peso: number;
  comprimento: number;
  largura: number;
  altura: number;
  prazo: number;
}

const OrcamentoGerarScreen = () => {

  // Definindo o tipo Produto
  interface Produto {
    id: string;
    nome: string;
    tipoVariacao: string;
    cor?: string; // Cor opcional
    tamanho?: string; // Tamanho opcional
  }
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  // const [produtosData, setProdutosData] = useState<Produto[]>([]); // Todos os dados da API
  const [options, setOptions] = useState<Produto[]>([]); // Opções filtradas para o autocomplete
  const produtosData: Produto[] = [
    { id: "708195908", nome: "Camiseta Silhueta Cristo Redentor", tipoVariacao: "P" },
    { id: "708195933", nome: "Camiseta Silhueta Cristo Redentor - G - Branca", tipoVariacao: "V", cor: "Branca", tamanho: "G" },
    { id: "708195921", nome: "Camiseta Silhueta Cristo Redentor - G - Preto", tipoVariacao: "V", cor: "Preto", tamanho: "G" },
    { id: "708197364", nome: "Camiseta São Paulo - Capital - P - Branca", tipoVariacao: "V", cor: "Branca", tamanho: "P" },
    { id: "708197352", nome: "Camiseta São Paulo - Capital - P - Preto", tipoVariacao: "V", cor: "Preto", tamanho: "P" }
  ];
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null); // Armazenando o produto selecionado










  // Função para filtrar os produtos com base no valor de input
  const filterProducts = (input: string) => {
    const searchWords = input.trim().toLowerCase().split(/\s+/); // Dividir o input em palavras
    if (!input) return produtosData; // Se o campo de busca estiver vazio, retorna todos os produtos

    // Filtra os produtos onde todas as palavras de pesquisa aparecem no nome
    const filteredOptions = produtosData.filter((produto) => {
      return searchWords.every((word) => produto.nome.toLowerCase().includes(word));
    });

    return filteredOptions;
  };

  // Função para lidar com a mudança de input
  const handleInputChange = (event: React.SyntheticEvent<Element, Event>, newInputValue: string) => {
    setInputValue(newInputValue); // Atualiza o valor do input

    // Filtra os produtos com base no input
    const filteredOptions = filterProducts(newInputValue);
    setOptions(filteredOptions); // Atualiza as opções filtradas
  };









  const isLoggedIn = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [clientId, setClientId] = useState('');
  const [allClients, setAllClients] = useState<Cliente[]>([]);
  const [allProducts, setAllProducts] = useState([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  // const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openOrcamento, setOpenOrcamento] = React.useState(false);
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
  const [orçamentoTexto, setOrçamentoTexto] = useState('');
  const [cep, setCEP] = useState('');
  const [cepError, setCepError] = useState(false);
  const [address, setAddress] = useState('');
  const [shippingOption, setShippingOption] = useState('');
  const [precoPac, setPrecoPac] = useState('');
  const [precoSedex, setPrecoSedex] = useState('');
  const [openAlert, setOpenAlert] = useState(false);


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

    const textoOrcamento =
      `
${produtosTexto.trim()}
Frete:        R$${frete.toFixed(2)} - (Dia da postagem + ${prazoEnvio} dias úteis via Correios Sedex)
  
Total:        R$${totalOrçamento.toFixed(2)}
  
Prazo para confecção é de ${prazoParaConfecao} dias úteis + prazo de envio.
Prazo inicia-se após aprovação da arte e pagamento confirmado.
  
Orçamento válido por 30 dias.
`.trim();

    setOrçamentoTexto(textoOrcamento);
    setOpenOrcamento(true);
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

  const handleSubmit = async () => {
    const isValidCEP = await validateCEP(cep);
    if (isValidCEP) {
      gerarOrcamento();
    } else {
      setCepError(true);
      gerarOrcamento();
    }
  };

  const handleClose = () => {
    setOpenOrcamento(false);
  };

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (openOrcamento) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [openOrcamento]);

  function adicionarItem(novoItem: Product) {
    setProductsList([...productsList, novoItem]);
  }

  const removerItem = (productToRemove: Product) => {
    const updatedProductsList = productsList.filter(
      (product) => product.id !== productToRemove.id
    );
    setProductsList(updatedProductsList);
  };

  const atualizarProduto = (updatedProduct: Product) => {
    const updatedProductsList = productsList.map((product) =>
      product.id === updatedProduct.id ? updatedProduct : product
    );
    setProductsList(updatedProductsList);
  };

  // function handleCEPBlur() {
  // }


  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API}/api/get-all-produtos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log('Carregando dados de produtos...');
        setAllProducts(prevState =>
          prevState.concat(
            data.map((item: Product) => ({
              id: item.id,
              nome: item.nome,
              preco: item.preco ?? 0,
              quantidade: 0, // Set default quantity to 0
              peso: item.peso ?? 0,  // Default peso to 0 if missing
              prazo: item.prazo ?? 0,  // Default prazo to 0 if missing
              comprimento: item.comprimento ?? 0,
              largura: item.largura ?? 0,
              altura: item.altura ?? 0,
            }))
          )
        );
        console.log('Carregando produtos...', allProducts);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

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
    console.log('O valor de products mudou para:', productsList);
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

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

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
                    id="produto-autocomplete"
                    sx={{ width: 400 }}
                    open={open}
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    value={selectedProduct} // Produto selecionado
                    onChange={(event, newValue) => setSelectedProduct(newValue)} // Atualiza o produto selecionado
                    inputValue={inputValue}
                    onInputChange={handleInputChange} // Chama a função de filtragem sem debounce
                    options={options} // Opções filtradas de produtos
                    getOptionLabel={(option) => option.nome} // Como exibir o nome das opções
                    loading={loading} // Indicador de carregamento
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
                    renderOption={(props, option) => (
                      <li {...props}> {/* Passando a key diretamente */}
                        {option.nome}
                        {option.tipoVariacao === 'V' && (
                          <span style={{ marginLeft: '8px', color: 'gray' }}>
                            {option.cor} - {option.tamanho}
                          </span>
                        )}
                      </li>
                    )}
                  />
                </Box>









                {/* <Autocomplete
                  id="product-select"
                  options={allProducts}
                  getOptionLabel={(option: Product) => option.nome}
                  onChange={(event, value) => {
                    if (value) {
                      const produtoComValoresPadrao: Product = {
                        ...value,
                        peso: value?.peso || 0, // Garante um valor padrão se 'peso' não existir
                        prazo: value?.prazo || 0 // Garante um valor padrão se 'prazo' não existir
                      };
                      setSelectedProduct(produtoComValoresPadrao);
                    }
                  }}
                  renderInput={(params) => (
                    <CustomTextField
                      {...params}
                      placeholder="Selecione um produto"
                      aria-label="Selecione um produto"
                    />
                  )}
                /> */}
              </div>
              <div style={{ marginLeft: '20px' }}>
                <Button
                  color="primary"
                  variant="contained"
                // onClick={() => {
                //   if (selectedProduct) {
                //     adicionarItem(selectedProduct);
                //   } else {
                //     alert('Por favor, selecione um produto');
                //   }
                // }}
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
                            const newValue = Math.max(0, +event.target.value);
                            const updatedProduct = { ...product, quantidade: newValue };
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
                            const newValue = Math.max(0, +event.target.value);
                            const updatedProduct = { ...product, prazo: newValue };
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
                            const newValue = Math.max(0, +event.target.value);
                            const updatedProduct = { ...product, peso: newValue };
                            atualizarProduto(updatedProduct);
                          }}
                          type="number"
                          variant="outlined"
                          size="small"
                          sx={{ width: '100px' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => removerItem(product)}>
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
                // onBlur={handleCEPBlur}
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
            open={openOrcamento}
            onClose={handleClose}
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
              <Button autoFocus onClick={handleClose} color="primary">
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

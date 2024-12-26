'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/utils/useAuth';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import ParentCard from '@/app/components/shared/ParentCard';
import Autocomplete from '@mui/material/Autocomplete';
import { useQuery } from '@tanstack/react-query';
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
import { IconCopy, IconPlus, IconMinus, IconDeviceFloppy } from '@tabler/icons-react';
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
  Typography,
  Checkbox
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import getBrazilTime from '@/utils/brazilTime';

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

interface FreteData {
  name: string;
  price: string;
  delivery_time: number;
}

const OrcamentoGerarScreen = () => {
  const isLoggedIn = useAuth();
  const [openAnticipation, setOpenAnticipation] = useState(false);
  const [isAnticipation, setIsAnticipation] = useState(false);
  const [dataDesejadaEntrega, setDataDesejadaEntrega] = useState<Date | null>(null);
  const [clientId, setClientId] = useState('');
  const [allClients, setAllClients] = useState<Cliente[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // Armazenando o produto selecionado
  const [openBudget, setOpenBudget] = React.useState(false);
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
  const [orçamentoTexto, setOrçamentoTexto] = useState('');
  const [cep, setCEP] = useState('');
  const [cepError, setCepError] = useState(false);
  const [address, setAddress] = useState('');
  const [precoPac, setPrecoPac] = useState<string | null>(null);
  const [prazoPac, setPrazoPac] = useState<number | null>(null);
  const [precoSedex, setPrecoSedex] = useState<string | null>(null);
  const [prazoSedex, setPrazoSedex] = useState<number | null>(null);
  const [precoSedex10, setPrecoSedex10] = useState<string | null>(null);
  const [prazoSedex10, setPrazoSedex10] = useState<number | null>(null);
  const [precoSedex12, setPrecoSedex12] = useState<string | null>(null);
  const [prazoSedex12, setPrazoSedex12] = useState<number | null>(null);
  const [precoMiniEnvios, setPrecoMiniEnvios] = useState<string | null>(null);
  const [prazoMiniEnvios, setPrazoMiniEnvios] = useState<number | null>(null);
  const [shippingOption, setShippingOption] = useState('');
  const [previsaoEntrega, setPrevisaoEntrega] = useState<Date | null>(null);
  const descriptionElementRef = React.useRef<HTMLElement>(null);


  const accessToken = localStorage.getItem('accessToken');

  const { isFetching: isFetchingClients, error: errorClients, data: dataClients } = useQuery({
    queryKey: ['clientData'],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API}/api/chat-octa`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((res) => res.json()),
  });

  useEffect(() => {
    if (dataClients) {
      console.log('dataClients:', dataClients);
      if (Array.isArray(dataClients)) {
        setAllClients(dataClients.map((item: Cliente) => ({ number: item.number, contact_name: item.contact_name, channel: item.channel, agent_name: item.agent_name })));
      } else {
        console.error('Dados inválidos recebidos da API:', dataClients);
      }
    } else {
      console.warn('Os dados de clientes não foram encontrados.');
    }
  }, [dataClients]);

  useEffect(() => {
    if (allClients) {
      console.log('allClients:', allClients);
    }
  }, [allClients]);

  useEffect(() => {
    if (clientId) {
      console.log('clientId:', clientId);
    }
  }, [clientId]);

  useEffect(() => {
    if (allClients) {
      console.log('allClients:', allClients);
    }
  }, [allClients]);

  const { isFetching: isFetchingProducts, error: errorProducts, data: dataProducts } = useQuery({
    queryKey: ['productData'],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API}/api/produto-personalizad`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((res) => res.json()),
  });

  useEffect(() => {
    if (dataProducts) {
      console.log('productData:', dataProducts);
      if (Array.isArray(dataProducts)) {
        const transformedProducts = dataProducts.map((item: Product) => ({
          id: item.id,
          nome: item.nome,
          preco: item.preco,
          prazo: (item as any).dias_preparacao,
          peso: (item as any).peso_liquido,
          largura: (item as any).largururaEmbalagem,
          altura: (item as any).alturaEmbalagem,
          comprimento: (item as any).comprimentoEmbalagem,
          quantidade: 1
        }));
        setAllProducts(transformedProducts);
      } else {
        console.error('Dados inválidos recebidos da API:', dataProducts);
      }
    } else {
      console.warn('Os dados de produtos não foram encontrados.');
    }
  }, [dataProducts]);

  useEffect(() => {
    if (allProducts) {
      console.log('allProducts:', allProducts);
    }
  }, [allProducts]);

  const productNames = allProducts.map((product) => product.nome);

  useEffect(() => {
    if (selectedProduct) {
      adicionarProduto(selectedProduct);
      console.log('selectedProduct:', selectedProduct);
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (productsList) {
      console.log('productsList:', productsList);
    }
  }, [productsList]);

  function adicionarProduto(novoProduto: Product) {
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
      setProductsList([
        ...productsList,
        {
          ...novoProduto,
          quantidade: 1,
          preco: Number(novoProduto.preco),
          prazo: novoProduto.prazo ? novoProduto.prazo : 0,
        },
      ]);
    }
  }

  const removerProdutoUnidade = (productToRemove: Product) => {
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

  const removerProduto = (productToRemove: Product) => {
    const updatedProductsList = productsList.filter((product) => product.id !== productToRemove.id);
    setProductsList(updatedProductsList);
  };

  const atualizarProduto = (updatedProduct: Product) => {
    const updatedProductsList = productsList.map((product) =>
      product.id === updatedProduct.id ? updatedProduct : product
    );
    setProductsList(updatedProductsList);
  };

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

  const getFrete = async (cepTo: string) => {
    try {
      const body = {
        cepTo,
        largura: productsList.reduce((max, product) => Math.max(max, product.largura), 0),
        altura: productsList.reduce((max, product) => Math.max(max, product.altura), 0),
        comprimento: productsList.reduce((max, product) => Math.max(max, product.comprimento), 0),
        peso: productsList.reduce((total, product) => total + product.peso * product.quantidade, 0),
        valor: productsList.reduce((total, product) => total + product.preco * product.quantidade, 0),
        qtd: productsList.length
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/frete-melhorenvio`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch frete');
      }

      const data: FreteData[] = await response.json(); // Type the data

      const fretesByName: { [key: string]: FreteData } = {};

      data.forEach(frete => {
        fretesByName[frete.name.toLowerCase().replace(/\s/g, '')] = frete; // Use lowercase and remove spaces for consistent keys
      });

      console.log('Fretes by name:', fretesByName);

      // Example usage with state updates:
      if (fretesByName.pac) {
        setPrecoPac(fretesByName.pac.price);
        setPrazoPac(fretesByName.pac.delivery_time);
      }

      if (fretesByName.sedex) {
        setPrecoSedex(fretesByName.sedex.price);
        setPrazoSedex(fretesByName.sedex.delivery_time);
      }

      if (fretesByName.sedex10) {
        setPrecoSedex10(fretesByName.sedex10.price);
        setPrazoSedex10(fretesByName.sedex10.delivery_time);
      }

      if (fretesByName.sedex12) {
        setPrecoSedex12(fretesByName.sedex12.price);
        setPrazoSedex12(fretesByName.sedex12.delivery_time);
      }

      if (fretesByName.minienvios) {
        setPrecoMiniEnvios(fretesByName.minienvios.price);
        setPrazoMiniEnvios(fretesByName.minienvios.delivery_time);
      }

      return fretesByName; // Return the object for other uses if needed
    } catch (error) {
      console.error('Error fetching frete:', error);
    }
  };


  const calcPrevisao = () => {
    const today = getBrazilTime();
    console.log('today:', today);
    return today;
  };

  const handleCEPBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    const cep = event.target.value;
    const isValidCEP = await validateCEP(cep);
    if (!isValidCEP) {
      setCepError(true);
    } else {
      setCepError(false);
      getFrete(cep);
      calcPrevisao();
    }
  };

  useEffect(() => {
    if (cepError) {
      console.log('cepError:', cepError);
    }
  }, [cepError]);

  const handleSubmit = async () => {
    const isValidCEP = await validateCEP(cep);
    if (isValidCEP) {
      gerarOrcamento();
    } else {
      setCepError(true);
      gerarOrcamento();
    }
  };

  // const calcPrevisaoEntrega = (shippingOption: string) => {
  //   const today = getBrazilTime();
  //   let days = 0;
  //   switch (shippingOption) {
  //     case 'pac':
  //       days = prazoPac;
  //       break;
  //     case 'sedex':
  //       days = prazoSedex;
  //       break;
  //     case 'sedex10':
  //       days = prazoSedex10;
  //       break;
  //     case 'sedex12':
  //       days = prazoSedex12;
  //       break;
  //     case 'minienvios':
  //       days = prazoMiniEnvios;
  //       break;
  //   }
  //   const previsaoEntrega = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
  //   return previsaoEntrega;
  // };

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
      const precoUnitario = `R$ ${product.preco.toFixed(2)}`.padStart(larguraPrecoTotal, ' ');
      const totalProduto = `R$ ${produtoTotal.toFixed(2)}`.padStart(larguraPrecoTotal, ' ');

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
    const previsaoEntrega = (() => {
      const maxPrazo = Math.max(...productsList.map(product => product.prazo ?? 0));
      return prazoMiniEnvios !== null
        ? (maxPrazo + prazoMiniEnvios) + " dias."
        : "não disponível";
    })();

    const textoOrcamento = `
Lista de Produtos:

${produtosTexto.trim()}

Frete:        R$ ${frete.toFixed(2)} - (Dia da postagem + ${prazoEnvio} dias úteis via ${shippingOption})

Total:        R$ ${totalOrçamento.toFixed(2)}

Previsão de Entrega: 

Prazo para confecção é de ${prazoParaConfecao} dias úteis + prazo de envio.
Prazo inicia-se após aprovação da arte e pagamento confirmado.

Considerando confirmação agora, a previsão de envio é de x dias (data da previsao)

Orçamento válido por 30 dias.
`.trim();

    setOrçamentoTexto(textoOrcamento);
    setOpenBudget(true);
    salvarOrcamento();
  }

  const salvarOrcamento = async () => {
    const dataBody = {
      cliente_octa_number: clientId,
      nome_cliente: clientId,
      lista_produtos: JSON.stringify(productsList),
      texto_orcamento: orçamentoTexto,
      endereco_cep: cep,
      endereco: address,
      opcao_entrega: shippingOption,
      prazo_opcao_entrega: 1,
      preco_opcao_entrega: 50.66,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/orcamento/create-orcamento`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(dataBody),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar orçamento');
      }

      console.log('Orçamento salvo com sucesso');
    } catch (error) {
      console.error('Erro:', error);
    }
  };


  return (
    <PageContainer title="Orçamento / Gerar" description="Gerar Orçamento da Arte Arena">
      <Breadcrumb title="Orçamento / Gerar" subtitle="Gerencie os Orçamentos da Arte Arena / Adicionar" />
      <ParentCard title="Gerar Novo Orçamento" >
        <>
        <CustomFormLabel
            sx={{
              mt: 0,
            }}
            htmlFor="cliente"
          >
            Urgência de Entrega
          </CustomFormLabel>

          <FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isAnticipation}
                  onChange={(event) => {
                    setIsAnticipation(event.target.checked);
                    setOpenAnticipation(event.target.checked);
                  }}
                />
              }
              label="Antecipação"
            />
          </FormControl>

          <Dialog
            open={openAnticipation}
            onClose={() => setIsAnticipation(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Defina a data de entrega desejada"}
            </DialogTitle>
            <DialogContent>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Data de entrega"
                  value={dataDesejadaEntrega}
                  onChange={(newValue) => setDataDesejadaEntrega(newValue)}
                  renderInput={(params) => <CustomTextField {...params} />}
                />
              </LocalizationProvider>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => {
                setOpenAnticipation(false);
                setIsAnticipation(false);
              }}>
                Cancelar
              </Button>
              <Button onClick={() => setOpenAnticipation(false)} autoFocus>
                Salvar
              </Button>
            </DialogActions>
          </Dialog>

          {isAnticipation && (
            <Typography variant="body2" color="text Secondary" sx={{ mt: 2 }}>
              Data de entrega desejada: {dataDesejadaEntrega ? dataDesejadaEntrega.toLocaleDateString('pt-BR') : 'Nenhuma data selecionada'}
            </Typography>
          )}
          

          <CustomFormLabel
            sx={{
              mt: 5,
            }}
            htmlFor="cliente"
          >
            Cliente
          </CustomFormLabel>

          <Autocomplete
            fullWidth
            disablePortal
            id="cliente"
            options={allClients}
            getOptionLabel={(option) => `${option.number} :: ${option.contact_name} :: (${option.channel} ${option.agent_name ? ` - ${option.agent_name}` : ''})`}
            onChange={(event, value) => setClientId(value ? value.number : '')}
            renderInput={(params) => (
              <CustomTextField {...params} placeholder="Selecione um cliente" aria-label="Selecione um cliente" />
            )}
          />

          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>

                <CustomFormLabel
                  sx={{
                    mt: 0,
                  }}
                  htmlFor="produto"
                >
                  Produto
                </CustomFormLabel>

                {/* Campo de busca com botão */}
                <Stack spacing={2} direction="row" alignItems="center" mb={2}>
                  <Autocomplete
                    fullWidth
                    id="produto"
                    options={productNames}
                    getOptionLabel={(option) => option}

                    // value={inputValue}
                    onChange={(event, selectedValue) => {
                      if (selectedValue) {
                        const selectedProduct = dataProducts.find((product: Product) => product.nome === selectedValue) as Product | undefined;
                        setSelectedProduct(selectedProduct ? selectedProduct : null); // Set selected product for adding
                      } else {
                        setSelectedProduct(null); // Reset selected product
                      }
                    }}
                    renderInput={(params) => (
                      <CustomTextField {...params} placeholder="Buscar produto..." aria-label="Buscar produto" />
                    )}
                  />

                </Stack>
              </div>
            </div>

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Produto</TableCell>
                    <TableCell align="right">Preço</TableCell>
                    <TableCell align="right">Quantidade</TableCell>
                    <TableCell align="right">Prazo de Produção</TableCell>
                    <TableCell align="right">Peso</TableCell>
                    <TableCell align="right">Largura</TableCell>
                    <TableCell align="right">Altura</TableCell>
                    <TableCell align="right">Comprimento</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productsList.map((product: Product, index) => (
                    <TableRow key={index}>

                      <TableCell>
                        <CustomTextField
                          value={product.nome}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const updatedProduct = { ...product, nome: event.target.value };
                            atualizarProduto(updatedProduct);
                          }}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>

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
                          sx={{ width: '110px' }}
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
                          sx={{
                            width: '50px',
                            '& input[type=number]::-webkit-inner-spin-button': {
                              display: 'none',
                            },
                            '& input[type=number]::-webkit-outer-spin-button': {
                              display: 'none',
                            },
                            '& input[type=number]': {
                              MozAppearance: 'textfield', // Para Firefox
                            },
                          }}
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
                          sx={{
                            width: '50px',
                            '& input[type=number]::-webkit-inner-spin-button': {
                              display: 'none',
                            },
                            '& input[type=number]::-webkit-outer-spin-button': {
                              display: 'none',
                            },
                            '& input[type=number]': {
                              MozAppearance: 'textfield', // Para Firefox
                            },
                          }}
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
                          sx={{
                            width: '70px',
                            '& input[type=number]::-webkit-inner-spin-button': {
                              display: 'none',
                            },
                            '& input[type=number]::-webkit-outer-spin-button': {
                              display: 'none',
                            },
                            '& input[type=number]': {
                              MozAppearance: 'textfield', // Para Firefox
                            },
                          }}
                        />
                      </TableCell>

                      <TableCell align="right">
                        <CustomTextField
                          value={product.largura}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const newProductValue = Math.max(0, +event.target.value);
                            const updatedProduct = { ...product, largura: newProductValue };
                            atualizarProduto(updatedProduct);
                          }}
                          type="number"
                          variant="outlined"
                          size="small"
                          sx={{
                            width: '70px',
                            '& input[type=number]::-webkit-inner-spin-button': {
                              display: 'none',
                            },
                            '& input[type=number]::-webkit-outer-spin-button': {
                              display: 'none',
                            },
                            '& input[type=number]': {
                              MozAppearance: 'textfield', // Para Firefox
                            },
                          }}
                        />
                      </TableCell>

                      <TableCell align="right">
                        <CustomTextField
                          value={product.altura}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const newProductValue = Math.max(0, +event.target.value);
                            const updatedProduct = { ...product, altura: newProductValue };
                            atualizarProduto(updatedProduct);
                          }}
                          type="number"
                          variant="outlined"
                          size="small"
                          sx={{
                            width: '70px',
                            '& input[type=number]::-webkit-inner-spin-button': {
                              display: 'none',
                            },
                            '& input[type=number]::-webkit-outer-spin-button': {
                              display: 'none',
                            },
                            '& input[type=number]': {
                              MozAppearance: 'textfield', // Para Firefox
                            },
                          }}
                        />
                      </TableCell>

                      <TableCell align="right">
                        <CustomTextField
                          value={product.comprimento}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const newProductValue = Math.max(0, +event.target.value);
                            const updatedProduct = { ...product, peso: newProductValue };
                            atualizarProduto(updatedProduct);
                          }}
                          type="number"
                          variant="outlined"
                          size="small"
                          sx={{
                            width: '70px',
                            '& input[type=number]::-webkit-inner-spin-button': {
                              display: 'none',
                            },
                            '& input[type=number]::-webkit-outer-spin-button': {
                              display: 'none',
                            },
                            '& input[type=number]': {
                              MozAppearance: 'textfield', // Para Firefox
                            },
                          }}
                        />
                      </TableCell>

                      <TableCell align="right" sx={{ display: 'flex', gap: 1 }}>
                        <IconButton onClick={() => removerProduto(product)}>
                          <DeleteIcon />
                        </IconButton>
                        <IconButton onClick={() => removerProdutoUnidade(product)}>
                          <IconMinus />
                        </IconButton>
                        <IconButton onClick={() => adicionarProduto(product)}>
                          <IconPlus />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <CustomFormLabel
              sx={{
                mt: 5,
              }}
              htmlFor="transportadora"
            >
              Transportadora
            </CustomFormLabel>

            <Box sx={{ display: 'flex', justifyContent: 'left', mt: 2 }}>
              <CustomTextField
                id="transportadora"
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
                >
                  <Stack direction="column" spacing={1}> {/* Use o Stack para espaçamento */}
                    <FormControlLabel value={"retirada"} control={<Radio />} label="Retirada - R$ 0,00" />
                    <FormControlLabel
                      value={"PAC"}
                      control={<Radio disabled={!precoPac} />}
                      label={precoPac ? (
                        "PAC - R$ " + precoPac +
                        " - Tempo de transporte: " +
                        (prazoPac !== null ? prazoPac : "não disponível") +
                        " dias. Previsão: " +
                        (() => {
                          const maxPrazo = Math.max(...productsList.map(product => product.prazo ?? 0));
                          return prazoPac !== null
                            ? (maxPrazo + prazoPac) + " dias."
                            : "não disponível";
                        })()
                      ) : "PAC"} />

                    <FormControlLabel
                      value={"SEDEX"}
                      control={<Radio disabled={!precoSedex} />}
                      label={precoSedex ? (
                        "SEDEX - R$ " + precoSedex +
                        " - Tempo de transporte: " +
                        (prazoSedex !== null ? prazoSedex : "não disponível") +
                        " dias. Previsão: " +
                        (() => {
                          const maxPrazo = Math.max(...productsList.map(product => product.prazo ?? 0));
                          return prazoSedex !== null
                            ? (maxPrazo + prazoSedex) + " dias."
                            : "não disponível";
                        })()
                      ) : "SEDEX"} />

                    <FormControlLabel
                      value={"SEDEX 10"}
                      control={<Radio disabled={!precoSedex10} />}
                      label={precoSedex10 ? (
                        "SEDEX 10 - R$ " + precoSedex10 +
                        " - Tempo de transporte: " +
                        (prazoSedex10 !== null ? prazoSedex10 : "não disponível") +
                        " dias. Previsão: " +
                        (() => {
                          const maxPrazo = Math.max(...productsList.map(product => product.prazo ?? 0));
                          return prazoSedex10 !== null
                            ? (maxPrazo + prazoSedex10) + " dias."
                            : "não disponível";
                        })()
                      ) : "SEDEX 10"} />

                    <FormControlLabel
                      value={"SEDEX 12"}
                      control={<Radio disabled={!precoSedex12} />}
                      label={precoSedex12 ? (
                        "SEDEX 12 - R$ " + precoSedex12 +
                        " - Tempo de transporte: " +
                        (prazoSedex12 !== null ? prazoSedex12 : "não disponível") +
                        " dias. Previsão: " +
                        (() => {
                          const maxPrazo = Math.max(...productsList.map(product => product.prazo ?? 0));
                          return prazoSedex12 !== null
                            ? (maxPrazo + prazoSedex12) + " dias."
                            : "não disponível";
                        })()
                      ) : "SEDEX 12"} />

                    <FormControlLabel
                      value={"MINI ENVIOS"}
                      control={<Radio disabled={!precoMiniEnvios} />}
                      label={precoMiniEnvios ? (
                        "Mini Envios - R$ " + precoMiniEnvios +
                        " - Tempo de transporte: " +
                        (prazoMiniEnvios !== null ? prazoMiniEnvios : "não disponível") +
                        " dias. Previsão: " +
                        (() => {
                          const maxPrazo = Math.max(...productsList.map(product => product.prazo ?? 0));
                          return prazoMiniEnvios !== null
                            ? (maxPrazo + prazoMiniEnvios) + " dias."
                            : "não disponível";
                        })()
                      ) : "Mini Envios"}
                    />
                  </Stack>
                </RadioGroup>
              </FormControl>
            </Box>

            <div style={{ marginTop: '20px' }}>
              <Button
                color="primary"
                variant="contained"
                onClick={handleSubmit}
                disabled={!shippingOption || !clientId || productsList.length === 0}
              >
                <IconDeviceFloppy style={{ marginRight: '8px' }} />
                Gerar Orçamento
              </Button>
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
              <IconButton>
                <IconCopy />
                <Typography variant="body2">Copiar Orçamento</Typography>
              </IconButton>
              <Button autoFocus onClick={handleCloseBudget} color="primary">
                Fechar
              </Button>
            </DialogActions>
          </Dialog>

        </>
      </ParentCard>
    </PageContainer >
  );
};

export default OrcamentoGerarScreen;

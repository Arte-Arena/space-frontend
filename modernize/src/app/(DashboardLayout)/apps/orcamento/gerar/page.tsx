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
import { IconCopy } from '@tabler/icons-react';
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
  Stack
} from '@mui/material';

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
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // Armazenando o produto selecionado
  const [openBudget, setOpenBudget] = React.useState(false);
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
  const [orçamentoTexto, setOrçamentoTexto] = useState('');
  const [cep, setCEP] = useState('');
  const [cepError, setCepError] = useState(false);
  const [address, setAddress] = useState('');
  const [shippingOption, setShippingOption] = useState('');
  const [precoPac, setPrecoPac] = useState('');
  const [precoSedex, setPrecoSedex] = useState('');
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
      if (dataClients) {
        console.log('Dados de Clientes:', dataClients);

        if (Array.isArray(dataClients)) {
          setAllClients(dataClients.map((item: Cliente) => ({ number: item.number, contact_name: item.contact_name, channel: item.channel, agent_name: item.agent_name })));
        } else {
          console.error('Dados inválidos recebidos da API:', dataClients);
        }
      } else {
        console.warn('A propriedade "data" não foi encontrada na resposta.');
      }
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

  const optionsProducts = [
    { id: 1, nome: 'Bandeira Personalizada', preco: 10.99, prazo: 3, peso: 0.5, comprimento: 10, largura: 5, altura: 5, quantidade: 1 },
    { id: 2, nome: 'Uniformes Personalizados', preco: 20.99, prazo: 5, peso: 1, comprimento: 20, largura: 10, altura: 10, quantidade: 1 },
    { id: 3, nome: 'Bandeiras Politicas', preco: 30.99, prazo: 7, peso: 1.5, comprimento: 30, largura: 15, altura: 15, quantidade: 1 },
    { id: 4, nome: 'Bandeiras Politicas para Carros', preco: 40.99, prazo: 10, peso: 2, comprimento: 40, largura: 20, altura: 20, quantidade: 1 },
    { id: 5, nome: 'Windbanners', preco: 50.99, prazo: 15, peso: 2.5, comprimento: 50, largura: 25, altura: 25, quantidade: 1 },
    { id: 6, nome: 'Faixas de Mão', preco: 60.99, prazo: 20, peso: 3, comprimento: 60, largura: 30, altura: 30, quantidade: 1 },
    { id: 7, nome: 'Bandanas', preco: 70.99, prazo: 25, peso: 3.5, comprimento: 70, largura: 35, altura: 35, quantidade: 1 },
    { id: 8, nome: 'Balaclavas', preco: 80.99, prazo: 30, peso: 4, comprimento: 80, largura: 40, altura: 40, quantidade: 1 },
    { id: 9, nome: 'Flâmulas', preco: 90.99, prazo: 35, peso: 4.5, comprimento: 90, largura: 45, altura: 45, quantidade: 1 },
    { id: 10, nome: 'Estandartes', preco: 100.99, prazo: 40, peso: 5, comprimento: 100, largura: 50, altura: 50, quantidade: 1 },
    { id: 11, nome: 'Canecas de Porcelana', preco: 110.99, prazo: 45, peso: 5.5, comprimento: 110, largura: 55, altura: 55, quantidade: 1 },
    { id: 12, nome: 'Canecas de Alumínio', preco: 120.99, prazo: 50, peso: 6, comprimento: 120, largura: 60, altura: 60, quantidade: 1 },
    { id: 13, nome: 'Tirantes de Caneca', preco: 130.99, prazo: 55, peso: 6.5, comprimento: 130, largura: 65, altura: 65, quantidade: 1 },
    { id: 14, nome: 'Faixa de Campeão', preco: 140.99, prazo: 60, peso: 7, comprimento: 140, largura: 70, altura: 70, quantidade: 1 },
    { id: 15, nome: 'Chinelo Slide', preco: 150.99, prazo: 65, peso: 7.5, comprimento: 150, largura: 75, altura: 75, quantidade: 1 },
    { id: 16, nome: 'Chinelo de Dedo', preco: 160.99, prazo: 70, peso: 8, comprimento: 160, largura: 80, altura: 80, quantidade: 1 },
    { id: 17, nome: 'Faixa de Capitão', preco: 170.99, prazo: 75, peso: 8.5, comprimento: 170, largura: 85, altura: 85, quantidade: 1 },
    { id: 18, nome: 'Samba Canção', preco: 180.99, prazo: 80, peso: 9, comprimento: 180, largura: 90, altura: 90, quantidade: 1 },
    { id: 19, nome: 'Short Doll', preco: 190.99, prazo: 85, peso: 9.5, comprimento: 190, largura: 95, altura: 95, quantidade: 1 },
    { id: 20, nome: 'Sacochila', preco: 200.99, prazo: 90, peso: 10, comprimento: 200, largura: 100, altura: 100, quantidade: 1 },
    { id: 21, nome: 'Coletes', preco: 210.99, prazo: 95, peso: 10.5, comprimento: 210, largura: 105, altura: 105, quantidade: 1 },
    { id: 22, nome: 'Abadás', preco: 220.99, prazo: 100, peso: 11, comprimento: 220, largura: 110, altura: 110, quantidade: 1 },
    { id: 23, nome: 'Cachecol', preco: 230.99, prazo: 105, peso: 11.5, comprimento: 230, largura: 115, altura: 115, quantidade: 1 },
    { id: 24, nome: 'Bandeiras de Mesa', preco: 240.99, prazo: 110, peso: 12, comprimento: 240, largura: 120, altura: 120, quantidade: 1 },
    { id: 26, nome: 'Bandeiras para Carros', preco: 260.99, prazo: 120, peso: 13, comprimento: 260, largura: 130, altura: 130, quantidade: 1 },
    { id: 27, nome: 'Almofadas', preco: 270.99, prazo: 125, peso: 13.5, comprimento: 270, largura: 135, altura: 135, quantidade: 1 },
    { id: 28, nome: 'Roupão', preco: 280.99, prazo: 130, peso: 14, comprimento: 280, largura: 140, altura: 140, quantidade: 1 },
    { id: 29, nome: 'Toalhas', preco: 290.99, prazo: 135, peso: 14.5, comprimento: 290, largura: 145, altura: 145, quantidade: 1 }
  ];

  const productNames = optionsProducts.map((product) => product.nome);

  useEffect(() => {
    if (selectedProduct) {
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

  const handleCEPBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    const cep = event.target.value;
    const isValidCEP = await validateCEP(cep);
    if (!isValidCEP) {
      setCepError(true);
    } else {
      setCepError(false);
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
                        const selectedProduct = optionsProducts.find((product) => product.nome === selectedValue);
                        setSelectedProduct(selectedProduct ? selectedProduct : null); // Set selected product for adding
                      } else {
                        setSelectedProduct(null); // Reset selected product
                      }
                    }}
                    renderInput={(params) => (
                      <CustomTextField {...params} placeholder="Buscar produto..." aria-label="Buscar produto" />
                    )}
                  />

                  <div style={{ flex: 1 }}>
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
                        disabled={!selectedProduct}
                      >
                        Adicionar
                      </Button>
                    </div>
                  </div>
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
                    <TableCell align="right">Prazo</TableCell>
                    <TableCell align="right">Peso</TableCell>
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

        </>
      </ParentCard>
    </PageContainer >
  );
};

export default OrcamentoGerarScreen;

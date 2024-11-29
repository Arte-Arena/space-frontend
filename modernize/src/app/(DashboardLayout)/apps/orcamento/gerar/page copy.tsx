'use client'
import React, { useState, useEffect } from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import { Button, Select, MenuItem, FormControl, FormControlLabel, Box } from '@mui/material';
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

interface Product {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  peso: number;
  prazo: number;
  total: number;
}

const OrcamentoGerarScreen = () => {
  const [clientId, setClientId] = useState('');
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // Estado para armazenar o produto selecionado no Autocomplete

  const handleSubmit = async () => {
    // const accessToken = localStorage.getItem('accessToken');
    // if (!accessToken) {
    //   console.error('Access token not found');
    //   return;
    // }
    console.log('Orcamento gerado com sucesso!');
    console.log(productsList);
  }

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

  const top100Films = [
    { label: 'The Shawshank Redemption', year: 1994 },
    { label: 'The Godfather', year: 1972 },
    { label: 'The Godfather: Part II', year: 1974 },
    { label: 'The Dark Knight', year: 2008 },
    { label: '12 Angry Men', year: 1957 },
    { label: "Schindler's List", year: 1993 },
    { label: 'Pulp Fiction', year: 1994 },
    {
      label: 'The Lord of the Rings: The Return of the King',
      year: 2003,
    },
    { label: 'The Good, the Bad and the Ugly', year: 1966 },
    { label: 'Fight Club', year: 1999 },
    {
      label: 'The Lord of the Rings: The Fellowship of the Ring',
      year: 2001,
    },
    {
      label: 'Star Wars: Episode V - The Empire Strikes Back',
      year: 1980,
    },
    { label: 'Forrest Gump', year: 1994 },
    { label: 'Inception', year: 2010 },
    {
      label: 'The Lord of the Rings: The Two Towers',
      year: 2002,
    },
    { label: "One Flew Over the Cuckoo's Nest", year: 1975 },
    { label: 'Goodfellas', year: 1990 },
    { label: 'The Matrix', year: 1999 },
    { label: 'Seven Samurai', year: 1954 },
  ];

  const all_products = [
    {
      id: 1,
      nome: 'Produto 1',
      preco: 10.99,
      quantidade: 10,
      total: 109.9
    },
    {
      id: 2,
      nome: 'Produto 2',
      preco: 20.99,
      quantidade: 20,
      total: 209.8
    },
    {
      id: 3,
      nome: 'Produto 3',
      preco: 30.99,
      quantidade: 30,
      total: 309.7
    },
    {
      id: 4,
      nome: 'Produto 4',
      preco: 30.99,
      quantidade: 30,
      total: 309.7
    },
    {
      id: 5,
      nome: 'Produto 5',
      preco: 30.99,
      quantidade: 30,
      total: 309.7
    }
  ];

  useEffect(() => {
    console.log('O valor de products mudou para:', productsList);
  }, [productsList]);

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
            // helperText="Pesquise por ID do Cliente, nome, e-mail, CPF ou outra informação."
            options={top100Films}
            fullWidth
            // onChange={(event: React.ChangeEvent<{}>, value: string | null) => setClientId(value)}
            onChange={(event, value) => setClientId(value ? value.label : '')} // Atualiza o estado do cliente selecionado

            renderInput={(params) => (
              <CustomTextField {...params} placeholder="Selecione um cliente" aria-label="Selecione um cliente" />
            )}
          />


          <div>
            <div style={{ marginTop: '20px' }}>
              <Typography variant="h5" >Painel de Orçamento</Typography>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <Autocomplete
                    id="product-select"
                    options={all_products}
                    getOptionLabel={(option) => option.nome}
                    onChange={(event, value) => {
                      if (value) {
                        // Adiciona o produto selecionado com valores padrão para 'peso' e 'prazo'
                        const produtoComValoresPadrao: Product = {
                          ...value,
                          peso: value.peso || 0,
                          prazo: value.prazo || 0
                        };
                        setSelectedProduct(produtoComValoresPadrao);
                      }
                    }}
                    renderInput={(params) => (
                      <CustomTextField {...params} placeholder="Selecione um produto" aria-label="Selecione um produto" />
                    )}
                  />
                </div>
                <div style={{ marginLeft: '20px' }}>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      if (selectedProduct) {
                        adicionarItem(selectedProduct); // Adiciona o produto selecionado à lista
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
                              const updatedProduct = { ...product, prazo: +event.target.value };
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
                              const updatedProduct = { ...product, peso: +event.target.value };
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

              <div style={{ marginTop: '20px' }}>
              <Button 
                color="primary" 
                variant="contained" 
                onClick={handleSubmit}
              >
                Gerar Orçamento
              </Button>

              <IconButton>
                <IconCopy />
              </IconButton>
              </div>
            </div>
          </div>
        </div>
      </ParentCard>
    </PageContainer >
  );
};

export default OrcamentoGerarScreen;

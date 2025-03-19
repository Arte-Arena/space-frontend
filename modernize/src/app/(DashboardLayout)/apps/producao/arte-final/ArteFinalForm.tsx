'use client';
import { useState, useEffect } from "react";
import { ArteFinal, Produto, PedidoStatus, PedidoTipo, User } from './types';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomSelect from '@/app/components/forms/theme-elements/CustomSelect';
import getBrazilTime from "@/utils/brazilTime";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, subDays } from 'date-fns';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  ListItemText,
  SelectChangeEvent,
  Autocomplete,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Paper,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconPlus, IconMinus } from '@tabler/icons-react';
import { calcularDataFuturaDiasUteis, calcDiasUteisEntreDatas } from '@/utils/calcDiasUteis';
import { DateTime } from 'luxon';

interface ArteFinalFormProps {
  initialData?: ArteFinal;
  onSubmit?: (data: ArteFinal) => void;
  readOnly?: boolean;
  block_tiny?: boolean;
}

export default function ArteFinalForm({ initialData, onSubmit, readOnly = false, block_tiny = false }: ArteFinalFormProps) {
  const [formData, setFormData] = useState<ArteFinal>({
    id: 0,
    numero_pedido: 0,
    data_prevista: null,
    prazo_arte_final: 0,
    prazo_confeccao: 0,
    lista_produtos: [],
    observacoes: "",
    rolo: "",
    url_trello: "",
    designer_id: 0,
    pedido_status_id: 0,
    pedido_tipo_id: 0,
    vendedor_id: 0,
    created_at: new Date(),
    updated_at: new Date(),
  });

  const [allProducts, setAllProducts] = useState<Produto[]>([]);
  const [productNames, setProductNames] = useState<string[] | null>([]);
  const [productsList, setProductsList] = useState<Produto[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);
  const [countProduct, setCountProduct] = useState<number | null>(0);
  const [allMaterials, setAllMaterials] = useState<string[]>([]);
  const [allDesigners, setAllDesigners] = useState<User[]>([]);
  const [allStatusPedido, setAllStatusPedido] = useState<PedidoStatus[]>([]);
  const [allTiposDePedido, setAllTiposDePedido] = useState<PedidoTipo[]>([]);
  const [allVendedores, setAllVendedores] = useState<User[]>([]);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [openSucesso, setOpenSucesso] = useState(false);
  const [openFracasso, setOpenFracasso] = useState(false);
  const [fadeOut, setFadeOut] = useState(false)

  const dataProducts = localStorage.getItem('produtosConsolidadosOrcamento');
  const materiais = localStorage.getItem('materiais');
  const designers = localStorage.getItem('designers');
  const statusPedidos = localStorage.getItem('pedidosStatus');
  const tiposPedidos = localStorage.getItem('pedidosTipos');
  const vendedores = localStorage.getItem('vendedores');


  useEffect(() => {
    if (openSucesso === true) {
      const timer = setTimeout(() => {
        setTimeout(() => {
          setOpenFracasso(false);
        }, 500);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [openFracasso]);

  useEffect(() => {
    if (openSucesso === true) {
      const timer = setTimeout(() => {
        setTimeout(() => {
          setOpenSucesso(false);
        }, 500);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [openSucesso]);


  useEffect(() => {
    if (dataProducts) {
      const dataProductsArray = JSON.parse(dataProducts);
      if (Array.isArray(dataProductsArray)) {
        const transformedProducts = dataProductsArray.map((item: Produto) => ({
          id: item.id,
          nome: item.nome,
          esboco: "",
          quantidade: 1,
          material: "",
          medida_linear: 0,
          preco: item.preco,
          prazo: (item as any).dias_preparacao,
        }));
        setAllProducts(transformedProducts);
      } else {
        console.error('Dados inválidos recebidos da API:', dataProductsArray);
      }
    } else {
      console.warn('Os dados de produtos não foram encontrados.');
    }
  }, [dataProducts]);

  useEffect(() => {
    if (allProducts) {
      setProductNames(allProducts.map((product) => product.nome));
    }
  }, [allProducts]);

  useEffect(() => {
    if (materiais) {
      try {
        const materiaisArray = JSON.parse(materiais);
        if (Array.isArray(materiaisArray)) {
          const materialNames = materiaisArray.map((material) => material.descricao);
          setAllMaterials(materialNames);
        } else {
          console.error('Dados inválidos recebidos de materiais:', materiaisArray);
        }
      } catch (error) {
        console.error('Erro ao analisar JSON de materiais:', error);
      }
    } else {
      console.warn('Os dados de materiais não foram encontrados.');
    }
  }, [designers]);

  useEffect(() => {
    if (designers) {
      try {
        const designersArray = JSON.parse(designers);
        if (Array.isArray(designersArray)) {
          setAllDesigners(designersArray);
        } else {
          console.error('Dados inválidos recebidos de designers:', designersArray);
        }
      } catch (error) {
        console.error('Erro ao analisar JSON de designers:', error);
      }
    } else {
      console.warn('Os dados de designers não foram encontrados.');
    }
  }, [designers]);

  useEffect(() => {
    if (vendedores) {
      try {
        const vendedoresArray = JSON.parse(vendedores);
        if (Array.isArray(vendedoresArray)) {
          setAllVendedores(vendedoresArray);
        } else {
          console.error('Dados inválidos recebidos de designers:', vendedoresArray);
        }
      } catch (error) {
        console.error('Erro ao analisar JSON de designers:', error);
      }
    } else {
      console.warn('Os dados de designers não foram encontrados.');
    }
  }, [vendedores]);

  useEffect(() => {
    if (statusPedidos) {
      try {
        const statusPedidosArray = JSON.parse(statusPedidos);
        setAllStatusPedido(statusPedidosArray);
      } catch (error) {
        console.error('Erro ao analisar statusPedidos:', error);
      }
    }
  }, [statusPedidos]);

  useEffect(() => {
    if (tiposPedidos) {
      try {
        const tiposPedidosArray = JSON.parse(tiposPedidos);
        setAllTiposDePedido(tiposPedidosArray);
      } catch (error) {
        console.error('Erro ao analisar tiposPedidos:', error);
      }
    }
  }, [tiposPedidos]);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));

      if (initialData.lista_produtos && Array.isArray(initialData.lista_produtos) && initialData.lista_produtos.length > 0) {
        const initialProductsList = initialData.lista_produtos.map((product, index) => ({
          ...product,
          uid: Number(`${product.id}${index}`),
          esboco: product.esboco || "",
        }));
        setProductsList(initialProductsList);
      } else {
        console.log("Lista de Produtos está vazia ou não é um array");
        setProductsList([]);
      }
    }
  }, [initialData]);

  function adicionarProduto(novoProduto: Produto) {
    const existingProduct = productsList.find((product) => product.uid === novoProduto.uid);

    if (existingProduct) {
      const updatedProduct = {
        ...existingProduct,
        quantidade: isNaN(existingProduct.quantidade) ? 1 : existingProduct.quantidade + 1,
      };
      const updatedProductsList = productsList.map((product) =>
        product.uid === existingProduct.uid ? updatedProduct : product
      );
      setProductsList(updatedProductsList);
    } else {
      setProductsList([
        ...productsList,
        {
          ...novoProduto,
          uid: Number(`${novoProduto.id}${countProduct}`),
          quantidade: 1,
          preco: Number(novoProduto.preco),
          prazo: novoProduto.prazo ? novoProduto.prazo : 0,
        },
      ]);
      const newCountProduct = countProduct ? countProduct + 1 : 1;
      setCountProduct(newCountProduct);
    }
  }

  const removerProduto = (productToRemove: Produto) => {
    const updatedProductsList = productsList.filter((product) => product.uid !== productToRemove.uid);
    setProductsList(updatedProductsList);
  };

  const removerProdutoUnidade = (productToRemove: Produto) => {
    const updatedProductsList = productsList.map((product) => {
      if (product.uid === productToRemove.uid) {
        if (product.quantidade > 1) {
          return { ...product, quantidade: product.quantidade - 1 };
        } else {
          return null;
        }
      }
      return product;
    });

    setProductsList(updatedProductsList.filter((product): product is Produto => product !== null));
  };

  const atualizarProduto = (updatedProduct: Produto) => {
    setProductsList(productsList.map((product) => {
      if (product.uid === updatedProduct.uid) {
        return { ...product, ...updatedProduct };
      }
      return product;
    }));
  };

  useEffect(() => {
    if (selectedProduct) {
      adicionarProduto(selectedProduct);
    }
  }, [selectedProduct]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (readOnly) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  const handleSelectChange = (e: SelectChangeEvent<string | number | undefined>, field: string) => {
    if (readOnly) return;
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleMaterialChange = (
    event: SelectChangeEvent<string>,
    product: Produto
  ) => {
    const updatedProduct = {
      ...product,
      material: event.target.value
    };
    atualizarProduto(updatedProduct);
  };

  const calcPrazoArteFinal = (dataEntrega: Date | null, hoje: Date, prazo_confeccao: number): number => {
    if (!dataEntrega) {
      console.error('Erro: dataEntrega é nula ou indefinida.');
      return 0;
    }
    const dataEntregaLuxon = DateTime.fromJSDate(dataEntrega);
    const hojeLuxon = DateTime.fromJSDate(hoje);
    const dataFeriados = localStorage.getItem('feriados') ? JSON.parse(localStorage.getItem('feriados') as string) : { dias_feriados: [] };
    const safeDataFeriados = dataFeriados ?? { dias_feriados: [] };

    const dataProjetada = calcularDataFuturaDiasUteis(hojeLuxon, prazo_confeccao, safeDataFeriados);
    const diasUteisRestantes = calcDiasUteisEntreDatas(dataProjetada, dataEntregaLuxon, safeDataFeriados);

    return diasUteisRestantes;
  };

  const handleClick = () => {
    setOpenSucesso(true); // Exibe o alert
    setTimeout(() => {
      setOpenSucesso(false); // Oculta o alert após 3 segundos
    }, 3000);
  };

  const accessToken = localStorage.getItem('accessToken');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formSubmitted) return;

    setFormSubmitted(true);
    setLoadingSubmit(true);

    const payload = {
      block_tiny: block_tiny,
      orcamento_id: initialData?.orcamento_id,
      pedido_id: formData.id,
      estagio: 'D',
      pedido_numero: String(formData.numero_pedido),
      data_prevista: formData.data_prevista,
      prazo_arte_final: '',
      prazo_confeccao: '',
      pedido_observacoes: formData.observacoes,
      pedido_rolo: formData.rolo,
      pedido_designer_id: formData.designer_id,
      pedido_status_id: formData.pedido_status_id,
      pedido_tipo_id: formData.pedido_tipo_id,
      pedido_url_trello: formData.url_trello,
      lista_produtos: productsList.map(produto => ({
        id: produto.id,
        uid: produto.uid,
        nome: produto.nome,
        esboco: produto.esboco,
        quantidade: produto.quantidade,
        material: produto.material,
        medida_linear: produto.medida_linear,
        preco: produto.preco,
        prazo: produto.prazo,
      })),
      vendedor_id: formData.vendedor_id,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/producao/pedido-arte-final`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        setOpenFracasso(true)
        throw new Error('Erro na requisição');
      }
      const data = await response.json();
      if (onSubmit) onSubmit(data);
      handleClick();
      // window.open('/apps/producao/arte-final/', '_blank');

    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoadingSubmit(false);
      setFormSubmitted(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 border rounded-lg shadow-md">

      <Box sx={{ mt: 5 }}>
        <CustomTextField
          label="Número do Pedido"
          type="number"
          name="numero_pedido"
          value={formData.numero_pedido}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;
            const newValue = Math.max(0, parseFloat(value));
            setFormData((prev) => ({ ...prev, [name]: newValue.toString() }));
          }}
          placeholder="Numero do pedido"
          variant="outlined"
          fullWidth
          readOnly={readOnly}
          disabled={!initialData && !block_tiny}
          inputProps={{ min: 0 }}
          sx={{
            '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
              WebkitAppearance: 'none',
              margin: 0,
            },
            '& input[type=number]': {
              MozAppearance: 'textfield',
            },
          }}
        />
      </Box>

      <Box sx={{ mt: 5 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Data de Entrega Prevista"
            value={formData.data_prevista ? new Date(formData.data_prevista) : null} // Garante que a data inicial seja válida
            onChange={(newValue) => {
              if (!newValue) return;

              const dataCorrigida = new Date(newValue);
              dataCorrigida.setHours(0, 0, 0, 0); // Define o horário para meia-noite

              setFormData((prev) => ({
                ...prev,
                data_prevista: dataCorrigida
              }));
            }}
            inputFormat="dd/MM/yyyy"
            minDate={subDays(getBrazilTime(), 1)}
            renderInput={(params) => (
              <CustomTextField
                {...params}
                fullWidth
                readOnly={readOnly}
              />
            )}
          />
        </LocalizationProvider>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Autocomplete
          freeSolo
          id="produto"
          disabled={!formData.data_prevista}
          options={productNames?.length ? productNames : []}
          onChange={(event, selectedValue) => {
            if (selectedValue) {
              if (dataProducts) {
                const dataProductsArray = JSON.parse(dataProducts);
                const selectedProduct = dataProductsArray.find((product: Produto) => product.nome === selectedValue) as Produto | undefined;
                setSelectedProduct(selectedProduct ? selectedProduct : null);
              } else {
                setSelectedProduct(null);
              }
            }
          }}
          renderInput={params => (
            <CustomTextField
              {...params}
              label="Produtos"
              margin="normal"
              variant="outlined"
              fullWidth
              helperText={formData.data_prevista ? '' : 'Insira a data de entrega para habilitar este campo. Resete o campo para adicionar o mesmo produto.'}
            />
          )}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Produto</TableCell>
              <TableCell align="right">Esboço</TableCell>
              <TableCell align="right">Quantidade</TableCell>
              <TableCell align="right">Materiais</TableCell>
              <TableCell align="right">Medida Linear</TableCell>
              <TableCell align="right">Prazo Confecção</TableCell>
              <TableCell align="right">Prazo Arte Final</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productsList.map((product: Produto, index) => (
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
                  <CustomTextField
                    value={product.esboco}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      const updatedProduct = { ...product, esboco: event.target.value };
                      atualizarProduto(updatedProduct);
                    }}
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
                        MozAppearance: 'textfield',
                      },
                    }}
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
                      width: '70px',
                      '& input[type=number]::-webkit-inner-spin-button': {
                        display: 'none',
                      },
                      '& input[type=number]::-webkit-outer-spin-button': {
                        display: 'none',
                      },
                      '& input[type=number]': {
                        MozAppearance: 'textfield',
                      },
                    }}
                  />
                </TableCell>

                <TableCell align="right">

                  <FormControl fullWidth sx={{ minWidth: '100px' }}>
                    <InputLabel id="material-select-label">Material</InputLabel>
                    <CustomSelect
                      labelId="material-select-label"
                      name="material"
                      value={product.material || ''}
                      onChange={(e: SelectChangeEvent<string>) => handleMaterialChange(e, product)}
                    >
                      {allMaterials.map((material) => (
                        <MenuItem key={material} value={material}>
                          <ListItemText primary={material} />
                        </MenuItem>
                      ))}
                    </CustomSelect>
                  </FormControl>
                </TableCell>

                <TableCell align="right">
                  <CustomTextField
                    value={product.medida_linear === 0 ? "" : product.medida_linear}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      const inputValue = event.target.value;
                      if (/^\d*\.?\d*$/.test(inputValue)) {
                        const newValue = inputValue === "" ? 0 : Number(inputValue);
                        const newProductValue = Math.max(0, newValue);
                        const updatedProduct = { ...product, medida_linear: newProductValue };
                        atualizarProduto(updatedProduct);
                      }
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
                        MozAppearance: 'textfield',
                      },
                    }}
                  />
                </TableCell>

                <TableCell align="right">
                  <CustomTextField
                    value={product.prazo}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      const newProductValue = Math.max(0, +event.target.value);
                      const updatedProduct = { ...product, prazo_confeccao: newProductValue };
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
                        MozAppearance: 'textfield',
                      },
                    }}
                  />
                </TableCell>

                <TableCell align="right">
                  <CustomTextField
                    value={calcPrazoArteFinal(formData.data_prevista, getBrazilTime(), product.prazo)}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      const newProductValue = Math.max(0, +event.target.value);
                      const updatedProduct = { ...product, prazo_arte: newProductValue };
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
                        MozAppearance: 'textfield',
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
                  <IconButton
                    onClick={() => adicionarProduto(product)}
                    disabled={!product.esboco}
                  >
                    <IconPlus />
                  </IconButton>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 5 }}>
        <CustomTextField
          label="Observações"
          name="observacoes"
          value={formData.observacoes}
          onChange={handleChange}
          placeholder="Observações"
          fullWidth
          readOnly={readOnly}
        />
      </Box>

      <Box sx={{ mt: 5 }}>
        <CustomTextField
          label="Rolo"
          name="rolo"
          value={formData.rolo}
          onChange={handleChange}
          placeholder="Rolo"
          fullWidth
          readOnly={readOnly}
        />
      </Box>

      <Box sx={{ mt: 5 }}>
        <CustomTextField
          label="Link Trello"
          name="url_trello"
          value={formData.url_trello}
          onChange={handleChange}
          placeholder="Link Trello"
          fullWidth
          readOnly={readOnly}
        />
      </Box>

      <FormControl sx={{ mt: 5, width: '100%' }}>
        <InputLabel id="designer_pedido">Designer</InputLabel>
        <CustomSelect
          label="Designer"
          name="designer"
          value={formData.designer_id}
          onChange={(e: SelectChangeEvent<number>) => handleSelectChange(e, 'designer_id')}
          fullWidth
          readOnly={readOnly}
        >
          {allDesigners.map((designer) => (
            <MenuItem key={designer.id} value={designer.id}>
              <ListItemText primary={designer.name} />
            </MenuItem>
          ))}
        </CustomSelect>
      </FormControl>

      <FormControl sx={{ mt: 5, width: '100%' }}>
        <InputLabel>Status</InputLabel>
        <CustomSelect
          value={String(formData.pedido_status_id)}
          onChange={(e: SelectChangeEvent<string>) => handleSelectChange(e, 'pedido_status_id')}
          fullWidth
          readOnly={readOnly}
        >
          {allStatusPedido.map((status) => (
            <MenuItem key={status.id} value={status.id}>
              {`${status.fila === 'D' ? 'Design' : 'Impressão'} - ${status.nome}`}
            </MenuItem>
          ))}
        </CustomSelect>
      </FormControl>

      <FormControl sx={{ mt: 5, width: '100%' }}>
        <InputLabel>Tipo de Pedido</InputLabel>
        <CustomSelect
          value={String(formData.pedido_tipo_id)}
          onChange={(e: SelectChangeEvent<string>) => handleSelectChange(e, 'pedido_tipo_id')}
          fullWidth
          readOnly={readOnly}
        >
          {allTiposDePedido.map((tipo) => (
            <MenuItem key={tipo.id} value={tipo.id}>
              {tipo.nome}
            </MenuItem>
          ))}
        </CustomSelect>
      </FormControl>

      <FormControl sx={{ mt: 5, width: '100%' }}>
        <InputLabel>Vendedor</InputLabel>
        <CustomSelect
          value={String(formData.vendedor_id)}
          onChange={(e: SelectChangeEvent<string>) => handleSelectChange(e, 'vendedor_id')}
          fullWidth
          readOnly={readOnly}
        >
          {allVendedores.map((tipo) => (
            <MenuItem key={tipo.id} value={tipo.id}>
              {tipo.name}
            </MenuItem>
          ))}
        </CustomSelect>
      </FormControl>

      {!readOnly && (
        <Box sx={{ mt: 5 }}>
          <Button type="submit" variant="contained" color="primary" disabled={loadingSubmit}>
            {loadingSubmit ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              initialData ? "Salvar Alterações" : "Cadastrar Pedido"
            )}
          </Button>
        </Box>
      )}
      {openSucesso && (
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: 2,
            backgroundColor: 'tranparent',
            borderRadius: 1,
            boxShadow: 3,
            opacity: fadeOut ? 0 : 1, // Opacidade muda para 0 quando fadeOut é true
            transition: 'opacity 0.5s ease-out', // Transição suave de opacidade
          }}
        >
          <Alert severity="success" onClose={() => setOpenSucesso(false)}>
            Pedido Enviado Com Sucesso!!
          </Alert>
        </Box>
      )}

      {openFracasso && (
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: 2,
            backgroundColor: 'tranparent',
            borderRadius: 1,
            boxShadow: 3,
            opacity: fadeOut ? 0 : 1, // Opacidade muda para 0 quando fadeOut é true
            transition: 'opacity 0.5s ease-out', // Transição suave de opacidade
          }}
        >
          <Alert severity="error" onClose={() => setOpenFracasso(false)}>
            Pedido Não enviado
          </Alert>
        </Box>
      )}

    </form>
  );
}
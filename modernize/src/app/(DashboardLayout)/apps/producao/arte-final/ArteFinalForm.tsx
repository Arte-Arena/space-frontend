'use client';
import { useState, useEffect } from "react";
import { ArteFinal, Produto } from './types';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomSelect from '@/app/components/forms/theme-elements/CustomSelect';
import getBrazilTime from "@/utils/brazilTime";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { subDays } from 'date-fns';
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
  Select,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconPlus, IconMinus } from '@tabler/icons-react';
import {calcularDataFuturaDiasUteis, calcDiasUteisEntreDatas} from '@/utils/calcDiasUteis';
import { DateTime } from 'luxon';

interface ArteFinalFormProps {
  initialData?: ArteFinal;
  onSubmit?: (data: ArteFinal) => void;
  readOnly?: boolean;
}

export default function ArteFinalForm({ initialData, onSubmit, readOnly = false }: ArteFinalFormProps) {
  const [formData, setFormData] = useState<ArteFinal>({
    id: undefined,
    numero_pedido: undefined,
    data_entrega: null,
    prazo_arte_final: 0,
    prazo_confeccao: 0,
    lista_produtos: [],
    observacao: "",
    rolo: "",
    url_trello: "",
    designer: 0,
    status: "",
    tipo_de_pedido: "",
    created_at: new Date(),
    updated_at: new Date(),
  });
  const [allProducts, setAllProducts] = useState<Produto[]>([]);
  const [productNames, setProductNames] = useState<string[] | null>([]);
  const [productsList, setProductsList] = useState<Produto[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);
  const [countProduct, setCountProduct] = useState<number | null>(0);
  const [allMaterials, setAllMaterials] = useState<string[]>([]);
  const [allDesigners, setAllDesigners] = useState<string[]>([]);
  const [allStatusPedido, setAllStatusPedido] = useState<string[]>([]);
  const [allTiposDePedido, setAllTiposDePedido] = useState<string[]>([]);

  const dataProducts = localStorage.getItem('produtosConsolidadosOrcamento');
  const materiais = localStorage.getItem('materiais');
  const designers = localStorage.getItem('designers');
  const statusPedidos = localStorage.getItem('pedidosStatus');
  const tiposPedidos = localStorage.getItem('pedidosTipos');

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
          console.log("materialNames", materialNames)
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
          const designerNames = designersArray.map((designer) => designer.name);
          setAllDesigners(designerNames);
          console.log("designerNames", designerNames)
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
    if (statusPedidos) {
      try {
        const statusPedidosArray = JSON.parse(statusPedidos);
        if (Array.isArray(statusPedidosArray)) {
          const statusPedidosNames = statusPedidosArray.map((status) => {
            let fila = '';
            switch (status.fila) {
              case 'D':
                fila = 'Design';
                break;
              case 'I':
                fila = 'Impressão';
                break;
              default:
                break;
            }
            return fila ? `${fila} - ${status.nome}` : status.nome;
          });
          setAllStatusPedido(statusPedidosNames);
          console.log("statusPedidosNames", statusPedidosNames)

        } else {
          console.error('Dados inválidos recebidos de statusPedidos:', statusPedidosArray);
        }
      } catch (error) {
        console.error('Erro ao analisar JSON de statusPedidos:', error);
      }
    } else {
      console.warn('Os dados de statusPedidos não foram encontrados.');
    }
  }, [statusPedidos]);

  useEffect(() => {
    if (tiposPedidos) {
      try {
        const tiposPedidosArray = JSON.parse(tiposPedidos);
        if (Array.isArray(tiposPedidosArray)) {
          const tiposPedidosNames = tiposPedidosArray.map((tipo) => tipo.nome);
          setAllTiposDePedido(tiposPedidosNames);
          console.log("tiposPedidosNames", tiposPedidosNames)
        } else {
          console.error('Dados inválidos recebidos de tiposPedidos:', tiposPedidosArray);
        }
      } catch (error) {
        console.error('Erro ao analisar JSON de tiposPedidos:', error);
      }
    } else {
      console.warn('Os dados de tiposPedidos não foram encontrados.');
    }
  }, [tiposPedidos]);


  // const tipoPedidos = ["Antecipacao", "Prazo Normal"];


  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
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
      console.log('selectedProduct:', selectedProduct);
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (productsList) {
      console.log('productsList:', productsList);
    }
  }, [productsList]);

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
    console.log('enviado');
  }

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
          disabled={!initialData}
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
            value={formData.data_entrega}
            onChange={(newValue) => {
              setFormData((prev) => ({
                ...prev,
                data_entrega: newValue,
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
          disabled={!formData.data_entrega}
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
              helperText={formData.data_entrega ? '' : 'Insira a data de entrega para habilitar este campo. Resete o campo para adicionar o mesmo produto.'}
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
                    <Select
                      labelId="material-select-label"
                      name="material"
                      value={product.material || ''}
                      onChange={(e) => handleMaterialChange(e, product)}
                    >
                      {allMaterials.map((material) => (
                        <MenuItem key={material} value={material}>
                          <ListItemText primary={material} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>

                <TableCell align="right">
                  <CustomTextField
                    value=""
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      const newProductValue = Math.max(0, +event.target.value);
                      const updatedProduct = { ...product, medida_linear: newProductValue };
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
                    value={calcPrazoArteFinal(formData.data_entrega, getBrazilTime(), product.prazo)}
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
          label="Observação"
          name="observacao"
          value={formData.observacao}
          onChange={handleChange}
          placeholder="Observação"
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
        <Select
          label="Designer"
          name="designer"
          value={formData.designer ? String(formData.designer) : ""}
          onChange={(e: SelectChangeEvent<string>) => handleSelectChange(e, 'designer')}
          fullWidth
          readOnly={readOnly}
        >
          {allDesigners.map((designerName) => (
            <MenuItem key={designerName} value={designerName}>
              <ListItemText primary={designerName} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ mt: 5, width: '100%' }}>
        <InputLabel id="status_pedido">Status do Pedido com Arte Final</InputLabel>
        <CustomSelect
          label="Status"
          name="status"
          value={formData.status}
          onChange={(e: SelectChangeEvent<string>) => handleSelectChange(e, 'status')}
          fullWidth
          readOnly={readOnly}
        >
          {allStatusPedido.map((tipo) => (
            <MenuItem key={tipo} value={tipo}>
              <ListItemText primary={tipo} />
            </MenuItem>
          ))}
        </CustomSelect>
      </FormControl>

      <FormControl sx={{ mt: 5, width: '100%' }}>
        <InputLabel id="tipo_pedido">Tipo de Pedido</InputLabel>
        <CustomSelect
          label="Tipo de Pedido"
          name="tipo_de_pedido"
          value={formData.tipo_de_pedido}
          onChange={(e: SelectChangeEvent<string>) => handleSelectChange(e, 'tipo_de_pedido')}
          fullWidth
          readOnly={readOnly}
        >
          {allTiposDePedido.map((tipo) => (
            <MenuItem key={tipo} value={tipo}>
              <ListItemText primary={tipo} />
            </MenuItem>
          ))}
        </CustomSelect>
      </FormControl>


      {!readOnly && (
        <Box sx={{ mt: 5 }}>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? "Salvar Alterações" : "Cadastrar Produto"}
          </Button>
        </Box>
      )}
    </form>
  );
}
'use client';
import { useState, useEffect } from "react";
import { ArteFinal, Produto, Material } from './types';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomSelect from '@/app/components/forms/theme-elements/CustomSelect';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { NumericFormat } from 'react-number-format';


interface ArteFinalFormProps {
  initialData?: ArteFinal;
  onSubmit?: (data: ArteFinal) => void;
  readOnly?: boolean;
}

export default function ArteFinalForm({ initialData, onSubmit, readOnly = false }: ArteFinalFormProps) {
  const [formData, setFormData] = useState<ArteFinal>({
    id: undefined,
    numero_pedido: 0,
    data_prevista: new Date(),
    lista_produtos: [],
    observacao: "",
    rolo: "",
    url_trello: "",
    designer: "",
    status: "",
    tipo_de_pedido: "",
    created_at: new Date(),
    updated_at: new Date(),
  });
  const [productsList, setProductsList] = useState<Produto[]>([
    {
      id: 1,
      tipo_produto: "Abadá",
      materiais: [],
      medida_linear: 10,
    },
    {
      id: 2,
      tipo_produto: "Camisa",
      materiais: [],
      medida_linear: 10,
    }, {
      id: 3,
      tipo_produto: "Bandeira",
      materiais: [],
      medida_linear: 10,
    }
  ]);
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);

  const productNames = productsList.map((product) => product.tipo_produto);
  const materials = ["Dryft Liso", "Dryft Sport Star"];
  const tipoPedidos = ["Antecipacao", "Prazo Normal"];
  const designers = ["Bruna", "Eduardo", "Will"];

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);


  function adicionarProduto(novoProduto: Produto) {
      setProductsList([
        ...productsList,
        {
          ...novoProduto
        },
      ]);
  }

  const removerProduto = (productToRemove: Produto) => {
    const updatedProductsList = productsList.filter((product) => product.id !== productToRemove.id);
    setProductsList(updatedProductsList);
  };

  const atualizarProduto = (updatedProduct: Produto) => {
    const updatedProductsList = productsList.map((product) =>
      product.id === updatedProduct.id ? updatedProduct : product
    );
    setProductsList(updatedProductsList);
  };

  useEffect(() => {
    if (selectedProduct) {
      adicionarProduto(selectedProduct);
      // console.log('selectedProduct:', selectedProduct);
    }
  }, [selectedProduct]);
  

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (readOnly) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  const handleSelectChange = (e: SelectChangeEvent<string | number | undefined>, field: string) => {//+
    if (readOnly) return;//+
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));//+
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
          onChange={handleChange}
          placeholder="Numero do pedido"
          variant="outlined"
          fullWidth
          readOnly={readOnly}
        />
      </Box>

      <Box sx={{ mt: 5 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Data Prevista"
            value={formData.data_prevista}
            onChange={(newValue) => {
              setFormData((prev) => ({
                ...prev,
                data_prevista: newValue || new Date(), // Garantir que não seja undefined
              }));
            }}
            inputFormat="dd/MM/yyyy" // Formato desejado
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
          options={productNames?.length ? productNames : []}
          // getOptionLabel={(option) => option}
          onChange={(event, selectedValue) => {
            if (selectedValue) {
              if (productsList) {
                const dataProductsArray = productsList.map((product: Produto) => product);
                const selectedProduct = dataProductsArray.find((product: Produto) => product.tipo_produto === selectedValue) as Produto | undefined;
                setSelectedProduct(selectedProduct ? selectedProduct : null); // Set selected product for adding
              } else {
                setSelectedProduct(null); // Reset selected product
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
            />
          )}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Produto</TableCell>
              <TableCell align="right">Material</TableCell>
              <TableCell align="right">Medida Linear</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productsList.map((product: Produto, index) => (
              <TableRow key={index}>

                <TableCell>
                  <CustomTextField
                    value={product.tipo_produto}
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
                    value={product.materiais}
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
                    value={product.medida_linear}
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
                        MozAppearance: 'textfield', // Para Firefox
                      },
                    }}
                  />
                </TableCell>

                <TableCell align="right" sx={{ display: 'flex', gap: 1 }}>
                  <IconButton onClick={() => removerProduto(product)}>
                    <DeleteIcon />
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
        <CustomSelect
          label="Designer"
          name="designer"
          value={formData.designer}
          onChange={(e: SelectChangeEvent<string>) => handleSelectChange(e, 'designer')}
          fullWidth
          readOnly={readOnly}
        >
          {designers.map((designer) => (
            <MenuItem key={designer} value={designer}>
              <ListItemText primary={designer} />
            </MenuItem>
          ))}
        </CustomSelect>
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
          {tipoPedidos.map((tipo) => (
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
          {tipoPedidos.map((tipo) => (
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
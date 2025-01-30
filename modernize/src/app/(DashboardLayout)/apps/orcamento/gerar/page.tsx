'use client'
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/utils/useAuth';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CircularProgress from '@mui/material/CircularProgress';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import getBrazilTime from '@/utils/brazilTime';
import Image from "next/image";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { DateTime } from 'luxon';
import contarFinaisDeSemana from '@/utils/contarFinaisDeSemana';
import contarFeriados from '@/utils/contarFeriados';
import avancarDias from '@/utils/avancarDias';
import encontrarProximoDiaUtil from '@/utils/encontrarProximoDiaUtil';
import exportarPDF from '@/utils/exportarPDF';
import { useRouter, useSearchParams } from 'next/navigation';
import { IconCopy, IconPlus, IconMinus, IconDeviceFloppy, IconFileTypePdf } from '@tabler/icons-react';
import CustomCheckbox from '@/app/components/forms/theme-elements/CustomCheckbox';
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
  Typography
} from '@mui/material';


interface Cliente {
  id: number;
  nome: string | null;
  telefone: string | null;
  email: string | null;
}

interface ApiResponseClientes {
  status: string;
  data: Cliente[];
  pagination?: {
    current_page: number;
    total_pages: number;
    total_items: number;
  };
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

interface Feriado {
  id: number;
  start_at: string;
}

interface ApiResponseFeriados {
  dias_feriados: Feriado[];
}

interface FreteData {
  name: string;
  price: string;
  delivery_time: number;
}

const OrcamentoGerarScreen = () => {
  const isLoggedIn = useAuth();

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id') ?? null;

  const [isLoadedClients, setIsLoadedClients] = useState(false);
  const [allClients, setAllClients] = useState<Cliente[]>([]);
  const [currentPageClients, setCurrentPageClients] = useState(1);
  const [totalPagesClients, setTotalPagesClients] = useState<number | null>(null);
  const [searchQueryClients, setSearchQueryClients] = useState<string>('');
  const [clientInputValue, setClientInputValue] = useState<string | null>(null);
  const [clientId, setClientId] = useState<number | ''>('');
  const [isLoadedProducts, setIsLoadedProducts] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [produtosComAtributoZerado, setProdutosComAtributoZerado] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openSnackbarProdutosComAtributoZerado, setOpenSnackbarProdutosComAtributoZerado] = useState(false);
  const [openBudget, setOpenBudget] = React.useState(false);
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
  const [orçamentoTexto, setOrçamentoTexto] = useState('');
  const [cep, setCEP] = useState('');
  const [cepError, setCepError] = useState(false);
  const [isFetchingFrete, setIsFetchingFrete] = useState(false);
  const [cepSuccess, setCepSuccess] = useState(false);
  const [address, setAddress] = useState('');
  const [precoPac, setPrecoPac] = useState<number | null>(null);
  const [prazoPac, setPrazoPac] = useState<number | null>(null);
  const [precoSedex, setPrecoSedex] = useState<number | null>(null);
  const [prazoSedex, setPrazoSedex] = useState<number | null>(null);
  const [precoSedex10, setPrecoSedex10] = useState<number | null>(null);
  const [prazoSedex10, setPrazoSedex10] = useState<number | null>(null);
  const [precoSedex12, setPrecoSedex12] = useState<number | null>(null);
  const [prazoSedex12, setPrazoSedex12] = useState<number | null>(null);
  const [precoMiniEnvios, setPrecoMiniEnvios] = useState<number | null>(null);
  const [prazoMiniEnvios, setPrazoMiniEnvios] = useState<number | null>(null);
  const [shippingOption, setShippingOption] = useState('');
  const [isUrgentDeliverySelected, setIsUrgentDeliverySelected] = useState(false);
  const [isAnticipation, setIsAnticipation] = useState(false);
  const [openAnticipation, setOpenAnticipation] = useState(false);
  const [dataDesejadaEntrega, setDataDesejadaEntrega] = useState<DateTime | null>(null);
  const [precoFrete, setPrecoFrete] = useState<number | null>(null);
  const [prazoFrete, setPrazoFrete] = useState<number | null>(null);
  const [prazoProducao, setPrazoProducao] = useState<number | null>(null);
  // const [freteAtualizado, setFreteAtualizado] = useState<boolean>(false);
  const [loadingPrevisao, setLoadingPrevisao] = useState(false);
  const [previsaoEntrega, setPrevisaoEntrega] = useState<DateTime | null>(null)
  const [checkedOcultaPrevisao, setCheckedOcultaPrevisao] = useState<boolean>(false);
  const descriptionElementRef = React.useRef<HTMLElement>(null);
  const [openSnackbarCopiarOrcamento, setOpenSnackbarCopiarOrcamento] = useState(false);

  const accessToken = localStorage.getItem('accessToken');

  const { isFetching: isFetchingClients, error: errorClients, data: dataClients } = useQuery<ApiResponseClientes>({
    queryKey: ['clientData', currentPageClients], // Chave da query
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/clientes-consolidados?page=${currentPageClients}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar clientes: ${response.statusText}`);
      }

      return response.json();
    }
  });

  // useEffect para processar a resposta da API
  useEffect(() => {
    if (dataClients) {
      // console.log('Resposta da API:', dataClients);
      if (dataClients.status === 'success' && Array.isArray(dataClients.data)) {
        setAllClients((prevClients) => [
          ...prevClients,
          ...dataClients.data.map(({ id, nome, telefone, email }) => ({
            id,
            nome,
            telefone,
            email,
          })),
        ]);

        // Atualiza o total de páginas (se for a primeira resposta)
        if (dataClients.pagination) {
          setTotalPagesClients(dataClients.pagination.total_pages);
        }
      } else {
        console.error('Formato inesperado nos dados da API:', dataClients);
      }
    }
  }, [dataClients]);

  useEffect(() => {
    if (allClients.length > 0 && !isFetchingClients && !errorClients) {
      setIsLoadedClients(true);
    }
  }, [allClients, isFetchingClients, errorClients]);

  const handleScrollClients = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isBottom = scrollHeight - scrollTop === clientHeight;

    if (isBottom && totalPagesClients !== null && currentPageClients < totalPagesClients) {
      setCurrentPageClients((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (allClients.length > 0) {
      // console.log('Clientes consolidados carregados:', allClients);
    }
  }, [allClients]);

  useEffect(() => {
    if (clientId) {
      // console.log('Cliente selecionado:', clientId);
    }
  }, [clientId]);

  useEffect(() => {
    if (allClients) {
      // console.log('allClients:', allClients);
    }
  }, [allClients]);

  const handleChangeClientesConsolidadosInput = (
    event: React.ChangeEvent<{}>,
    value: Cliente | null
  ) => {
    setClientId(value ? value.id : '');
    setClientInputValue(value ? value.nome : '');
  };

  const handleSearchClientes = () => {
    setIsLoadedClients(false);

    fetch(`${process.env.NEXT_PUBLIC_API}/api/clientes-consolidados?search=${searchQueryClients}&page=${currentPageClients}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.data) && data.data.length === 0) {
          console.log('Sem opções disponíveis para essa busca [clientes]')
          setAllClients([
            {
              id: 1,
              nome: searchQueryClients,
              telefone: searchQueryClients,
              email: searchQueryClients,
            },
          ]);
          setIsLoadedClients(true);
        } else {
          // console.log('Opções encontradas [busca de clientes]');
          setAllClients(data.data);
          setIsLoadedClients(true);
        }
      })
      .catch((error) => console.error('Erro ao buscar clientes:', error));
  };

  // Função para reiniciar a pesquisa ao pressionar Enter
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      setCurrentPageClients(1); // Reset para a primeira página
      setAllClients([]); // Limpar resultados anteriores
      handleSearchClientes();
    }
  };

  const { isFetching: isFetchingProducts, error: errorProducts, data: dataProducts } = useQuery({
    queryKey: ['productData'],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API}/api/produto-orcamento-consolidado`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((res) => res.json()),
  });

  useEffect(() => {
    if (dataProducts) {
      // console.log('productData:', dataProducts);
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
    if (allProducts.length > 0 && !isFetchingProducts && !errorProducts) {
      setIsLoadedProducts(true);
    }
  }, [allProducts, isFetchingProducts, errorProducts]);

  useEffect(() => {
    if (allProducts) {
      // console.log('allProducts:', allProducts);
    }
  }, [allProducts]);

  const productNames = allProducts.map((product) => product.nome);

  useEffect(() => {
    if (selectedProduct) {
      adicionarProduto(selectedProduct);
      // console.log('selectedProduct:', selectedProduct);
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (productsList) {
      // console.log('productsList:', productsList);
      setPrazoProducao(Math.max(...productsList.map(product => product.prazo ?? 0)));

      if (cep) {
        getFrete(cep);
      }
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

  useEffect(() => {
    const checkZeroAttribute = () => {
      return productsList.some((product) =>
        Object.values(product).some((value) => value === 0)
      );
    };

    const hasZeroAttribute = checkZeroAttribute();
    setProdutosComAtributoZerado(hasZeroAttribute);

    if (hasZeroAttribute) {
      setOpenSnackbarProdutosComAtributoZerado(true);
    }

  }, [productsList]);

  useEffect(() => {
    // console.log(
    //   `produtosComAtributoZerado (após atualização): ${produtosComAtributoZerado ? 'SIM' : 'NÃO'}`
    // );

  }, [produtosComAtributoZerado]); // Executa este useEffect quando produtosComAtributoZerado mudar

  const handleCloseSnackbarProdutosComAtributoZerado = () => {
    setOpenSnackbarProdutosComAtributoZerado(false);
  }

  const today = DateTime.fromJSDate(getBrazilTime());

  // console.log('Today: ' + today);
  const mesAtual = today.month;
  const anoAtual = today.year;

  // console.log('mesAtual', mesAtual);
  // console.log('anoAtual', anoAtual);

  const { isFetching: isFetchingFeriados, error: errorFeriados, data: dataFeriados } = useQuery<ApiResponseFeriados>({
    queryKey: ['feriadosData'], // Chave da query
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/calendar/feriados-ano-mes?ano=${anoAtual}&mes=${mesAtual}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar clientes: ${response.statusText}`);
      }

      return response.json();
    }
  });




  const validateCEP = async (cep: string) => {

    if (!cep) {
      console.log('CEP não fornecido');
      return false;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (response.ok && data.cep) {
        // console.log('cep válido');
        // console.log(data);
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
    setIsFetchingFrete(true);
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

      const data: FreteData[] = await response.json();

      const fretesByName: { [key: string]: FreteData } = {};

      data.forEach(frete => {
        fretesByName[frete.name.toLowerCase().replace(/\s/g, '')] = frete; // Use lowercase and remove spaces for consistent keys
      });

      // console.log('Fretes by name:', fretesByName);

      // Example usage with state updates:
      if (fretesByName.pac) {
        setPrecoPac(Number(fretesByName.pac.price));
        setPrazoPac(fretesByName.pac.delivery_time);
      }

      if (fretesByName.sedex) {
        setPrecoSedex(Number(fretesByName.sedex.price));
        setPrazoSedex(fretesByName.sedex.delivery_time);
      }

      if (fretesByName.sedex10) {
        setPrecoSedex10(Number(fretesByName.sedex10.price));
        setPrazoSedex10(fretesByName.sedex10.delivery_time);
      }

      if (fretesByName.sedex12) {
        setPrecoSedex12(Number(fretesByName.sedex12.price));
        setPrazoSedex12(fretesByName.sedex12.delivery_time);
      }

      if (fretesByName.minienvios) {
        setPrecoMiniEnvios(Number(fretesByName.minienvios.price));
        setPrazoMiniEnvios(fretesByName.minienvios.delivery_time);
      }

      setCepSuccess(true);

    } catch (error) {
      console.error('Error fetching frete:', error);
    } finally {
      setIsFetchingFrete(false);
      if (clientId && productsList && shippingOption && cep && address && prazoProducao && prazoFrete) {
        console.log("0000");
        calcPrevisao();
      }
    }
  };

  useEffect(() => {
    if (clientId && productsList) {
      // console.log('Opção de entrega atualizada', shippingOption);
      // setFreteAtualizado(true);
      switch (shippingOption) {
        case 'RETIRADA':
          setPrazoFrete(1);
          setPrecoFrete(0.00);
          break;
        case 'MINIENVIOS':
          setPrazoFrete(prazoMiniEnvios);
          setPrecoFrete(precoMiniEnvios);
          break;
        case 'PAC':
          setPrazoFrete(prazoPac);
          setPrecoFrete(precoPac);
          break;
        case 'SEDEX':
          setPrazoFrete(prazoSedex);
          setPrecoFrete(precoSedex);
          break;
        case 'SEDEX10':
          setPrazoFrete(prazoSedex10);
          setPrecoFrete(precoSedex10);
          break;
        case 'SEDEX12':
          setPrazoFrete(prazoSedex12);
          setPrecoFrete(precoSedex12);
          break;
        default:
          console.error('Invalid shipping option:', shippingOption);
          setPrazoFrete(0);
          setPrecoFrete(0);
      }
    }
  }, [shippingOption]);

  useEffect(() => {
    if (clientId && productsList && shippingOption && cep && address && prazoProducao && (prazoFrete === 0 || prazoFrete)) {
      if (isUrgentDeliverySelected) {
        console.log("-0001");
        calcPrevisao();
      }
    }
  }, [isUrgentDeliverySelected]);

  useEffect(() => {
    if (clientId && productsList && shippingOption && cep && address && prazoProducao && (prazoFrete === 0 || prazoFrete)) {
      console.log('00001');
      calcPrevisao();
    }
  }, [clientId]);

  useEffect(() => {
    if (clientId && productsList && shippingOption && cep && address && prazoProducao && (prazoFrete === 0 || prazoFrete)) {
      console.log('00002');
      calcPrevisao();
    }
  }, [productsList]);

  useEffect(() => {
    if (clientId && productsList && shippingOption && cep && address && prazoProducao && (prazoFrete === 0 || prazoFrete)) {
      console.log('00003');
      calcPrevisao();
    }
  }, [shippingOption]);

  useEffect(() => {
    if (clientId && productsList && shippingOption && cep && address && prazoProducao && (prazoFrete === 0 || prazoFrete)) {
      console.log('00004');
      calcPrevisao();
    }
  }, [cep]);

  useEffect(() => {
    if (clientId && productsList && shippingOption && cep && address && prazoProducao && (prazoFrete === 0 || prazoFrete)) {
      console.log('00005');
      calcPrevisao();
    }
  }, [address]);

  useEffect(() => {
    if (clientId && productsList && shippingOption && cep && address && prazoProducao && (prazoFrete === 0 || prazoFrete)) {
      console.log('00006');
      calcPrevisao();
    }
  }, [prazoProducao]);

  useEffect(() => {
    if (clientId && productsList && shippingOption && cep && address && prazoProducao && (prazoFrete === 0 || prazoFrete)) {
      console.log('00007');
      calcPrevisao();
    }
  }, [prazoFrete]);

  // useEffect(() => {
  //   if (clientId && productsList && shippingOption && cep && address && prazoProducao && (prazoFrete === 0 || prazoFrete)) {
  //     console.log('00008');
  //     calcPrevisao();
  //   }
  // }, [freteAtualizado]);

  useEffect(() => {
    if (clientId && productsList && shippingOption && cep && address && prazoProducao && (prazoFrete === 0 || prazoFrete)) {
      console.log('00009');
      calcPrevisao();
    }
  }, [prazoProducao]);

  const calcPrevisao = async () => {
    // setFreteAtualizado(false);
    setLoadingPrevisao(true);
    setPrevisaoEntrega(null);

    await new Promise(resolve => setTimeout(resolve, 300));

    console.log(' ---------------- Calculando a previsão... Iniciando calculo de previsão de entrega');

    console.log('prazoFrete: ', prazoFrete);

    if (clientId && productsList && shippingOption && cep && address && prazoProducao && (prazoFrete || prazoFrete === 0)) {

      const safeDataFeriados = dataFeriados ?? { dias_feriados: [] };

      console.log('Calculando a previsão... inciando... shippingOption: ', shippingOption);
      console.log('Calculando a previsão... prazoProducao: ', prazoProducao);
      console.log('Calculando a previsão... prazoFrete: ', prazoFrete);

      const prazoProducaoFinsSemana = contarFinaisDeSemana(getBrazilTime(), prazoProducao);
      console.log('Calculando a previsão... prazoProducaoFinsSemana: ', prazoProducaoFinsSemana);

      const prazoProducaoFeriados = await contarFeriados(safeDataFeriados, getBrazilTime(), prazoProducao);
      console.log('Calculando a previsão... prazoProducaoFeriados: ', prazoProducaoFeriados);

      const prazoProducaoTotal = prazoProducao + prazoProducaoFinsSemana + prazoProducaoFeriados;
      console.log('Calculando a previsão... prazoProducaoTotal: ', prazoProducaoTotal);

      const prazoFreteFinsSemana = contarFinaisDeSemana(getBrazilTime(), prazoFrete);
      console.log('Calculando a previsão... prazoFreteFinsSemana: ', prazoFreteFinsSemana);

      const prazoFreteFeriados = await contarFeriados(safeDataFeriados, getBrazilTime(), prazoFrete);
      console.log('Calculando a previsão... prazoFreteFeriados: ', prazoFreteFeriados);

      const prazoFreteTotal = prazoFrete + prazoFreteFinsSemana + prazoFreteFeriados;
      console.log('Calculando a previsão... prazoFreteTotal: ', prazoProducaoTotal);

      const dataPrevistaEntrega = avancarDias(today, prazoFreteTotal + prazoProducaoTotal);
      // console.log('dataPrevistaEntrega', dataPrevistaEntrega);

      await new Promise(resolve => setTimeout(resolve, 300));

      setPrevisaoEntrega(dataPrevistaEntrega);

      await new Promise(resolve => setTimeout(resolve, 300));


      console.log(' ---------------- Calculando a previsão... finalizando... shippingOption: ', shippingOption);
    } else {
      console.log(' ---------------- Calculando a previsão... Erro crítico: algum(uns) campo(s) anterior(es) indefinido(s)');
    }

    setLoadingPrevisao(false);



    return;
  };

  const handleCEPBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    const cep = event.target.value;
    const isValidCEP = await validateCEP(cep);
    if (!isValidCEP) {
      setCepError(true);
    } else {
      setCepError(false);
      getFrete(cep);
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
      const quantidade = `${product.quantidade} un`;
      const nomeProduto = product.nome;
      const precoUnitario = `R$ ${product.preco.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`;
      const totalProduto = `R$ ${produtoTotal.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`;

      // Concatena as informações do produto
      produtosTexto += `${quantidade} ${nomeProduto} ${precoUnitario} (${totalProduto})\n`;
      totalOrçamento += produtoTotal;
    });

    if (precoFrete) {
      totalOrçamento += precoFrete;
    }

    let precoFreteTexto = '0.00';
    if (precoFrete) {
      precoFreteTexto = precoFrete.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    } else {
      console.log("Erro crítico precoFrete não existe ao compor o texto do orçamento.")
    }

    // console.log('Testando o estado previsaoEntrega: ', previsaoEntrega);

    const textoOrcamento = `
Lista de Produtos:

${produtosTexto.trim()}
${shippingOption === 'RETIRADA' ? 'Frete: R$ 0,00 (Retirada)' : `Frete: R$ ${precoFreteTexto} (Dia da postagem + ${prazoFrete} dias úteis via ${shippingOption} para o CEP ${cep})`}

Total: R$ ${totalOrçamento.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}

Prazo de Produção: ${prazoProducao} dias úteis
${!checkedOcultaPrevisao ?
        previsaoEntrega ?
          `Previsão de ${shippingOption === 'RETIRADA' ? 'Retirada' : 'Entrega'}: ${previsaoEntrega.setLocale('pt-BR').toFormat('dd \'de\' MMMM \'de\' yyyy')} (aprovando hoje).`
          : 'Não é possível prever a data de entrega.'
        : ''}

Prazo inicia-se após aprovação da arte e pagamento confirmado.

Orçamento válido por 7 dias.
`.trim();

    setOrçamentoTexto(textoOrcamento);
    setOpenBudget(true);
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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(dataBody),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar orçamento');
      }

      // console.log('Orçamento salvo com sucesso');
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  useEffect(() => {
    if (clientId && productsList && cep && address && shippingOption && prazoProducao && prazoFrete) {
      salvarOrcamento();
    }
  }, [orçamentoTexto]);

  const handleCloseSnackbarCopiarOrcamento = () => {
    setOpenSnackbarCopiarOrcamento(false);
  }

  useEffect(() => {
    if (id) {
      // console.log("O valor do parâmetro id ou valor padrão:", id);
      setClientId(Number(id));
    }
  }, [id]);



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

          <div onScroll={handleScrollClients} style={{ maxHeight: 300, overflowY: 'auto' }}>
            <Autocomplete
              fullWidth
              disablePortal
              id="cliente"
              loading={isFetchingClients || !isLoadedClients}
              disabled={isFetchingClients}
              options={allClients}
              getOptionLabel={(option) =>
                `${option.id} :: ${option.nome} :: (${option.telefone} ${option.email ? ` - ${option.email}` : ''})`
              }
              onChange={handleChangeClientesConsolidadosInput}
              onKeyDown={handleKeyPress}
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  placeholder="Selecione um cliente"
                  aria-label="Selecione um cliente"
                  value={searchQueryClients} // Controla o valor da pesquisa
                  onChange={(e: any) => setSearchQueryClients(e.target.value)}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isFetchingClients ? <CircularProgress size={24} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </div>

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

                <Stack spacing={2} direction="row" alignItems="center" mb={2}>
                  <Autocomplete
                    fullWidth
                    id="produto"
                    options={productNames}
                    getOptionLabel={(option) => option}
                    disabled={!isLoadedProducts || !clientId || isFetchingProducts}
                    loading={isFetchingProducts}
                    onChange={(event, selectedValue) => {
                      if (selectedValue) {
                        const selectedProduct = dataProducts.find((product: Product) => product.nome === selectedValue) as Product | undefined;
                        setSelectedProduct(selectedProduct ? selectedProduct : null); // Set selected product for adding
                      } else {
                        setSelectedProduct(null); // Reset selected product
                      }
                    }}
                    renderInput={(params) => (
                      <CustomTextField
                        {...params}
                        placeholder="Buscar produto..."
                        aria-label="Buscar produto"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {isFetchingProducts ? <CircularProgress size={24} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
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
                            const updatedProduct = { ...product, comprimento: newProductValue };
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

            <Snackbar
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              open={openSnackbarProdutosComAtributoZerado}
              onClose={handleCloseSnackbarProdutosComAtributoZerado}
              key={'top' + 'center'}
            >
              <Alert onClose={handleCloseSnackbarProdutosComAtributoZerado} severity="error" sx={{ width: '100%' }}>
                Cuidado: produto contém algum atributo zerado!
              </Alert>
            </Snackbar>

            <CustomFormLabel
              sx={{
                mt: 5,
              }}
              htmlFor="transportadora"
            >
              Transportadora
            </CustomFormLabel>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'left',
                mt: 2,
                pointerEvents: clientId ? (productsList.length > 0 ? 'auto' : 'none') : 'none',
                opacity: clientId ? (productsList.length > 0 ? 1 : 0.5) : 0.5,
              }}
            >
              <CustomTextField
                id="transportadora"
                label="CEP do cliente"
                value={cep}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCEP(event.target.value)}
                onBlur={handleCEPBlur}
                variant="outlined"
                size="small"
                sx={{ width: '200px' }}
                disabled={!clientId || productsList.length === 0 || produtosComAtributoZerado}
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'left',
                mt: 2,
                pointerEvents: cep ? 'auto' : 'none',
                opacity: cep ? 1 : 0.5,
              }}
            >
              <CustomTextField
                label="Endereço do Cliente"
                value={address}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAddress(event.target.value)}
                variant="outlined"
                size="small"
                fullWidth
                disabled={!cep}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'left', mt: 2, flexDirection: 'row' }}>
              {isFetchingFrete && <><CircularProgress size={20} sx={{ mr: 1 }} /><br /></>}

              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={shippingOption}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    console.log('event', event);
                    setShippingOption(event.target.value)
                  }}
                >

                  <FormControlLabel
                    value={"RETIRADA"}
                    control={<Radio disabled={!clientId || productsList.length === 0} />}
                    label={`Retirada - R$ 0,00. Previsão: ${prazoProducao} dias úteis.`}
                  />

                  <FormControlLabel
                    sx={{
                      display: !precoMiniEnvios && !prazoMiniEnvios ? 'none' : 'flex',
                      alignItems: 'center'
                    }}
                    value={"MINIENVIOS"}
                    control={<Radio disabled={!precoMiniEnvios} />}
                    label={precoMiniEnvios ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Image src="/images/correios.png" alt="Correios" width={30} height={30} />
                        <Typography sx={{ ml: 1 }}>
                          Mini Envios - R$ {precoMiniEnvios}{" "}
                          - Tempo de transporte:{" "}
                          {prazoMiniEnvios !== null ? prazoMiniEnvios : "não disponível"} dias úteis.{" "}
                          Previsão:{" "}
                          {(() => {
                            const maxPrazo = Math.max(...productsList.map(product => product.prazo ?? 0));
                            return prazoMiniEnvios !== null
                              ? (maxPrazo + prazoMiniEnvios) + " dias úteis úteis."
                              : "não disponível";
                          })()}
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Image src="/images/correios.png" alt="Correios" width={30} height={30} />
                        <Typography sx={{ ml: 1 }}>Mini Envios</Typography>
                      </Box>
                    )}
                  />

                  <FormControlLabel
                    sx={{
                      display: !precoPac && !prazoPac ? 'none' : 'flex',
                      alignItems: 'center'
                    }}
                    value={"PAC"}
                    control={<Radio disabled={!precoPac} />}
                    label={precoPac ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Image src="/images/correios.png" alt="Correios" width={30} height={30} />
                        <Typography sx={{ ml: 1 }}>
                          {"PAC - R$ " + precoPac +
                            " - Tempo de transporte: " +
                            (prazoPac !== null ? prazoPac : "não disponível") +
                            " dias úteis. Previsão: " +
                            (() => {
                              const maxPrazo = Math.max(...productsList.map(product => product.prazo ?? 0));
                              return prazoPac !== null
                                ? (maxPrazo + prazoPac) + " dias úteis."
                                : "não disponível";
                            })()}
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Image src="/images/correios.png" alt="Correios" width={30} height={30} />
                        <Typography sx={{ ml: 1 }}>PAC</Typography>
                      </Box>
                    )}
                  />

                  <FormControlLabel
                    sx={{
                      display: !precoSedex && !prazoSedex ? 'none' : 'flex',
                      alignItems: 'center'
                    }}
                    value={"SEDEX"}
                    control={<Radio disabled={!precoSedex} />}
                    label={precoSedex ? (
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <Image src="/images/correios.png" alt="Correios" width={30} height={30} />
                        <Typography sx={{ ml: 1, whiteSpace: 'nowrap' }}>
                          {"SEDEX - R$ " + precoSedex +
                            " - Tempo de transporte: " +
                            (prazoSedex !== null ? prazoSedex : "não disponível") +
                            " dias úteis. Previsão: " +
                            (() => {
                              const maxPrazo = Math.max(...productsList.map(product => product.prazo ?? 0));
                              return prazoSedex !== null
                                ? (maxPrazo + prazoSedex) + " dias úteis."
                                : "não disponível";
                            })()}
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                        <Image src="/images/correios.png" alt="Correios" width={30} height={30} />
                        <Typography sx={{ ml: 1, whiteSpace: 'nowrap' }}>SEDEX</Typography>
                      </Box>
                    )}
                  />


                  <FormControlLabel
                    style={{ display: 'none' }}
                    value={"SEDEX10"}
                    control={<Radio disabled={!precoSedex10} />}
                    label={precoSedex10 ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Image src="/images/correios.png" alt="Correios" width={30} height={30} />
                        <Typography sx={{ ml: 1 }}>
                          {"SEDEX 10 - R$ " + precoSedex10 +
                            " - Tempo de transporte: " +
                            (prazoSedex10 !== null ? prazoSedex10 : "não disponível") +
                            " dias úteis. Previsão: " +
                            (() => {
                              const maxPrazo = Math.max(...productsList.map(product => product.prazo ?? 0));
                              return prazoSedex10 !== null
                                ? (maxPrazo + prazoSedex10) + " dias úteis."
                                : "não disponível";
                            })()}
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Image src="/images/correios.png" alt="Correios" width={30} height={30} />
                        <Typography sx={{ ml: 1 }}>SEDEX 10</Typography>
                      </Box>
                    )}
                  />

                  <FormControlLabel
                    style={{ display: 'none' }}
                    value={"SEDEX12"}
                    control={<Radio disabled={!precoSedex12} />}
                    label={precoSedex12 ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Image src="/images/correios.png" alt="Correios" width={30} height={30} />
                        <Typography sx={{ ml: 1 }}>
                          {"SEDEX 12 - R$ " + precoSedex12 +
                            " - Tempo de transporte: " +
                            (prazoSedex12 !== null ? prazoSedex12 : "não disponível") +
                            " dias úteis. Previsão: " +
                            (() => {
                              const maxPrazo = Math.max(...productsList.map(product => product.prazo ?? 0));
                              return prazoSedex12 !== null
                                ? (maxPrazo + prazoSedex12) + " dias úteis."
                                : "não disponível";
                            })()}
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Image src="/images/correios.png" alt="Correios" width={30} height={30} />
                        <Typography sx={{ ml: 1 }}>SEDEX 12</Typography>
                      </Box>
                    )}
                  />

                </RadioGroup>
              </FormControl>
            </Box>

            <CustomFormLabel
              sx={{
                mt: 4,
              }}
              htmlFor="cliente"
            >
              Urgência de Entrega
            </CustomFormLabel>

            <FormControl>
              <RadioGroup
                aria-label="urgencia"
                name="urgencia"
                value={isAnticipation ? 'antecipacao' : 'prazoNormal'}
                onClick={() => {
                  setIsUrgentDeliverySelected(true);
                }}
              >
                <FormControlLabel
                  value="prazoNormal"
                  control={<Radio />}
                  label="Prazo Normal"
                  checked={isUrgentDeliverySelected && !isAnticipation}
                  disabled={!shippingOption}
                  onClick={() => {
                    setIsAnticipation(false);
                  }}
                />
                <FormControlLabel
                  value="antecipacao"
                  control={<Radio />}
                  label="Antecipação"
                  onClick={() => {
                    setIsAnticipation(true);
                    setOpenAnticipation(true);
                  }}
                  checked={isUrgentDeliverySelected && isAnticipation}
                  disabled={!shippingOption}
                />
              </RadioGroup>
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
                Data de entrega desejada: {dataDesejadaEntrega ? dataDesejadaEntrega.toLocaleString() : 'Nenhuma data selecionada'}
              </Typography>
            )}

            {isUrgentDeliverySelected && (
              <Typography variant="body2" color="text Secondary" sx={{ mt: 2 }}>
                Data de entrega prevista: {loadingPrevisao ? (
                  <CircularProgress size={20} />
                ) : (
                  previsaoEntrega ? previsaoEntrega.setLocale('pt-BR').toLocaleString({ day: 'numeric', month: 'long', year: 'numeric' }) : ''
                )}
              </Typography>
            )}

            <div style={{ marginTop: '20px' }}>
              <FormControl sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <CustomCheckbox
                      checked={checkedOcultaPrevisao}
                      onChange={(e) => setCheckedOcultaPrevisao(e.target.checked)}
                    />
                  }
                  label="Ocultar Previsão de Entrega"
                />
              </FormControl>
            </div>

            <div style={{ marginTop: '20px' }}>
              <Button
                color="primary"
                variant="contained"
                onClick={handleSubmit}
                disabled={!isUrgentDeliverySelected || !shippingOption || !clientId || productsList.length === 0 || loadingPrevisao}
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

              <IconButton onClick={() => { navigator.clipboard.writeText(orçamentoTexto); setOpenSnackbarCopiarOrcamento(true); }}>
                <IconCopy />
                <Typography variant="body2">Copiar Orçamento</Typography>
              </IconButton>

              <IconButton
                onClick={() => {

                  const htmlContent = `
                  <style>
                    body {
                      color: black !important; /* Garante que o texto seja preto */
                      font-family: Arial, sans-serif;
                      font-size: 12px;
                    }
                    p {
                      margin: 0;
                    }
                  </style>
                  <div>
                    <p><pre>${orçamentoTexto}</pre></p>
                  </div>
                `;

                  exportarPDF(htmlContent); // Passa o HTML com a cor ajustada
                }}
              >
                <IconFileTypePdf />
                <Typography variant="body2">Exportar PDF</Typography>
              </IconButton>

              <Button autoFocus onClick={handleCloseBudget} color="primary">
                Fechar
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={openSnackbarCopiarOrcamento}
            onClose={handleCloseSnackbarCopiarOrcamento}
            key={'top' + 'center'}
          >
            <Alert onClose={handleCloseSnackbarCopiarOrcamento} severity="success" sx={{ width: '100%' }}>
              Orçamento copiado com sucesso!
            </Alert>
          </Snackbar>

        </>
      </ParentCard>
    </PageContainer >
  );
};

export default OrcamentoGerarScreen;


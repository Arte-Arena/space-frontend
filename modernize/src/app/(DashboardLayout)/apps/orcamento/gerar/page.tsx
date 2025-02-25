'use client'
import React, { useState, useEffect, useMemo } from 'react';
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
import formatarPDF from '@/utils/formatarPDF';
import { useRouter, useSearchParams } from 'next/navigation';
import { IconCopy, IconPlus, IconMinus, IconDeviceFloppy, IconFileTypePdf } from '@tabler/icons-react';
import CustomCheckbox from '@/app/components/forms/theme-elements/CustomCheckbox';
import InputAdornment from '@mui/material/InputAdornment';
import ptBR from 'date-fns/locale/pt-BR';
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
  Typography
} from '@mui/material';
import { calcularDataFuturaDiasUteis, calcDiasNaoUteisEntreDatas } from '@/utils/calcDiasUteis';
import CustomRadio from '@/app/components/forms/theme-elements/CustomRadio';
import validateCEP from '@/utils/validateCEP';

interface Cliente {
  id: number;
  nome: string | null;
  telefone: string | null;
  email: string | null;
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

const UNIT_CONVERSION = {
  metersToCm: (m: number) => m * 100, // Converte metros para cm
  litersToCm3: (l: number) => l * 1000, // Converte litros para cm³ (apenas para referência)
  tonsToKg: (t: number) => t * 1000 // Converte toneladas para kg
};

const FOLDABLE_KEYWORDS = [
  'bandeira', 'uniforme', 'toalha',
  'faixa', 'flâmula', 'meião', 'abadá'
];

type VehicleDimensions = {
  maxLengthCm: number;
  maxWidthCm: number;
  maxHeightCm: number;
  maxWeightKg: number;
};

interface TransportOption {
  name: string;
  limits: VehicleDimensions;
}

const TRANSPORT_OPTIONS: TransportOption[] = [
  {
    name: "LalaGo",
    limits: {
      maxLengthCm: 35,
      maxWidthCm: 40,
      maxHeightCm: 30,
      maxWeightKg: 20
    }
  },
  {
    name: "CarroCompacto",
    limits: {
      maxLengthCm: 60,   // 200 litros ≈ 60x50x66cm
      maxWidthCm: 50,
      maxHeightCm: 66,
      maxWeightKg: 200
    }
  },
  {
    name: "Fiorino",
    limits: {
      maxLengthCm: 130,  // 2500 litros ≈ 130x100x192cm
      maxWidthCm: 100,
      maxHeightCm: 192,
      maxWeightKg: 500
    }
  },
  {
    name: "Carreto",
    limits: {
      maxLengthCm: 300,
      maxWidthCm: 180,
      maxHeightCm: 200,
      maxWeightKg: 1500 // 1.5 toneladas
    }
  }
];

const calculateFoldedDimensions = (
  product: Product,
  maxFolds: number = 5
): Product => {
  let folds = 0;
  let [l, w, h] = [
    product.comprimento,
    product.largura,
    product.altura
  ];

  while (folds < maxFolds &&
    (l > 40 || w > 40 || h > 60)) { // Limites da menor caixa
    // Dobra estratégica: menor dimensão é reduzida
    if (l >= w && l >= h) {
      l /= 2;
      h *= 1.5;
    } else if (w >= l && w >= h) {
      w /= 2;
      h *= 1.5;
    } else {
      h /= 2;
      l *= 1.5;
    }
    folds++;
  }

  return {
    ...product,
    comprimento: Math.ceil(l),
    largura: Math.ceil(w),
    altura: Math.ceil(h)
  };
};

const validateDimensions = (
  product: Product,
  vehicle: VehicleDimensions
): boolean => {
  return (
    product.comprimento <= vehicle.maxLengthCm &&
    product.largura <= vehicle.maxWidthCm &&
    product.altura <= vehicle.maxHeightCm &&
    product.peso <= vehicle.maxWeightKg
  );
};

const selectOptimalVehicle = (products: Product[]): string => {
  const processedProducts = products.map(p =>
    FOLDABLE_KEYWORDS.some(kw => p.nome.toLowerCase().includes(kw))
      ? calculateFoldedDimensions(p)
      : {
        ...p,
        comprimento: p.comprimento,
        largura: p.largura,
        altura: p.altura
      }
  );

  // Ordenar veículos do menor para o maior
  const sortedVehicles = [...TRANSPORT_OPTIONS].sort((a, b) =>
    a.limits.maxLengthCm - b.limits.maxLengthCm
  );

  for (const vehicle of sortedVehicles) {
    const allFit = processedProducts.every(p =>
      validateDimensions(p, vehicle.limits)
    );

    if (allFit) {
      return vehicle.name;
    }
  }

  return "Carreto"; // Fallback para maior veículo
};

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
  const [productNames, setProductNames] = useState<string[] | null>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [produtosComAtributoZerado, setProdutosComAtributoZerado] = useState(false);
  const [openSnackbarProdutosComAtributoZerado, setOpenSnackbarProdutosComAtributoZerado] = useState(false);
  const [checkedBrinde, setCheckedBrinde] = useState(false);
  const [productsBrindeList, setProductsBrindeList] = useState<Product[]>([]);
  const [selectedProductBrinde, setSelectedProductBrinde] = useState<Product | null>(null);
  const [openBudget, setOpenBudget] = React.useState(false);
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
  const [orçamentoTexto, setOrçamentoTexto] = useState('');
  const [cep, setCEP] = useState('');
  const [cepError, setCepError] = useState(false);
  const [openSnackbarCepInvalido, setOpenSnackbarCepInvalido] = useState(false);
  const [isFetchingFrete, setIsFetchingFrete] = useState(false);
  const [cepSuccess, setCepSuccess] = useState(false);
  const [address, setAddress] = useState('');
  const [isGrandeSP, setIsGrandeSP] = useState<boolean | null>(null);
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
  const [precoLalamove, setPrecoLalamove] = useState<number | null>(null);
  const [prazoLalamove, setPrazoLalamove] = useState<number | null>(null);
  const [shippingOption, setShippingOption] = useState('');
  const [isUrgentDeliverySelected, setIsUrgentDeliverySelected] = useState(false);
  const [isAnticipation, setIsAnticipation] = useState(false);
  const [openAnticipation, setOpenAnticipation] = useState(false);
  const [dataDesejadaEntregaInput, setDataDesejadaEntregaInput] = useState<DateTime | null>(null);
  const [dataDesejadaEntrega, setDataDesejadaEntrega] = useState<DateTime | null>(null);
  const [diffHojeDataDesejadaEntrega, setDiffHojeDataDesejadaEntrega] = useState<number | null>(null);
  const [precoFrete, setPrecoFrete] = useState<number | null>(null);
  const [prazoFrete, setPrazoFrete] = useState<number | null>(null);
  const [prazoProducao, setPrazoProducao] = useState<number | null>(null);
  const [loadingPrevisao, setLoadingPrevisao] = useState(false);
  const [previsaoEntrega, setPrevisaoEntrega] = useState<DateTime | null>(null)
  const [checkedOcultaPrevisao, setCheckedOcultaPrevisao] = useState<boolean>(false);
  const descriptionElementRef = React.useRef<HTMLElement>(null);
  const [openSnackbarCopiarOrcamento, setOpenSnackbarCopiarOrcamento] = useState(false);
  const [taxaAntecipaInput, setTaxaAntecipaInput] = useState<number | null>(null);
  const [taxaAntecipa, setTaxaAntecipa] = useState<number | null>(null);
  const [prazoProducaoAntecipado, setPrazoProducaoAntecipado] = useState<number | null>(null);
  const [totalWithAntecipa, setTotalWithAntecipa] = useState<number | null>(null);
  const [totalProductsValue, setTotalProductsValue] = useState<number | null>(null);
  const [checkedDesconto, setCheckedDesconto] = useState<boolean>(false);
  const [openDesconto, setOpenDesconto] = useState(false);
  const [tipoDesconto, setTipoDesconto] = useState<string | null>(null);
  const [percentualDesconto, setPercentualDesconto] = useState<number | null>(null);
  const [valorDesconto, setValorDesconto] = useState<number | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const accessToken = localStorage.getItem('accessToken');

  const dataClients = localStorage.getItem('clientesConsolidadosOrcamento');

  useEffect(() => {
    if (dataClients) {
      const dataClientsObject = JSON.parse(dataClients) as {
        status: string;
        data: { data: Cliente[]; total: number };
        pagination: { current_page: number; total_pages: number; total_items: number };
      };
      // console.log('dataClientsObject: ', dataClientsObject);
      setAllClients(dataClientsObject.data.data);

    } else {
      console.warn('Os dados de clientes não foram encontrados.');
    }
  }, [dataClients]);

  // const memoizedAllClients = useMemo(() => allClients, [allClients]);

  useEffect(() => {
    // console.log('allClients: ', allClients);
    if (allClients.length > 0) {
      setIsLoadedClients(true);
    }
  }, [allClients]);

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

  // useEffect(() => {
  //   if (id) {
  //     // console.log("O valor do parâmetro id ou valor padrão:", id);
  //     setClientId(Number(id));
  //   }
  // }, [id]);

  const handleChangeClientesConsolidadosInput = (
    event: React.ChangeEvent<{}>,
    value: Cliente | null
  ) => {
    setClientId(value ? value.id : '');
    setClientInputValue(value ? value.nome : '');
  };

  const handleSearchClientes = () => {
    setIsLoadedClients(false);
    fetch(`${process.env.NEXT_PUBLIC_API}/api/search-clientes-consolidados?search=${searchQueryClients}&page=${currentPageClients}`, {
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

  const dataProducts = localStorage.getItem('produtosConsolidadosOrcamento');

  useEffect(() => {
    if (dataProducts) {
      const dataProductsArray = JSON.parse(dataProducts);
      // console.log('productData:', dataProductsArray);
      if (Array.isArray(dataProductsArray)) {
        const transformedProducts = dataProductsArray.map((item: Product) => ({
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
        console.error('Dados inválidos recebidos da API:', dataProductsArray);
      }
    } else {
      console.warn('Os dados de produtos não foram encontrados.');
    }
  }, [dataProducts]);

  useEffect(() => {
    if (allProducts.length > 0) {
      setIsLoadedProducts(true);
    }
  }, [allProducts]);

  useEffect(() => {
    if (allProducts) {
      // console.log('allProducts:', allProducts);
      setProductNames(allProducts.map((product) => product.nome));
      // console.log('productNames: ', productNames);
    }
  }, [allProducts]);

  useEffect(() => {
    if (selectedProduct) {
      adicionarProduto(selectedProduct);
      // console.log('selectedProduct:', selectedProduct);
    }
  }, [selectedProduct]);

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

    if (productsList) {
      const maxPrazo = productsList.length > 0
        ? Math.max(...productsList.map(product => product.prazo ?? 0))
        : 0;
      const previousPrazoProducao = prazoProducao;
      if (previousPrazoProducao !== maxPrazo) {
        setPrazoProducao(maxPrazo);
      }

      if (cep) {
        getFrete(cep);
      }

      var totalOrçamento = 0;

      productsList.forEach((product) => {
        const produtoTotal = product.preco * product.quantidade;
        totalOrçamento += produtoTotal;
      });

      setTotalProductsValue(totalOrçamento);

    }

    const checkZeroAttribute = (isAnticipation: boolean) => {
      return productsList.some((product) =>
        Object.entries(product).some(([key, value]) =>
          (key !== 'prazo' || !isAnticipation) && value === 0
        )
      );
    };

    const hasZeroAttribute = checkZeroAttribute(isAnticipation);
    setProdutosComAtributoZerado(hasZeroAttribute);

    if (hasZeroAttribute) {
      setOpenSnackbarProdutosComAtributoZerado(true);
    }

  }, [productsList]);

  // Tratamento da lista de produtos para brinde

  useEffect(() => {
    if (selectedProductBrinde) {
      adicionarProdutoBrinde(selectedProductBrinde);
      // console.log('selectedProductBrinde:', selectedProductBrinde);
    }
  }, [selectedProductBrinde]);

  function adicionarProdutoBrinde(novoProduto: Product) {
    // Se já está na productsList, não adiciona novamente, soma 1 na sua quantidade.
    const existingProduct = productsBrindeList.find((product) => product.id === novoProduto.id);

    if (existingProduct) {
      const updatedProduct = {
        ...existingProduct,
        quantidade: isNaN(existingProduct.quantidade) ? 1 : existingProduct.quantidade + 1,
      };
      const updatedProductsList = productsBrindeList.map((product) =>
        product.id === existingProduct.id ? updatedProduct : product
      );
      setProductsBrindeList(updatedProductsList);
    } else {
      setProductsBrindeList([
        {
          ...novoProduto,
          quantidade: 1,
          preco: 0,
          prazo: 0,
        },
      ]);
    }
  }

  const removerProdutoUnidadeBrinde = (productToRemove: Product) => {
    const updatedProductsList = productsBrindeList.map((product) => {
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
    setProductsBrindeList(updatedProductsList.filter((product): product is Product => product !== null));
  };

  const removerProdutoBrinde = (productToRemove: Product) => {
    const updatedProductsList = productsBrindeList.filter((product) => product.id !== productToRemove.id);
    setProductsBrindeList(updatedProductsList);
  };

  const atualizarProdutoBrinde = (updatedProduct: Product) => {
    const updatedProductsList = productsBrindeList.map((product) =>
      product.id === updatedProduct.id ? updatedProduct : product
    );
    setProductsBrindeList(updatedProductsList);
  };

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

  function resetFrete() {
    setPrazoFrete(null);
    setPrecoFrete(null);
    setPrecoLalamove(null);
    setPrazoLalamove(null);
    setPrecoPac(null);
    setPrazoPac(null);
    setPrecoSedex(null);
    setPrazoSedex(null);
  }

  async function processCEP(cep: string) {
    const validationResult = await validateCEP(cep);

    if (validationResult) {
      const { address, location, cidade, uf } = validationResult;
      setAddress(address);
      setLocation(location);

      const cidadesGrandeSP = [
        "São Paulo", "Guarulhos", "Osasco", "São Bernardo do Campo", "Santo André", "Mauá", "Barueri",
        "Diadema", "Taboão da Serra", "Carapicuíba", "Itaquaquecetuba", "Cotia", "Suzano",
        "São Caetano do Sul", "Embu das Artes", "Mogi das Cruzes", "Ribeirão Pires", "Franco da Rocha"
      ];

      if (uf === "SP") {
        if (cidadesGrandeSP.includes(cidade)) {
          setIsGrandeSP(true);
        }
      } else {
        const numericCep = parseInt(cep.replace(/\D/g, ""), 10);
        if ((numericCep >= 1000000 && numericCep <= 5999999) || (numericCep >= 6000000 && numericCep <= 9999999)) {
          setIsGrandeSP(true);
        }
        setIsGrandeSP(false);
      }

      return true;
    } else {
      // console.log("CEP inválido ou erro na validação.");
      resetFrete();

      setOpenSnackbarCepInvalido(true);
      return false;
    }
  }

  const handleCloseSnackbarCepInvalido = () => {
    setOpenSnackbarCepInvalido(false);
  }

  useEffect(() => {
    if (location) {
      console.log('location: ', location);
      getFrete(cep);
    }
  }, [location]);

  useEffect(() => {
    if (isGrandeSP) {
      console.log('isGrandeSP', isGrandeSP);
    }
  }, [isGrandeSP]);

  const prazoEntregaMenordataDesejadaAntecipa = (
    delivery_time: number,
    dataDesejadaEntrega: DateTime | null,
    feriados: ApiResponseFeriados // Adicione o array de feriados como parâmetro
  ): boolean => {

    const tomorrow = DateTime.fromJSDate(getBrazilTime()).plus({ days: 1 });

    if (dataDesejadaEntrega) {
      const dataEntregaCalculada = calcularDataFuturaDiasUteis(tomorrow, delivery_time, feriados);

      return dataEntregaCalculada < dataDesejadaEntrega; // Comparação direta de DateTime
    } else {
      console.error('Erro: dataDesejadaEntrega é nulo ou indefinido.');
      return false;
    }
  };

  const getFrete = async (cepTo: string) => {
    if (clientId && productsList) {
      setIsFetchingFrete(true);
      
      // Inicializa o array de dados de frete
      let data: FreteData[] = [];
      
      // Requisição para Melhor Envio
      const body = {
        cepTo,
        largura: productsList.reduce((max, product) => Math.max(max, product.largura), 0),
        altura: productsList.reduce((max, product) => Math.max(max, product.altura), 0),
        comprimento: productsList.reduce((max, product) => Math.max(max, product.comprimento), 0),
        peso: productsList.reduce((total, product) => total + product.peso * product.quantidade, 0),
        valor: productsList.reduce((total, product) => total + product.preco * product.quantidade, 0),
        qtd: productsList.length
      };
  
      // Obter dados do Melhor Envio
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/frete-melhorenvio`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
  
        if (!response.ok) {
          console.error('Resposta não-OK do Melhor Envio');
        } else {
          const melhorEnvioData = await response.json();
          data = melhorEnvioData;
        }
      } catch (melhorEnvioError) {
        console.error('Erro ao buscar dados do Melhor Envio:', melhorEnvioError);
        // Continua o processamento mesmo se o Melhor Envio falhar
      }
  
      // Tentar obter dados do Lalamove separadamente
      if (isGrandeSP && location) {
        try {
          const selectedVehicle = selectOptimalVehicle(productsList);
  
          const bodyLalamove = {
            latitude: location.latitude.toString(),
            longitude: location.longitude.toString(),
            endereco: address,
            veiculo: selectedVehicle,
            dimensoes: {
              comprimento: Math.max(...productsList.map(p =>
                UNIT_CONVERSION.metersToCm(p.comprimento)
              )),
              largura: Math.max(...productsList.map(p =>
                UNIT_CONVERSION.metersToCm(p.largura)
              )),
              altura: Math.max(...productsList.map(p =>
                UNIT_CONVERSION.metersToCm(p.altura)
              ))
            },
            peso_total: productsList.reduce((sum, p) => sum + p.peso * p.quantidade, 0)
          };
  
          const response2 = await fetch(`${process.env.NEXT_PUBLIC_API}/api/frete-lalamove`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(bodyLalamove)
          });
  
          if (!response2.ok) {
            console.error('Resposta não-OK do Lalamove');
          } else {
            const responseLalamove = await response2.json();
  
            const lalamoveData: FreteData[] = [{
              name: 'Lalamove',
              price: responseLalamove.data.priceBreakdown.totalBeforeOptimization,
              delivery_time: 1,
            }];
  
            data.push(...lalamoveData);
          }
        } catch (lalamoveError) {
          console.error('Erro ao buscar dados do Lalamove:', lalamoveError);
          // Continua o processamento sem os dados do Lalamove
        }
      }
  
      // Processa os dados independentemente de quais APIs tiveram sucesso ou falharam
      const fretesByName: { [key: string]: FreteData } = {};
  
      data.forEach(frete => {
        fretesByName[frete.name.toLowerCase().replace(/\s/g, '')] = frete;
      });
  
      const safeDataFeriados = dataFeriados ?? { dias_feriados: [] };
  
      // Processa o Lalamove se disponível
      if (fretesByName.lalamove) {
        if (!isAnticipation) {
          setPrecoLalamove(Number(fretesByName.lalamove.price));
          setPrazoLalamove(fretesByName.lalamove.delivery_time);
        } else {
          if (prazoEntregaMenordataDesejadaAntecipa(
            fretesByName.lalamove.delivery_time,
            dataDesejadaEntrega,
            safeDataFeriados
          )) {
            setPrecoLalamove(Number(fretesByName.lalamove.price));
            setPrazoLalamove(fretesByName.lalamove.delivery_time);
          } else {
            setPrecoLalamove(null);
            setPrazoLalamove(null);
          }
        }
      } else {
        setPrecoLalamove(null);
        setPrazoLalamove(null);
      }
  
      // Sempre processa as opções do Melhor Envio independentemente do sucesso/falha do Lalamove
      if (fretesByName.pac) {
        if (!isAnticipation) {
          setPrecoPac(Number(fretesByName.pac.price));
          setPrazoPac(fretesByName.pac.delivery_time);
        } else {
          if (prazoEntregaMenordataDesejadaAntecipa(fretesByName.pac.delivery_time, dataDesejadaEntrega, safeDataFeriados)) {
            setPrecoPac(Number(fretesByName.pac.price));
            setPrazoPac(fretesByName.pac.delivery_time);
          } else {
            setPrecoPac(null);
            setPrazoPac(null);
          }
        }
      } else {
        setPrecoPac(null);
        setPrazoPac(null);
      }
  
      if (fretesByName.sedex) {
        if (!isAnticipation) {
          setPrecoSedex(Number(fretesByName.sedex.price));
          setPrazoSedex(fretesByName.sedex.delivery_time);
        } else {
          if (prazoEntregaMenordataDesejadaAntecipa(fretesByName.sedex.delivery_time, dataDesejadaEntrega, safeDataFeriados)) {
            setPrecoSedex(Number(fretesByName.sedex.price));
            setPrazoSedex(fretesByName.sedex.delivery_time);
          } else {
            setPrecoSedex(null);
            setPrazoSedex(null);
          }
        }
      } else {
        setPrecoSedex(null);
        setPrazoSedex(null);
      }
  
      if (fretesByName.sedex10) {
        setPrecoSedex10(Number(fretesByName.sedex10.price));
        setPrazoSedex10(fretesByName.sedex10.delivery_time);
      } else {
        setPrecoSedex10(null);
        setPrazoSedex10(null);
      }
  
      if (fretesByName.sedex12) {
        setPrecoSedex12(Number(fretesByName.sedex12.price));
        setPrazoSedex12(fretesByName.sedex12.delivery_time);
      } else {
        setPrecoSedex12(null);
        setPrazoSedex12(null);
      }
  
      if (fretesByName.minienvios) {
        setPrecoMiniEnvios(Number(fretesByName.minienvios.price));
        setPrazoMiniEnvios(fretesByName.minienvios.delivery_time);
      } else {
        setPrecoMiniEnvios(null);
        setPrazoMiniEnvios(null);
      }
  
      setCepSuccess(true);
      
      // Finalização comum
      setIsFetchingFrete(false);
      if (clientId && productsList && shippingOption && cep && address && prazoProducao && prazoFrete) {
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
          if (prazoMiniEnvios !== null) {
            setPrazoFrete(prazoMiniEnvios + 1);
          } else {
            console.error('prazoMiniEnvios is null');
          }
          setPrecoFrete(precoMiniEnvios);
          break;
        case 'PAC':
          if (prazoPac !== null) {
            setPrazoFrete(prazoPac + 1);
          } else {
            console.error('prazoPac is null');
          }
          setPrecoFrete(precoPac);
          break;
        case 'SEDEX':
          if (prazoSedex !== null) {
            setPrazoFrete(prazoSedex + 1);
          } else {
            console.error('prazoSedex is null');
          }
          setPrecoFrete(precoSedex);
          break;
        case 'SEDEX10':
          if (prazoSedex10 !== null) {
            setPrazoFrete(prazoSedex10 + 1);
          } else {
            console.error('prazoSedex10 is null');
          }
          setPrecoFrete(precoSedex10);
          break;
        case 'SEDEX12':
          if (prazoSedex12 !== null) {
            setPrazoFrete(prazoSedex12 + 1);
          } else {
            console.error('prazoSedex12 is null');
          }
          setPrecoFrete(precoSedex12);
          break;
        default:
          console.error('Invalid shipping option:', shippingOption);
          setPrazoFrete(0);
          setPrecoFrete(0);
      }
    }

    if (clientId && productsList && isUrgentDeliverySelected && shippingOption === 'RETIRADA') {
      console.log('0010');
      calcPrevisao();
    }

  }, [shippingOption]);

  useEffect(() => {
    if (clientId && productsList && shippingOption && cep && address && prazoProducao && prazoFrete) {
      if (isUrgentDeliverySelected) {
        console.log('0011');
        calcPrevisao();
      }
    }
    else if (clientId && productsList && prazoProducao && prazoFrete && shippingOption === 'RETIRADA' && isUrgentDeliverySelected) {
      console.log('0012');
      calcPrevisao();
    }
  }, [isUrgentDeliverySelected]);

  useEffect(() => {
    if (clientId && productsList && shippingOption && cep && address && prazoProducao && prazoFrete) {
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

  useEffect(() => {
    if (clientId && productsList && shippingOption && cep && address && prazoProducao && (prazoFrete === 0 || prazoFrete)) {
      console.log('00009');
      calcPrevisao();
    }
  }, [prazoProducao]);

  useEffect(() => {
    setShippingOption('');
    getFrete(cep);
  }, [isAnticipation]);

  async function calcPrazoAntecipa() {
    if (isAnticipation && dataDesejadaEntrega) {
      console.log('0020');
      const hojeDate = getBrazilTime();
      const hojeLuxon = DateTime.fromJSDate(hojeDate).startOf('day');
      const dataDesejadaEntregaStart = dataDesejadaEntrega.startOf('day');
      const safeDataFeriados = dataFeriados ?? { dias_feriados: [] };
      const qtdDiasNaoUteis = calcDiasNaoUteisEntreDatas(hojeLuxon, dataDesejadaEntrega, safeDataFeriados);

      if (prazoFrete) {
        console.log('0021');
        const diffDias = dataDesejadaEntregaStart.diff(hojeLuxon, 'days').days;
        setDiffHojeDataDesejadaEntrega(diffDias);
        const prazoProducaoAntecipado = diffDias - prazoFrete;
        setPrazoProducaoAntecipado(prazoProducaoAntecipado - qtdDiasNaoUteis);
      } else {
        console.log('0023');
        setPrazoProducaoAntecipado(dataDesejadaEntregaStart.diff(hojeLuxon, 'days').days + -qtdDiasNaoUteis);
      }
    }
  }

  useEffect(() => {
    if (cep) {
      getFrete(cep);
    }
    if (dataDesejadaEntrega) {
      calcPrazoAntecipa();
      setPrevisaoEntrega(dataDesejadaEntrega);
    }
  }, [dataDesejadaEntrega]);

  useEffect(() => {
    console.log(diffHojeDataDesejadaEntrega);
  }, [diffHojeDataDesejadaEntrega]);


  // useEffect(() => {
  //   console.log("prazoProducaoAntecipado: ", prazoProducaoAntecipado);
  // }, [prazoProducaoAntecipado]);

  const calcPrevisao = async () => {

    if (isAnticipation && dataDesejadaEntrega) {
      setPrevisaoEntrega(dataDesejadaEntrega);
    } else {
      setLoadingPrevisao(true);
      setPrevisaoEntrega(null);

      await new Promise(resolve => setTimeout(resolve, 300));

      // console.log(' ---------------- Calculando a previsão... Iniciando calculo de previsão de entrega');

      // console.log('prazoFrete: ', prazoFrete);

      if (
        clientId &&
        productsList &&
        shippingOption &&
        prazoProducao &&
        prazoFrete &&
        (shippingOption !== 'REITRADA' || (!cep && !address) && !isAnticipation && isUrgentDeliverySelected)
      ) {

        await new Promise(resolve => setTimeout(resolve, 300));
        const safeDataFeriados = dataFeriados ?? { dias_feriados: [] };
        console.log(safeDataFeriados);

        console.log('Calculando a previsão... inciando... shippingOption: ', shippingOption);

        console.log('Calculando a previsão... prazoProducao: ', prazoProducao);
        console.log('Calculando a previsão... prazoFrete: ', prazoFrete);

        await new Promise(resolve => setTimeout(resolve, 300));

        const dataPrevistaEntrega = calcularDataFuturaDiasUteis(DateTime.fromJSDate(getBrazilTime()), prazoProducao + prazoFrete, safeDataFeriados);
        // console.log('dataPrevistaEntrega', dataPrevistaEntrega);

        await new Promise(resolve => setTimeout(resolve, 300));

        setPrevisaoEntrega(dataPrevistaEntrega);
        console.log('dataPrevistaEntrega', dataPrevistaEntrega.toLocaleString(DateTime.DATE_FULL));

        await new Promise(resolve => setTimeout(resolve, 300));

        // console.log(' ---------------- Calculando a previsão... finalizando... shippingOption: ', shippingOption);
      } else {
        console.log(' ---------------- Calculando a previsão... Erro crítico: algum(uns) campo(s) anterior(es) indefinido(s)');
      }

      setLoadingPrevisao(false);
    }

    await calcPrazoAntecipa();

    return;
  };

  const handleCEPBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    const cep = event.target.value;
    const isValidCEP = await processCEP(cep);
    if (!isValidCEP) {
      setCepError(true);
    } else {
      setCepError(false);
    }
  };

  const handleCEPKeyPressEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const simulatedFocusEvent = {
        target: {
          value: cep
        }
      } as React.FocusEvent<HTMLInputElement>;

      handleCEPBlur(simulatedFocusEvent);
    }
  };

  useEffect(() => {
    if (cepError) {
      console.log('cepError:', cepError);
      resetFrete();
      setOpenSnackbarCepInvalido(true);
    }
  }, [cepError]);

  const handleSubmit = async () => {
    const isValidCEP = await processCEP(cep);
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
    let produtosBrindeTexto = '';

    var prazoProducaoTextoOrcamento: string = "";

    if (prazoProducaoAntecipado) {
      if (prazoProducaoAntecipado < 1) {
        throw new Error("Erro crítico: prazoProducaoAntecipado deve ser maior que zero.");
      }
    }

    if (prazoProducao) {
      if (prazoProducao < 1) {
        throw new Error("Erro crítico: prazoProducao deve ser maior que zero.");
      }
    }

    if (isAnticipation && dataDesejadaEntrega) {
      if (prazoProducaoAntecipado === 1) {
        prazoProducaoTextoOrcamento = '1 dia útil';
      } else {
        prazoProducaoTextoOrcamento = `${prazoProducaoAntecipado} dias úteis (antecipado)`;
      }
    } else {
      if (prazoProducao === 1) {
        prazoProducaoTextoOrcamento = '1 dia útil';
      } else {
        prazoProducaoTextoOrcamento = `${prazoProducao} dias úteis`;
      }
    }

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

    var valorDescontado = 0;
    if (checkedDesconto) {
      if (checkedDesconto) {
        if (tipoDesconto === 'valor') {
          valorDescontado = parseFloat(valorDesconto?.toFixed(2) ?? '0');
        } else if (tipoDesconto === 'percentual') {
          valorDescontado = parseFloat(
            ((totalProductsValue ?? 0) * ((percentualDesconto ?? 0) / 100)).toFixed(2)
          );
        } else {
          throw new Error('Erro crítico tipoDesconto não existe ao compor o texto do orçamento.');
        }
        totalOrçamento = totalOrçamento - valorDescontado;
      }
    }

    if (isAnticipation && taxaAntecipa != null) {
      totalOrçamento += taxaAntecipa;
    }

    productsBrindeList.forEach((product) => {

      const produtoTotal = product.preco * product.quantidade;

      // Formatação da linha do produto para garantir alinhamento
      const quantidade = `${product.quantidade} un`;
      const nomeProduto = product.nome;
      const precoUnitario = `R$ ${product.preco.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`;
      const totalProduto = `R$ ${produtoTotal.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`;

      // Concatena as informações do produto
      produtosBrindeTexto += `${quantidade} ${nomeProduto} ${precoUnitario} (${totalProduto})\n`;
    });


    let precoFreteTexto = '0.00';
    if (precoFrete) {
      precoFreteTexto = precoFrete.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    } else {
      if (shippingOption !== 'RETIRADA') {
        if (!precoFrete) {
          throw new Error('Erro crítico precoFrete não existe ao compor o texto do orçamento.');
        }
      }
    }

    // console.log('Testando o estado previsaoEntrega: ', previsaoEntrega);

    console.log('0019');
    console.log(prazoProducaoAntecipado);

    const textoOrcamento = `
Lista de Produtos:

${produtosTexto.trim()}

${checkedBrinde ? `Brinde: ${produtosBrindeTexto.trim()}` : ''}
${shippingOption === 'RETIRADA' ? 'Frete: R$ 0,00 (Retirada)' : `Frete: R$ ${precoFreteTexto} (Dia da postagem + ${prazoFrete} dias úteis via ${shippingOption} para o CEP ${cep})`}
${isAnticipation && taxaAntecipa ? `Taxa de Antecipação: R$ ${taxaAntecipa.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}` : ''}
${checkedDesconto ? `Desconto: R$ ${valorDescontado.toFixed(2)}` : ''}

Total: R$ ${totalOrçamento.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}

Prazo de Produção: ${prazoProducaoTextoOrcamento}
${!checkedOcultaPrevisao ?
        previsaoEntrega ?
          `Previsão de ${shippingOption === 'RETIRADA' ? 'Retirada' : 'Entrega'}: ${previsaoEntrega.setLocale('pt-BR').toFormat('dd \'de\' MMMM \'de\' yyyy')} (aprovando hoje).`
          : 'Não é possível prever a data de entrega.'
        : ''}

Prazo inicia-se após aprovação da arte e pagamento confirmado.

Orçamento válido somente hoje.
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
      antecipado: isAnticipation,
      data_antecipa: dataDesejadaEntrega,
      taxa_antecipa: taxaAntecipa,
      descontado: checkedDesconto || false,
      tipo_desconto: tipoDesconto || null,
      valor_desconto: checkedDesconto && tipoDesconto
        ? tipoDesconto === 'valor'
          ? valorDesconto ?? 0 // If valorDesconto is null, use 0
          : tipoDesconto === 'percentual'
            ? (totalProductsValue ?? 0) * ((percentualDesconto ?? 0) / 100) // If either is null, use 0
            : null
        : null,
      percentual_desconto: percentualDesconto ? parseFloat(percentualDesconto.toFixed(2)) : null,
      total_orcamento: isAnticipation && !checkedDesconto
        ? (totalProductsValue ?? 0) + (taxaAntecipa ?? 0)
        : !isAnticipation && checkedDesconto
          ? (totalProductsValue ?? 0) - (valorDesconto ?? 0)
          : (totalProductsValue ?? 0) + (shippingOption !== 'RETIRADA' ? precoFrete ?? 0 : 0),
      brinde: checkedBrinde,
      produtos_brinde: JSON.stringify(productsBrindeList),
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

  // Definindo a data mínima para amanhã
  const tomorrow = DateTime.now().plus({ days: 1 });

  const handleAntecipa = () => {
    setIsAnticipation(true);
    setDataDesejadaEntrega(dataDesejadaEntregaInput);
    setTaxaAntecipa(taxaAntecipaInput);
    setOpenAnticipation(false)
  }

  useEffect(() => {
    setOpenDesconto(checkedDesconto);
  }, [checkedDesconto]);

  const handleDesconto = () => {

    setOpenDesconto(false)
  }

  useEffect(() => {
    // console.log('tipoDesconto:', tipoDesconto);
  }, [tipoDesconto]);


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
              // loading={!isLoadedClients}
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

                {/* <Stack spacing={2} direction="row" alignItems="center" mb={2}> */}


                <Autocomplete
                  freeSolo
                  id="produto"
                  options={productNames?.length ? productNames : []}
                  // getOptionLabel={(option) => option}
                  onChange={(event, selectedValue) => {
                    if (selectedValue) {
                      if (dataProducts) {
                        const dataProductsArray = JSON.parse(dataProducts);
                        const selectedProduct = dataProductsArray.find((product: Product) => product.nome === selectedValue) as Product | undefined;
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


                {/* </Stack> */}
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
                          value={isAnticipation ? 1 : product.prazo}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            if (!isAnticipation) {
                              const newProductValue = Math.max(0, +event.target.value);
                              const updatedProduct = { ...product, prazo: newProductValue };
                              atualizarProduto(updatedProduct);
                            }
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
                          disabled={isAnticipation}
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
              key={'top' + 'center' + 'produto' + 'zero'}
            >
              <Alert onClose={handleCloseSnackbarProdutosComAtributoZerado} severity="error" sx={{ width: '100%' }}>
                Cuidado: produto contém algum atributo zerado!
              </Alert>
            </Snackbar>
          </div>

          <div>
            <FormControl sx={{ mt: 2 }} disabled={isAnticipation || !(clientId && productsList.length > 0)}>
              <FormControlLabel
                control={
                  <CustomCheckbox
                    checked={checkedBrinde}
                    onChange={(e) => !isAnticipation && setCheckedBrinde(e.target.checked)}
                  />
                }
                label="Brinde"
              />
            </FormControl>
          </div>

          {checkedBrinde && (
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="produto-brinde"
                  >
                    Produto (Brinde)
                  </CustomFormLabel>

                  <Autocomplete
                    freeSolo
                    id="produto-brinde"
                    options={productNames?.length ? productNames : []}
                    // getOptionLabel={(option) => option}
                    onChange={(event, selectedValue) => {
                      if (selectedValue) {
                        if (dataProducts) {
                          const dataProductsArray = JSON.parse(dataProducts);
                          const selectedProductBrinde = dataProductsArray.find((product: Product) => product.nome === selectedValue) as Product | undefined;
                          setSelectedProductBrinde(selectedProductBrinde ? selectedProductBrinde : null); // Set selected product for adding
                        } else {
                          setSelectedProductBrinde(null); // Reset selected product
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
                    {productsBrindeList.map((product: Product, index) => (
                      <TableRow key={index}>

                        <TableCell>
                          <CustomTextField
                            value={product.nome}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              const updatedProductBrinde = { ...product, nome: event.target.value };
                              atualizarProdutoBrinde(updatedProductBrinde);
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
                            disabled={true}
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
                              const updatedProductBrinde = { ...product, quantidade: newProductValue };
                              atualizarProdutoBrinde(updatedProductBrinde);
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
                              const updatedProductBrinde = { ...product, prazo: newProductValue };
                              atualizarProdutoBrinde(updatedProductBrinde);
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
                            disabled={true}
                          />
                        </TableCell>

                        <TableCell align="right">
                          <CustomTextField
                            value={product.peso}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              const newProductValue = Math.max(0, +event.target.value);
                              const updatedProductBrinde = { ...product, peso: newProductValue };
                              atualizarProdutoBrinde(updatedProductBrinde);
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
                              const updatedProductBrinde = { ...product, largura: newProductValue };
                              atualizarProdutoBrinde(updatedProductBrinde);
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
                              const updatedProductBrinde = { ...product, altura: newProductValue };
                              atualizarProdutoBrinde(updatedProductBrinde);
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
                              const updatedProductBrinde = { ...product, comprimento: newProductValue };
                              atualizarProdutoBrinde(updatedProductBrinde);
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
                          <IconButton onClick={() => removerProdutoBrinde(product)}>
                            <DeleteIcon />
                          </IconButton>
                          <IconButton onClick={() => removerProdutoUnidadeBrinde(product)}>
                            <IconMinus />
                          </IconButton>
                          <IconButton onClick={() => adicionarProdutoBrinde(product)}>
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
                key={'produto' + 'zerado'}
              >
                <Alert onClose={handleCloseSnackbarProdutosComAtributoZerado} severity="error" sx={{ width: '100%' }}>
                  Cuidado: produto contém algum atributo zerado!
                </Alert>
              </Snackbar>
            </div>
          )}


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
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCEP(event.target.value.replace(/[\s.-]/g, ''))}
              onBlur={handleCEPBlur}
              onKeyPress={handleCEPKeyPressEnter}
              variant="outlined"
              size="small"
              sx={{ width: '200px' }}
              disabled={!clientId || productsList.length === 0 || produtosComAtributoZerado}
            />
          </Box>

          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={openSnackbarCepInvalido}
            onClose={handleCloseSnackbarCepInvalido}
            key={'cep' + 'invalido'}
          >
            <Alert onClose={handleCloseSnackbarCepInvalido} severity="error" sx={{ width: '100%' }}>
              Atenção: pesquisa de endereço retornou CEP inválido!
            </Alert>
          </Snackbar>

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
                  label={`Retirada - R$ 0,00.`}
                />

                {precoLalamove && (
                  <FormControlLabel
                    value="LALAMOVE"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Image
                          src="/images/lalamove.png"
                          alt="Lalamove"
                          width={30}
                          height={30}
                          style={{ marginRight: '10px' }}
                        />
                        <Typography>
                          {`Lalamove - R$ ${precoLalamove.toFixed(2)}`}
                          {prazoLalamove && ` (${prazoLalamove} dia útil)`}
                        </Typography>
                      </Box>
                    }
                  />
                )}

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
                          (prazoPac !== null ? prazoPac : "não disponível") + " dias úteis."
                        }
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
                          (prazoSedex !== null ? prazoSedex : "não disponível") + " dias úteis."
                        }
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
                // disabled={!shippingOption}
                onClick={() => {
                  setIsAnticipation(false);
                }}
              />
              <FormControlLabel
                value="antecipacao"
                control={<Radio />}
                label="Antecipação"
                onClick={() => {
                  if (!checkedBrinde && !checkedDesconto) {
                    setIsAnticipation(true);
                    setOpenAnticipation(true);
                  }
                }}
                checked={isUrgentDeliverySelected && isAnticipation}
                disabled={checkedBrinde || checkedDesconto}
              />
            </RadioGroup>
          </FormControl>

          <Dialog
            open={openAnticipation}
            onClose={() => setIsAnticipation(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title" sx={{ mt: 3 }}>
              {"Definições de Antecipação"}
            </DialogTitle>
            <DialogContent sx={{ mt: 5, px: 3 }}>
              <CustomFormLabel
                htmlFor="dataAntecipa"
                sx={{
                  mt: 0,
                }}
              >
                Data de Antecipação
              </CustomFormLabel>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <DatePicker
                  label="Data de entrega"
                  value={dataDesejadaEntregaInput ? dataDesejadaEntregaInput.toJSDate() : null}
                  onChange={(newValue: Date | null) => {
                    if (newValue) {
                      const luxonDate = DateTime.fromJSDate(newValue);
                      setDataDesejadaEntregaInput(luxonDate);
                    } else {
                      setDataDesejadaEntregaInput(null);
                    }
                  }}
                  // minDate={tomorrow}
                  renderInput={(params) => (
                    <CustomTextField
                      {...params}
                      sx={{ mb: 2 }}
                      id="dataAntecipa"
                      name="dataAntecipa"
                    />
                  )}
                // renderInput={(params) => <CustomTextField {...params} sx={{ mb: 2 }} id="dataAntecipa" name="dataAntecipa" />}
                />
              </LocalizationProvider>
              <CustomFormLabel
                htmlFor="taxaAntecipacao"
                sx={{
                  mt: 0,
                }}
              >
                Taxa de Antecipação
              </CustomFormLabel>
              <NumericFormat
                id="taxaAntecipacao"
                name="taxaAntecipacao"
                value={taxaAntecipaInput}
                onValueChange={(values) => {
                  setTaxaAntecipaInput(values.floatValue ?? 0);
                }}
                thousandSeparator="."
                decimalSeparator=","
                allowLeadingZeros={false}
                decimalScale={2}
                fixedDecimalScale
                prefix="R$ "
                customInput={CustomTextField}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">R$</InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
            </DialogContent>
            <DialogActions sx={{ px: 3 }}>
              <Button onClick={() => {
                setOpenAnticipation(false);
                if (!isAnticipation) {
                  setIsAnticipation(false);
                }
              }}>
                Cancelar
              </Button>
              <Button
                onClick={handleAntecipa}
                autoFocus
                disabled={!taxaAntecipaInput || !dataDesejadaEntregaInput}
              >
                Antecipar
              </Button>
            </DialogActions>
          </Dialog>

          {isAnticipation && (
            <Typography variant="body2" color="text Secondary" sx={{ mt: 2 }}>
              Data de entrega desejada: {dataDesejadaEntrega ? dataDesejadaEntrega.setLocale('pt-BR').toLocaleString({ day: 'numeric', month: 'long', year: 'numeric' }) : 'Nenhuma data selecionada'}
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

          <div>
            <FormControl sx={{ mt: 2 }} disabled={isAnticipation || !(clientId && productsList.length > 0)}>
              <FormControlLabel
                control={
                  <CustomCheckbox
                    checked={checkedDesconto}
                    onChange={(e) => !isAnticipation && setCheckedDesconto(e.target.checked)}
                  />
                }
                label="Desconto"
              />
            </FormControl>
          </div>

          <Dialog
            open={openDesconto}
            onClose={() => setIsAnticipation(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title" sx={{ mt: 3 }}>
              {"Definições de Desconto"}
            </DialogTitle>
            <DialogContent sx={{ mt: 3, px: 3 }}>

              <RadioGroup
                sx={{ mb: 3 }}
                aria-label="selecionar-tipo-desconto"
                name="selecionar-tipo-desconto"
                value={tipoDesconto}
                onChange={(e) => setTipoDesconto(e.target.value)}
                row
              >
                <FormControlLabel

                  value="percentual"
                  control={<CustomRadio />}
                  label="Aplicar Percentual"
                />
                <FormControlLabel
                  value="valor"
                  control={<CustomRadio />}
                  label="Aplicar Valor"
                />
              </RadioGroup>

              {tipoDesconto === 'percentual' && (
                <>
                  <CustomFormLabel
                    htmlFor="taxaAntecipacao"
                    sx={{
                      mt: 0,
                    }}
                  >
                    Percentual de Desconto
                  </CustomFormLabel>
                  <NumericFormat
                    id="percentualDesconto"
                    name="percentualDesconto"
                    value={percentualDesconto}
                    onValueChange={(values) => {
                      setPercentualDesconto(values.floatValue ?? 0);
                    }}
                    thousandSeparator="."
                    decimalSeparator=","
                    allowLeadingZeros={false}
                    decimalScale={2}
                    fixedDecimalScale
                    customInput={CustomTextField}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />
                </>
              )}

              {tipoDesconto === 'valor' && (
                <>
                  <CustomFormLabel
                    htmlFor="taxaAntecipacao"
                    sx={{
                      mt: 0,
                    }}
                  >
                    Taxa de Antecipação
                  </CustomFormLabel>
                  <NumericFormat
                    id="taxaAntecipacao"
                    name="taxaAntecipacao"
                    value={valorDesconto}
                    onValueChange={(values) => {
                      setValorDesconto(values.floatValue ?? 0);
                    }}
                    thousandSeparator="."
                    decimalSeparator=","
                    allowLeadingZeros={false}
                    decimalScale={2}
                    fixedDecimalScale
                    customInput={CustomTextField}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">R$</InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />
                </>
              )}

            </DialogContent>
            <DialogActions sx={{ px: 3 }}>
              <Button onClick={() => {
                setOpenDesconto(false);
                // if (!isAnticipation) {
                //   setIsAnticipation(false);
                // }
              }}>
                Cancelar
              </Button>
              <Button
                onClick={handleDesconto}
                autoFocus
                disabled={!tipoDesconto || (!percentualDesconto && !valorDesconto)}
              >
                Aplicar Desconto
              </Button>
            </DialogActions>
          </Dialog>

          {checkedDesconto && tipoDesconto && (valorDesconto !== null || percentualDesconto !== null) && (
            <div>
              Valor Descontado: <strong>
                R$ {tipoDesconto === 'valor'
                  ? valorDesconto?.toFixed(2)
                  : totalProductsValue !== null && percentualDesconto !== null
                    ? (totalProductsValue * (percentualDesconto / 100)).toFixed(2)
                    : '0.00'}
              </strong>
            </div>
          )}

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

                  formatarPDF(htmlContent, address); // Passa o HTML com a cor ajustada
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
            key={'orcamento' + 'copiado'}
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


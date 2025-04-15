'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import { Pagination, Stack, Button, Box, Typography, Collapse, FormControlLabel, Checkbox, TextField, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import InputAdornment from '@mui/material/InputAdornment';
import { IconPlus, IconSearch, IconLink, IconShirtSport, IconCheck, IconTrash, IconBrush, IconUser } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { IconTruckDelivery } from '@tabler/icons-react';
import useAprovarPedidoStatus from './components/useAprovarPedidoStatus';
import { logger } from '@/utils/logger';
import Link from 'next/link';

interface Pedidos {
  id: number;
  orcamento_id: number;
  user_id: number | null;
  numero_pedido: string | null;
  data_prevista: string | null;
  pedido_status_id: number | null;
  pedido_tipo_id: number | null;
  pedido_produto_categoria: string | null;
  pedido_material: string | null;
  rolo: string | null;
  medida_linear: string | null;
  prioridade: string | null;
  estagio: string | null;
  situacao: string | null;
  designer_id: number | null;
  observacoes: string | null;
  codigo_rastreamento: string | null;
  url_trello: string | null;
  created_at: string;
  updated_at: string;
}

interface Produto {
  id: number;
  nome: string;
  peso: string; // Caso o peso seja uma string
  prazo: number;
  preco: number;
  altura: string; // Considerando que altura, largura e comprimento são strings
  largura: string;
  comprimento: string;
  created_at: string | null; // Pode ser null ou uma string
  quantidade: number;
  updated_at: string | null; // Pode ser null ou uma string
}

interface Orcamento {
  id: number;
  user_id: number;
  cliente_octa_number: string;
  nome_cliente: string | null;
  lista_produtos: string | null;
  produtos_brinde: string | null;
  texto_orcamento: string | null;
  endereco_cep: string;
  endereco: string;
  opcao_entrega: string;
  prazo_opcao_entrega: number;
  preco_opcao_entrega: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  brinde: number;
  tipo_desconto: string;
  valor_desconto: number;
  data_antecipa: string;
  taxa_antecipa: string;
  total_orcamento: number;
  prev_entrega: Date;
  pedidos: Pedidos[];
  client_info?: {
    client_id: number | null;
    client_name: string | null;
    client_email: string | null;
    has_uniform: boolean;
  };
}

interface Sketch {
  letter: string;
  quantity: number;
  package: string;
}

const OrcamentoBackofficeScreen = () => {
  const router = useRouter();
  const [query, setQuery] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [openDialogaImportPedido, setOpenDialogaImportPedido] = useState(false);
  const [numeroPedido, setNumeroPedido] = useState('');
  const [isAddingTiny, setIsAddingTiny] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [openRow, setOpenRow] = useState<{ [key: number]: boolean }>({});
  const [linkUniform, setLinkUniform] = useState<string>('');
  const [openUniformDialog, setOpenUniformDialog] = useState<boolean>(false);
  const [sketches, setSketches] = useState<Sketch[]>([]);
  const [currentQuantity, setCurrentQuantity] = useState<number>(1);
  const [currentLetter, setCurrentLetter] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isGeneratingLink, setIsGeneratingLink] = useState<boolean>(false);
  const [isLinkGenerated, setIsLinkGenerated] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [currentOrcamentoId, setCurrentOrcamentoId] = useState<number | null>(null);
  const [existingUniforms, setExistingUniforms] = useState<boolean>(false);
  const [linkCopied, setLinkCopied] = useState<boolean>(false);
  const [isCheckingUniforms, setIsCheckingUniforms] = useState<boolean>(false);
  const [openEntregaDialog, setOpenEntregaDialog] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<Pedidos | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [showInputPedidosStatus, setShowInputPedidosStatus] = useState(false);
  const [inputValueEntrega, setInputValueEntrega] = useState(selectedPedido?.codigo_rastreamento || '');
  const [hasEntrega, setHasEntrega] = useState(false);
  const [loadingPedido, setLoadingPedido] = useState(false);
  const [copiedRastreio, setCopiedRastreio] = useState(false);
  const [isLoadingConfirmaPedido, setIsLoadingConfirmaPedido] = useState(false);
  const [loadingBrushIds, setLoadingBrushIds] = useState<{ [key: number]: boolean }>({});
  const [navigateTo, setNavigateTo] = useState<string | null>(null);
  const [clientesConfigurados, setClientesConfigurados] = useState<{ [key: number]: boolean }>({});
  const [uniformesConfigurados, setUniformesConfigurados] = useState<{ [key: number]: boolean }>({});
  const [verificandoCliente, setVerificandoCliente] = useState<{ [key: number]: boolean }>({});
  const [verificandoUniformes, setVerificandoUniformes] = useState<{ [key: number]: boolean }>({});
  const [arteFinalConfigurados, setArteFinalConfigurados] = useState<{ [key: number]: boolean }>({});
  const [verificandoArteFinal, setVerificandoArteFinal] = useState<{ [key: number]: boolean }>({});
  const [confirmacaoArteFinalConfigurados, setConfirmacaoArteFinalConfigurados] = useState<{ [key: number]: boolean }>({});
  const [currentPackage, setCurrentPackage] = useState<string>('Start');
  const [email, setEmail] = useState<string>('');
  const [emailConfirmation, setEmailConfirmation] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientEmailConfirmation, setClientEmailConfirmation] = useState<string>('');
  const [openClientEmailDialog, setOpenClientEmailDialog] = useState<boolean>(false);
  const [isLinkingClient, setIsLinkingClient] = useState<boolean>(false);
  const [isClientLinked, setIsClientLinked] = useState<boolean>(false);
  const [clientEmailError, setClientEmailError] = useState<string | null>(null);

  const theme = useTheme()

  const regexFrete = /Frete:\s*R\$\s?(\d{1,3}(?:\.\d{3})*,\d{2})\s?\(([^)]+)\)/;
  const regexPrazo = /Prazo de Produção:\s*\d{1,3}\s*dias úteis/;
  const regexEntrega = /Previsão de Entrega:\s*([\d]{1,2} de [a-zA-Z]+ de \d{4})\s?\(([^)]+)\)/;
  const regexBrinde = /Brinde:\s*\d+\s*un\s*[\w\s]*\s*R\$\s*\d{1,3}(?:,\d{2})*\s*\(R\$\s*\d{1,3}(?:,\d{2})*\)/;
  const REGEX = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  };

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    // throw new Error('Access token is missing');
    console.error('Access token is missing');
    router.push('/auth/login');
  }

  const verificarClienteCadastrado = async (orcamentoId: number) => {
    setVerificandoCliente(prev => ({ ...prev, [orcamentoId]: true }));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/orcamento/backoffice/get-cliente-by-orcamento?orcamento_id=${orcamentoId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        setClientesConfigurados(prev => ({ ...prev, [orcamentoId]: true }));
      } else {
        setClientesConfigurados(prev => ({ ...prev, [orcamentoId]: false }));
      }
    } catch (error) {
      logger.error('Erro ao verificar cliente:', error);
      setClientesConfigurados(prev => ({ ...prev, [orcamentoId]: false }));
    } finally {
      setVerificandoCliente(prev => ({ ...prev, [orcamentoId]: false }));
    }
  };

  const verificarUniformesConfigurados = async (orcamentoId: number) => {
    setVerificandoUniformes(prev => ({ ...prev, [orcamentoId]: true }));

    try {
      // Usando o middleware Laravel para verificar uniformes
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/orcamento/uniformes-go/${orcamentoId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Verificando se existem jogadores configurados nos esboços
        const temConfiguracao = data.data && 
          data.data.length > 0 && 
          data.data.some((uniforme: any) => 
            uniforme.sketches && 
            uniforme.sketches.some((sketch: any) => 
              sketch.players && sketch.players.length > 0 && 
              sketch.players.some((player: any) => player.ready)
            )
          );
        setUniformesConfigurados(prev => ({ ...prev, [orcamentoId]: temConfiguracao }));
      } else {
        setUniformesConfigurados(prev => ({ ...prev, [orcamentoId]: false }));
      }
    } catch (error) {
      logger.error('Erro ao verificar uniformes:', error);
      setUniformesConfigurados(prev => ({ ...prev, [orcamentoId]: false }));
    } finally {
      setVerificandoUniformes(prev => ({ ...prev, [orcamentoId]: false }));
    }
  };

  const verificarPedidoArteFinal = async (orcamentoId: number) => {
    setVerificandoArteFinal(prev => ({ ...prev, [orcamentoId]: true }));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/pedidos/get-pedido-arte-final-orcamento/${orcamentoId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const temConfiguracao = data;
        setArteFinalConfigurados(prev => ({ ...prev, [orcamentoId]: temConfiguracao }));
      } else {
        setArteFinalConfigurados(prev => ({ ...prev, [orcamentoId]: false }));
      }
    } catch (error) {
      logger.error('Erro ao verificar pedidos:', error);
      setArteFinalConfigurados(prev => ({ ...prev, [orcamentoId]: false }));
    } finally {
      setVerificandoArteFinal(prev => ({ ...prev, [orcamentoId]: false }));
    }
  };

  const verificarConfirmacaoPedidoArteFinal = async (orcamentoId: number, numero_pedido: number | null) => {
    if (!numero_pedido) {
      setConfirmacaoArteFinalConfigurados(prev => ({ ...prev, [orcamentoId]: false }));
      return;
    } else {
      setConfirmacaoArteFinalConfigurados(prev => ({ ...prev, [orcamentoId]: true }));
    }
  }

  const handleNovoPedido = () => {
    setIsAdding(true);
    router.push('/apps/producao/arte-final/add/block-tiny-block-brush');
  };

  const handleImportPedido = async () => {
    try {
      setIsImporting(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/producao/import-pedido-from-tiny`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          numero_pedido: numeroPedido
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        logger.error('Erro ao importar pedido:', errorData);
        return;
      }

      setOpenDialogaImportPedido(false);
      const responseData = await response.json();
      router.push(`/apps/producao/arte-final/edit/${responseData.id}`);

    } catch (error) {
      logger.error('Erro na requisição:', error);
      alert('Erro ao importar pedido.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleNovoPedidoTiny = () => {
    setIsAddingTiny(true);
    router.push('/apps/producao/arte-final/add/with-tiny/');
  };

  const handleFetchPedido = async (id: number | undefined) => {
    try {
      setLoadingPedido(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/pedidos/get-pedido-orcamento/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setSelectedPedido(data);
      setInputValueEntrega(data.codigo_rastreamento)
      setLoadingPedido(false);
    } catch (error) {
      console.error('Error fetching pedido:', error);
    } finally {
      setLoadingPedido(false); // Finaliza o loading
    }
  };

  useEffect(() => {
    if (selectedPedido && selectedPedido.codigo_rastreamento) {
      setHasEntrega(true);
    } else {
      setHasEntrega(false);
    }
  }, [selectedPedido]);

  useEffect(() => {
    if (navigateTo) {
      router.push(navigateTo);
    }
  }, [navigateTo, router]);

  const { isFetching: isFetchingOrcamentos, error: errorOrcamentos, data: dataOrcamentos, refetch } = useQuery({
    queryKey: ['budgetData', searchQuery, page],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API}/api/orcamento/get-orcamentos-aprovados?q=${encodeURIComponent(searchQuery)}&page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((res) => res.json()),
  });

  useEffect(() => {
    if (dataOrcamentos && dataOrcamentos.data) {
      dataOrcamentos.data.forEach((orcamento: Orcamento) => {
        verificarClienteCadastrado(orcamento.id);
        verificarUniformesConfigurados(orcamento.id);
        verificarPedidoArteFinal(orcamento.id);
        verificarConfirmacaoPedidoArteFinal(orcamento.id, Number(orcamento.pedidos[0]?.numero_pedido) ?? false);
      });
    }
  }, [dataOrcamentos])


  const handleOpenDialogEntrega = (id: number) => {
    console.log('id passado no handle open : ', id)
    handleFetchPedido(id);
    setOpenEntregaDialog(true);
  };

  const handleCloseDialogEntrega = () => {
    setOpenEntregaDialog(false);
  };


  const handleSubmmitEntrega = (inputValueEntrega: string) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API}/api/pedidos/pedido-codigo-rastreamento/`, // Corrigi a URL, parecia estar errada
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          pedido_id: selectedPedido?.id,
          codigo_rastreamento: inputValueEntrega,
        }),
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error('Erro ao enviar código de rastreamento'); // Corrigi erro de digitação na mensagem
        }
        return res.json();
      })
      .then((data) => {
        console.log('Código de rastreamento enviado com sucesso:', data);
        handleFetchPedido(selectedPedido?.orcamento_id || 0);
        setHasEntrega(true);
      })
      .catch((error) => {
        console.error(error.message);
        alert(error.message);
      });
  };

  const handleMakePedido = async (orcamento: Orcamento) => {
    const confirmar = window.confirm('Deseja confirmar o pedido N° ' + orcamento.id);

    if (!confirmar) {
      return;
    }

    setIsLoadingConfirmaPedido(true);

    const orcamentoFormated = {
      id: orcamento.id,
      id_vendedor: orcamento.user_id,
      cliente_codigo: orcamento.cliente_octa_number,
      nome_cliente: orcamento.nome_cliente,
      lista_produtos: orcamento.lista_produtos,
      produtos_brinde: orcamento.produtos_brinde,
      brinde: orcamento.brinde,
      texto_orcamento: orcamento.texto_orcamento,
      cep: orcamento.endereco_cep,
      endereco: orcamento.endereco,
      transportadora: orcamento.opcao_entrega,
      data_pedido: orcamento.created_at,
      updated_at: orcamento.updated_at,
      tipo_desconto: orcamento.tipo_desconto,
      valor_desconto: orcamento.valor_desconto,
      data_antecipa: orcamento.data_antecipa,
      taxa_antecipa: orcamento.taxa_antecipa,
      total_orcamento: orcamento.total_orcamento,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/orcamento/backoffice/update-arte-final-com-orcamento`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(orcamentoFormated),
      });

      const data = await response.json();
      setIsLoadingConfirmaPedido(false);

      if (data.retorno && data.retorno.status === "Erro") {
        const registro = data.retorno.registros.registro;
        if (registro && registro.erros && registro.erros.length > 0) {
          const ultimoErro = registro.erros[registro.erros.length - 1];
          const mensagemErro = ultimoErro.erro;
          alert('Pedido não salvo! ' + mensagemErro);
          return;
        }
      }

      if (response.ok) {
        alert('Pedido N°' + orcamento.id + ' salvo com sucesso!');
      } else {
        // Já temos os dados em "data", então não precisamos chamar response.json() novamente.
        console.log(data.message);
        alert(`Erro ao salvar: ${data.message}`);
      }

      refetch();
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Ocorreu um erro ao processar o pedido: " + error);
      setIsLoadingConfirmaPedido(false);
      refetch();
    }

  };

  const handleSearch = () => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleToggleRow = (id: number) => {
    setOpenRow(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (isFetchingOrcamentos) return <CircularProgress />;
  if (errorOrcamentos) return <p>Ocorreu um erro: {errorOrcamentos.message}</p>;
  if (dataOrcamentos) logger.log(dataOrcamentos);

  const handleClientEmailDialog = (orcamentoId: number) => {
    setCurrentOrcamentoId(orcamentoId);
    setOpenClientEmailDialog(true);
    
    // Verificar se o cliente já está cadastrado através do client_info
    const orcamento = dataOrcamentos?.data.find((o: Orcamento) => o.id === orcamentoId);
    if (orcamento?.client_info?.client_id) {
      setIsClientLinked(true);
      setClientEmail(orcamento.client_info.client_email || '');
      setClientEmailConfirmation(orcamento.client_info.client_email || '');
    } else {
      setIsClientLinked(false);
      setClientEmail('');
      setClientEmailConfirmation('');
    }
    
    setClientEmailError(null);
  }

  const handleLinkClientEmail = async () => {
    if (!currentOrcamentoId) return;
    
    try {
      setIsLinkingClient(true);
      setClientEmailError(null);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/orcamento/${currentOrcamentoId}/link-client`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          client_email: clientEmail,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setIsClientLinked(true);
        refetch();
      } else {
        setClientEmailError(data.message || 'Erro ao vincular cliente ao orçamento');
      }
    } catch (error) {
      console.error('Error linking client email:', error);
      setClientEmailError('Erro ao vincular cliente ao orçamento. Tente novamente.');
    } finally {
      setIsLinkingClient(false);
    }
  }

  const handleCloseClientEmailDialog = () => {
    setOpenClientEmailDialog(false);
    setClientEmail('');
    setClientEmailConfirmation('');
    setIsClientLinked(false);
    setCurrentOrcamentoId(null);
    setClientEmailError(null);
  }

  async function handleShortlinkUniform(uniformId: number) {
    setCurrentOrcamentoId(uniformId);
    setIsCheckingUniforms(false);
    setExistingUniforms(false);
    setSketches([]);
    
    const orcamento = dataOrcamentos?.data.find((o: Orcamento) => o.id === uniformId);
    if (orcamento?.client_info?.client_email) {
      setEmail(orcamento.client_info.client_email);
      setEmailConfirmation(orcamento.client_info.client_email);
    } else {
      setEmail('');
      setEmailConfirmation('');
    }
    
    setIsLinkGenerated(false);
    setApiError(null);
  }

  const handleGenerateAndCopyLink = async () => {
    try {
      setIsGeneratingLink(true);
      setApiError(null);

      const goApiSketches = sketches.map(sketch => ({
        id: sketch.letter,
        player_count: sketch.quantity,
        package_type: sketch.package,
        players: []
      }));

      const uniformData = {
        budget_id: currentOrcamentoId,
        client_email: email,
        sketches: goApiSketches
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/orcamento/uniformes-go`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(uniformData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setApiError(errorData.message || 'Erro ao salvar os esboços. Tente novamente.');
        setIsGeneratingLink(false);
        return;
      }

      await navigator.clipboard.writeText(linkUniform);
      setIsLinkGenerated(true);
    } catch (error) {
      console.error('Erro ao processar os esboços:', error);
      setApiError('Ocorreu um erro ao processar os esboços. Tente novamente.');
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleDialogClose = () => {
    setOpenUniformDialog(false);
    setSketches([]);
    setCurrentLetter('');
    setCurrentQuantity(1);
    setCurrentPackage('Start');
    setEmail('');
    setIsLinkGenerated(false);
    setApiError(null);
    setCurrentOrcamentoId(null);
    setExistingUniforms(false);
    setLinkCopied(false);
  };


  const handleOpenRastreamentoInterno = (id: string | number | undefined) => {
    const link = window.location.origin + '/apps/orcamento/backoffice/rastreamento-interno/' + id;
    window.open(link, "_blank");
  }
  const handleOpenRastreamentoCliente = (id: string | number | undefined) => {
    // window.location.href = '/apps/orcamento/rastreamento-cliente/' + id;

    const textToCopy = window.location.origin + "/apps/orcamento/backoffice/rastreamento-cliente/" + id;

    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopiedRastreio(true);
        setTimeout(() => setCopiedRastreio(false), 2000); // Reseta a mensagem após 2 segundos
      })
      .then(() => {
        alert('Link copiado com sucesso');
      })
      .catch((err) => console.error("Erro ao copiar texto:", err));
  }

  const handleAprovaEnvio = (id: string | number | undefined, id_orcamento: number | undefined) => {
    const status = "envio";
    useAprovarPedidoStatus(status, id);
    handleFetchPedido(id_orcamento);
    // setHasEnvio(true);
  }

  const handleAprovaRecebimento = (id: string | number | undefined, id_orcamento: number | undefined) => {
    const status = "recebimento";
    useAprovarPedidoStatus(status, id);
    handleFetchPedido(id_orcamento);
    // setHasRecebimento(true);
  }

  const handleBrushClick = async (id: number) => {
    setLoadingBrushIds(prev => ({ ...prev, [id]: true }));
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/producao/pedido-arte-final/from-backoffice/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create pedido');
      }

      const data = await response.json();
      if (data.pedido && data.pedido.id) {
        setNavigateTo(`/apps/producao/arte-final/edit/${data.pedido.id}`);
      } else {
        throw new Error('Invalid response data');
      }
    } catch (error) {
      logger.error('Erro ao criar pedido:', error);
      alert('Erro ao criar pedido. Por favor, tente novamente.');
      setLoadingBrushIds(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <PageContainer title="Orçamento / Backoffice" description="Gerenciar Pedidos da Arte Arena">
      <Breadcrumb title="Orçamento / Backoffice" subtitle="Gerenciar Pedidos da Arte Arena / Backoffice" />
      <ParentCard title="Backoffice" >
        <>

          <Stack direction="row" spacing={1} sx={{ marginBottom: '1em', height: '3em', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={isAdding ? <CircularProgress size={20} /> : <IconPlus />}
              sx={{ height: '100%' }}
              onClick={handleNovoPedido}
              disabled={isAdding}
            >
              {isAdding ? 'Adicionando (apenas Space)...' : 'Adicionar pedido (apenas Space)'}
            </Button>
            <Button
              variant="contained"
              startIcon={isImporting ? <CircularProgress size={20} /> : <IconPlus />}
              sx={{ height: '100%' }}
              onClick={() => setOpenDialogaImportPedido(true)}
              disabled={isImporting}
            >
              {isImporting ? 'Importando pedido do Tiny...' : 'Importar pedido do Tiny'}
            </Button>

            <Dialog
              open={openDialogaImportPedido}
              onClose={() => {
                setOpenDialogaImportPedido(false);
                setNumeroPedido('');
              }}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Importar pedido do Tiny"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  <CustomTextField
                    required
                    label="Número do Pedido (Tiny)"
                    variant="outlined"
                    fullWidth
                    value={numeroPedido}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      const value = event.target.value.replace(/\D/g, '').slice(0, 5);
                      setNumeroPedido(value);
                    }}
                    inputProps={{ maxLength: 5 }}
                  />
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenDialogaImportPedido(false)}>Cancelar</Button>
                <Button
                  autoFocus
                  disabled={numeroPedido.length !== 5}
                  onClick={handleImportPedido}
                >
                  Importar
                </Button>
              </DialogActions>
            </Dialog>

            <Button
              variant="contained"
              startIcon={isAddingTiny ? <CircularProgress size={20} /> : <IconPlus />}
              sx={{ height: '100%' }}
              onClick={handleNovoPedidoTiny}
              disabled={isAddingTiny}
            >
              {isAddingTiny ? 'Adicionando... (+ Tiny)' : 'Adicionar pedido (+ Tiny)'}
            </Button>
          </Stack>

          <Stack spacing={2} direction="row" alignItems="center" mb={2}>
            <CustomTextField
              fullWidth
              value={query}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
              onKeyPress={handleSearchKeyPress}
              placeholder="Buscar orçamento aprovado..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              startIcon={<IconSearch />}
            >
              Buscar
            </Button>
          </Stack>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>ID do Orçamento</TableCell>
                  <TableCell>Número do Pedido (Tiny)</TableCell>
                  <TableCell>Número do Cliente</TableCell>
                  <TableCell>Data de Criação</TableCell>
                  <TableCell>Previsão de Entrega</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataOrcamentos?.data.map((row: Orcamento) => {
                  const listaProdutos = row.lista_produtos
                    ? (typeof row.lista_produtos === 'string' ? JSON.parse(row.lista_produtos) : row.lista_produtos)
                    : [];

                  const texto = row.texto_orcamento;
                  const frete = texto?.match(regexFrete);
                  const prazo = texto?.match(regexPrazo);
                  // console.log(prazo)
                  const entrega = texto?.match(regexEntrega);
                  const brinde = texto?.match(regexBrinde);

                  const hasPedidos = row.pedidos && row.pedidos.length > 0;

                  return (
                    <React.Fragment key={row.id}>
                      <TableRow>
                        <TableCell>
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => handleToggleRow(row.id)}
                          >
                            {openRow[row.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                          </IconButton>
                        </TableCell>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{hasPedidos ? row.pedidos[0].numero_pedido : '-'}</TableCell>
                        <TableCell>{row.cliente_octa_number}</TableCell>
                        <TableCell>{new Date(row.created_at).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>{(() => {
                          // Verifica se existe um valor válido para row.prev_entrega
                          if (row.prev_entrega && String(row.prev_entrega) !== "null") {
                            // Se a data estiver no formato ISO com horário (ex.: "2025-04-24T00:00:00.000Z"),
                            // extraímos apenas a parte da data antes do "T"
                            const dataStr =
                              String(row.prev_entrega).indexOf("T") > -1
                                ? String(row.prev_entrega).split("T")[0]
                                : String(row.prev_entrega);

                            // Separa os componentes da data
                            const [year, month, day] = dataStr.split("-");

                            // Confirma se temos os três componentes
                            if (year && month && day) {
                              // Cria a data em horário local (lembre que o mês é indexado de 0)
                              const dateLocal = new Date(Number(year), Number(month) - 1, Number(day));
                              return dateLocal.toLocaleDateString("pt-BR");
                            } else {
                              console.error("Formato de data inesperado:", row.prev_entrega);
                              return "";
                            }
                          }
                          return "";
                        })()}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Button
                              variant="outlined"
                              onClick={() => {
                                handleClientEmailDialog(row.id);
                              }}
                              sx={{
                                position: 'relative',
                                '&::after': clientesConfigurados[row.id] || row.client_info?.client_id ? {
                                  content: '""',
                                  position: 'absolute',
                                  top: '5px',
                                  right: '5px',
                                  width: '10px',
                                  height: '10px',
                                  borderRadius: '50%',
                                  backgroundColor: 'success.main',
                                } : {}
                              }}
                            >
                              <IconUser />
                            </Button>
                            
                            <Dialog
                              open={openClientEmailDialog}
                              onClose={handleCloseClientEmailDialog}
                            >
                              <DialogTitle>Vincular Cliente ao Orçamento</DialogTitle>
                              <DialogContent>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 2, minWidth: '300px' }}>
                                  {isClientLinked ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                      <Typography variant="body1" color="primary">
                                        Cliente já cadastrado
                                      </Typography>
                                      <Typography variant="body2">
                                        <strong>Email:</strong> {clientEmail}
                                      </Typography>
                                      {currentOrcamentoId && (
                                        <Typography variant="body2">
                                          <strong>ID do Cliente:</strong> {dataOrcamentos?.data.find((o: Orcamento) => o.id === currentOrcamentoId)?.client_info?.client_id}
                                        </Typography>
                                      )}
                                      {currentOrcamentoId && (
                                        <Typography variant="body2">
                                          <strong>Nome:</strong> {dataOrcamentos?.data.find((o: Orcamento) => o.id === currentOrcamentoId)?.client_info?.client_name}
                                        </Typography>
                                      )}
                                    </Box>
                                  ) : (
                                    <>
                                      <CustomTextField
                                        fullWidth
                                        label="E-mail do Cliente"
                                        value={clientEmail}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClientEmail(e.target.value)}
                                        disabled={isClientLinked}
                                        type="email"
                                      />
                                      <CustomTextField
                                        fullWidth
                                        label="Confirme o e-mail"
                                        value={clientEmailConfirmation}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClientEmailConfirmation(e.target.value)}
                                        disabled={isClientLinked}
                                        type="email"
                                        error={clientEmailConfirmation !== '' && clientEmail !== clientEmailConfirmation}
                                        helperText={clientEmailConfirmation !== '' && clientEmail !== clientEmailConfirmation ? 'Os e-mails não coincidem' : ''}
                                      />
                                    </>
                                  )}
                                   
                                  {clientEmailError && (
                                    <Box sx={{ mt: 1, p: 1, bgcolor: 'error.light', borderRadius: 1 }}>
                                      <Typography color="error" variant="body2">
                                        {clientEmailError}
                                      </Typography>
                                    </Box>
                                  )}
                                </Box>
                              </DialogContent>
                              <DialogActions>
                                {!isClientLinked ? (
                                  <>
                                    <Button
                                      onClick={handleCloseClientEmailDialog}
                                    >
                                      Fechar
                                    </Button>
                                    <Button
                                      variant="contained"
                                      onClick={handleLinkClientEmail}
                                      disabled={isLinkingClient || !clientEmail || !REGEX.email.test(clientEmail) || clientEmail !== clientEmailConfirmation}
                                      startIcon={isLinkingClient && <CircularProgress size={16} />}
                                    >
                                      {!isLinkingClient && 'Vincular'}
                                    </Button>
                                  </>
                                ) : (
                                  <Button
                                    onClick={handleCloseClientEmailDialog}
                                  >
                                    Fechar
                                  </Button>
                                )}
                              </DialogActions>
                            </Dialog>
                            <Button
                              variant="outlined"
                              onClick={() => {
                                // Se já tiver uniforme, redirecionar diretamente
                                if (row.client_info?.has_uniform) {
                                  router.push(`/uniforms/${row.id}`);
                                } else {
                                  // Senão, abrir o dialog para criar
                                  setOpenUniformDialog(true);
                                  handleShortlinkUniform(row.id);
                                }
                              }}
                              sx={{
                                position: 'relative',
                                '&::after': uniformesConfigurados[row.id] || row.client_info?.has_uniform ? {
                                  content: '""',
                                  position: 'absolute',
                                  top: '5px',
                                  right: '5px',
                                  width: '10px',
                                  height: '10px',
                                  borderRadius: '50%',
                                  backgroundColor: 'success.main',
                                } : {}
                              }}
                              disabled={!row.client_info?.client_id}
                            >
                              <IconShirtSport />
                            </Button>
                            
                            <Dialog
                              open={openUniformDialog}
                              onClose={() => setOpenUniformDialog(false)}
                            >
                              <DialogTitle>Configuração de esboços de uniforme</DialogTitle>
                              <DialogContent>
                                {isCheckingUniforms ? (
                                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3 }}>
                                    <CircularProgress size={24} />
                                    <Typography sx={{ ml: 2 }}>Verificando uniformes existentes...</Typography>
                                  </Box>
                                ) : existingUniforms ? (
                                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Box sx={{ mt: 2, p: 1, bgcolor: 'warning.light', borderRadius: 1 }}>
                                      <Typography variant="body1" color="warning.dark">
                                        Já existem uniformes cadastrados para este orçamento. Não é possível adicionar ou editar esboços.
                                      </Typography>
                                    </Box>
                                  </Box>
                                ) : (
                                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 2 }}>
                                    <Box sx={{ 
                                      display: 'grid', 
                                      gridTemplateColumns: '1fr 1fr 1fr auto',
                                      gap: 2,
                                      alignItems: 'center',
                                      '@media (max-width: 900px)': {
                                        gridTemplateColumns: '1fr 1fr',
                                        '& > *:last-child': {
                                          gridColumn: '1 / -1'
                                        }
                                      }
                                    }}>
                                      <CustomTextField
                                        label="Letra do Esboço (A-Z)"
                                        value={currentLetter}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                          const value = e.target.value.toUpperCase();
                                          if (value === '' || /^[A-Z]$/.test(value)) {
                                            setCurrentLetter(value);
                                            setError('');
                                          }
                                        }}
                                        inputProps={{ maxLength: 1 }}
                                        error={!!error}
                                        helperText={error}
                                        disabled={isLinkGenerated}
                                      />
                                      <CustomTextField
                                        label="Quantidade"
                                        type="number"
                                        value={currentQuantity}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentQuantity(parseInt(e.target.value) || 1)}
                                        inputProps={{ min: 1 }}
                                        disabled={isLinkGenerated}
                                      />
                                      <FormControl fullWidth>
                                        <InputLabel>Pacote</InputLabel>
                                        <Select
                                          value={currentPackage}
                                          label="Pacote"
                                          onChange={(e) => setCurrentPackage(e.target.value)}
                                          disabled={isLinkGenerated}
                                        >
                                          <MenuItem value="Start">Start</MenuItem>
                                          <MenuItem value="Prata">Prata</MenuItem>
                                          <MenuItem value="Ouro">Ouro</MenuItem>
                                          <MenuItem value="Diamante">Diamante</MenuItem>
                                          <MenuItem value="Premium">Premium</MenuItem>
                                          <MenuItem value="Profissional">Profissional</MenuItem>
                                        </Select>
                                      </FormControl>
                                      <Button
                                        variant="contained"
                                        onClick={() => {
                                          if (!currentLetter) {
                                            setError('Selecione uma letra');
                                            return;
                                          }
                                          if (sketches.some(s => s.letter === currentLetter)) {
                                            setError('Esta letra já foi utilizada');
                                            return;
                                          }
                                          setSketches([...sketches, { letter: currentLetter, quantity: currentQuantity, package: currentPackage }]);
                                          setCurrentLetter('');
                                          setCurrentQuantity(1);
                                          setCurrentPackage('Start');
                                          setError('');
                                        }}
                                        disabled={isLinkGenerated}
                                      >
                                        Adicionar
                                      </Button>
                                    </Box>

                                    {sketches.length > 0 && (
                                      <TableContainer>
                                        <Table size="small">
                                          <TableHead>
                                            <TableRow>
                                              <TableCell>Esboço</TableCell>
                                              <TableCell>Quantidade</TableCell>
                                              <TableCell>Pacote</TableCell>
                                              <TableCell>Ações</TableCell>
                                            </TableRow>
                                          </TableHead>
                                          <TableBody>
                                            {sketches.map((sketch) => (
                                              <TableRow key={sketch.letter}>
                                                <TableCell>Esboço {sketch.letter}</TableCell>
                                                <TableCell>{sketch.quantity}</TableCell>
                                                <TableCell>{sketch.package}</TableCell>
                                                <TableCell>
                                                  <IconButton
                                                    size="small"
                                                    onClick={() => setSketches(sketches.filter(s => s.letter !== sketch.letter))}
                                                    disabled={isGeneratingLink || isLinkGenerated}
                                                  >
                                                    <IconTrash size={18} />
                                                  </IconButton>
                                                </TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </TableContainer>
                                    )}

                                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                      <Typography variant="subtitle1" color="primary">
                                        Informações do Cliente
                                      </Typography>
                                      {currentOrcamentoId && (
                                        <>
                                          <Typography variant="body2">
                                            <strong>Nome:</strong> {dataOrcamentos?.data.find((o: Orcamento) => o.id === currentOrcamentoId)?.client_info?.client_name || 'N/A'}
                                          </Typography>
                                          <Typography variant="body2">
                                            <strong>Email:</strong> {email || 'N/A'}
                                          </Typography>
                                        </>
                                      )}
                                    </Box>

                                    {apiError && (
                                      <Box sx={{ mt: 2, p: 1, bgcolor: 'error.light', borderRadius: 1 }}>
                                        <Typography color="error" variant="body2">
                                          {apiError}
                                        </Typography>
                                      </Box>
                                    )}
                                  </Box>
                                )}
                              </DialogContent>
                              <DialogActions>
                                {isCheckingUniforms ? (
                                  <Button onClick={() => setOpenUniformDialog(false)}>
                                    Fechar
                                  </Button>
                                ) : !existingUniforms ? (
                                  !isLinkGenerated ? (
                                    <>
                                      <Button
                                        onClick={() => setOpenUniformDialog(false)}
                                      >
                                        Fechar
                                      </Button>
                                      <Button
                                        variant="contained"
                                        onClick={handleGenerateAndCopyLink}
                                        disabled={isGeneratingLink || !email || sketches.length === 0}
                                        startIcon={isGeneratingLink && <CircularProgress size={16} />}
                                      >
                                        {!isGeneratingLink && 'Inserir'}
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <Typography variant="body2" color="success.main" sx={{ mr: 2 }}>
                                        Configuração de uniformes inserida com sucesso!
                                      </Typography>
                                    </>
                                  )
                                ) : (
                                  <>
                                    <Button onClick={() => setOpenUniformDialog(false)}>
                                      Fechar
                                    </Button>
                                    <Button 
                                      variant="contained" 
                                      color="primary"
                                      component={Link}
                                      href={`/uniforms/${currentOrcamentoId}`}
                                    >
                                      Visualizar Uniformes
                                    </Button>
                                  </>
                                )}
                              </DialogActions>
                            </Dialog>
                            <Button
                              variant="outlined"
                              onClick={() => handleBrushClick(row.id)}
                              disabled={loadingBrushIds[row.id]}
                              sx={{
                                position: 'relative',
                                '&::after': arteFinalConfigurados[row.id] ? {
                                  content: '""',
                                  position: 'absolute',
                                  top: '5px',
                                  right: '5px',
                                  width: '10px',
                                  height: '10px',
                                  borderRadius: '50%',
                                  backgroundColor: 'success.main',
                                } : {}
                              }}
                            >
                              {loadingBrushIds[row.id] ? <CircularProgress size={20} /> : <IconBrush />}
                            </Button>
                            <Button
                              variant="contained"
                              color="primary"
                              sx={{
                                backgroundColor: confirmacaoArteFinalConfigurados[row.id] ? 'success.light' : undefined,
                                cursor: confirmacaoArteFinalConfigurados[row.id] ? 'default' : 'pointer',
                                pointerEvents: confirmacaoArteFinalConfigurados[row.id] ? 'none' : 'auto', // Impede cliques quando verde
                                ':hover': confirmacaoArteFinalConfigurados[row.id] ? { backgroundColor: 'unset' } : {},
                              }}
                              onClick={(!confirmacaoArteFinalConfigurados[row.id] && arteFinalConfigurados[row.id]) ? () => handleMakePedido(row) : undefined}
                              disabled={!arteFinalConfigurados[row.id]}
                            >
                              {isLoadingConfirmaPedido ? <CircularProgress size={24} /> : <IconCheck />}
                            </Button>
                            {/* botão para abrir o dialog de pegar o codigo de rastreio */}
                            <Button color="primary" variant="contained" onClick={() => handleOpenDialogEntrega(row.id)} disabled={!hasPedidos}>
                              <IconTruckDelivery />
                            </Button>


                          </Stack>
                        </TableCell>
                      </TableRow>


                      <TableRow>
                        {/* colSpan deve ter o mesmo número que o número de cabeçalhos da tabela, no caso 16 */}
                        <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={16}>
                          <Collapse in={openRow[row.id]} timeout="auto" unmountOnExit>
                            <Box margin={1}>
                              <Table size="small" aria-label="detalhes">
                                <TableBody>
                                  <TableRow>
                                    <TableCell sx={{ border: 'none' }} colSpan={16}>
                                      <strong>Lista de Produtos</strong>
                                      <TableHead>
                                        <TableRow>
                                          <TableCell></TableCell>
                                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none', textAlign: 'center' }}>
                                            quantidade:
                                          </TableCell>
                                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none', textAlign: 'center' }}>
                                            Preço:
                                          </TableCell>
                                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none', textAlign: 'center' }}>
                                            Tamanho:
                                          </TableCell>
                                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none', textAlign: 'center' }}>
                                            Peso:
                                          </TableCell>
                                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none', textAlign: 'center' }}>
                                            Prazo:
                                          </TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {listaProdutos.length > 0 ? (
                                          listaProdutos.map((produto: Produto, index: number) => (
                                            <TableRow key={produto.id || index}>
                                              <TableCell sx={{ fontWeight: 'bold', padding: '8px' }} colSpan={1}>
                                                {produto.nome}
                                              </TableCell>
                                              <TableCell sx={{ padding: '8px', textAlign: 'center' }} colSpan={1}>
                                                {produto.quantidade}
                                              </TableCell>
                                              <TableCell sx={{ padding: '8px', textAlign: 'center' }} colSpan={1}>
                                                {produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                              </TableCell>
                                              <TableCell sx={{ padding: '8px', textAlign: 'center' }} colSpan={1}>
                                                {produto.altura} x {produto.largura} x {produto.comprimento} cm
                                              </TableCell>
                                              <TableCell sx={{ padding: '8px', textAlign: 'center' }} colSpan={1}>
                                                {produto.peso} kg
                                              </TableCell>
                                              <TableCell sx={{ padding: '8px', textAlign: 'center' }} colSpan={1}>
                                                {produto.prazo} dias
                                              </TableCell>
                                            </TableRow>
                                          ))
                                        ) : (
                                          <Typography variant="body2" color="textSecondary">Nenhum produto disponível</Typography>
                                        )}
                                      </TableBody>
                                    </TableCell>
                                  </TableRow>

                                  <TableRow>
                                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                                      Cliente:
                                    </TableCell>
                                    <TableCell sx={{ border: 'none' }} colSpan={1}>{row.nome_cliente}</TableCell>
                                  </TableRow>

                                  {brinde !== null && (
                                    <TableRow>
                                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                                        Brinde:
                                      </TableCell>
                                      <TableCell sx={{ border: 'none' }} colSpan={1}>{brinde}</TableCell>
                                    </TableRow>
                                  )}

                                  {entrega !== null && (
                                    <TableRow>
                                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                                        Data de Entrega:
                                      </TableCell>
                                      <TableCell sx={{ border: 'none' }} colSpan={1}>{entrega}</TableCell>
                                    </TableRow>
                                  )}
                                  {prazo !== null && (
                                    <TableRow>
                                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                                        Prazo:
                                      </TableCell>
                                      <TableCell sx={{ border: 'none' }} colSpan={1}>{prazo}</TableCell>
                                    </TableRow>
                                  )}

                                  {frete !== null && (
                                    <TableRow>
                                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                                        Frete:
                                      </TableCell>
                                      <TableCell sx={{ border: 'none' }} colSpan={1}>{frete}</TableCell>
                                    </TableRow>
                                  )}

                                  {/* Endereço CEP */}
                                  <TableRow>
                                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                                      Endereço CEP:
                                    </TableCell>
                                    <TableCell sx={{ border: 'none' }} colSpan={1}>{row.endereco_cep}</TableCell>
                                  </TableRow>

                                  {/* Endereço */}
                                  <TableRow>
                                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                                      Endereço:
                                    </TableCell>
                                    <TableCell sx={{ border: 'none' }} colSpan={1}>{row.endereco}</TableCell>
                                  </TableRow>

                                  {/* Opção de Entrega */}
                                  <TableRow>
                                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                                      Opção de Entrega:
                                    </TableCell>
                                    <TableCell sx={{ border: 'none' }} colSpan={1}>{row.opcao_entrega}</TableCell>
                                  </TableRow>

                                  {/* Prazo da Opção de Entrega */}
                                  <TableRow>
                                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                                      Prazo da Opção de Entrega:
                                    </TableCell>
                                    <TableCell sx={{ border: 'none' }} colSpan={1}>{row.prazo_opcao_entrega} dias</TableCell>
                                  </TableRow>

                                  {/* Preço da Opção de Entrega */}
                                  <TableRow>
                                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                                      Preço da Opção de Entrega:
                                    </TableCell>
                                    <TableCell sx={{ border: 'none' }} colSpan={1}>
                                      {row.preco_opcao_entrega?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </TableCell>
                                  </TableRow>

                                  {/* Brinde */}
                                  {row.brinde !== null && (
                                    <TableRow>
                                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                                        Brinde:
                                      </TableCell>
                                      <TableCell sx={{ border: 'none' }} colSpan={1}>{row.brinde === 1 ? 'Com Brinde' : 'Sem Brinde'}</TableCell>
                                    </TableRow>
                                  )}

                                  {/* Desconto */}
                                  {row.valor_desconto !== null && (
                                    <>
                                      <TableRow>
                                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                                          Desconto:
                                        </TableCell>
                                        <TableCell sx={{ border: 'none' }} colSpan={1}>Com Desconto</TableCell>
                                      </TableRow>

                                      <TableRow>
                                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                                          Tipo Descontado:
                                        </TableCell>
                                        <TableCell sx={{ border: 'none' }} colSpan={1}>{row.tipo_desconto ?? 'Nenhum'}</TableCell>
                                      </TableRow>

                                      <TableRow>
                                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                                          Valor Descontado:
                                        </TableCell>
                                        <TableCell sx={{ border: 'none' }} colSpan={1}>R$ {row.valor_desconto ?? 'Sem Desconto'}</TableCell>
                                      </TableRow>
                                    </>
                                  )}

                                  {/* Data Antecipação */}
                                  {row.data_antecipa !== null && (
                                    <TableRow>
                                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                                        Data Antecipação:
                                      </TableCell>
                                      <TableCell sx={{ border: 'none' }} colSpan={1}>{row.data_antecipa ?? 'Sem Antecipação'}</TableCell>
                                    </TableRow>
                                  )}

                                  {/* Taxa Antecipação */}
                                  {row.taxa_antecipa !== null && (
                                    <TableRow>
                                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                                        Taxa Antecipação:
                                      </TableCell>
                                      <TableCell sx={{ border: 'none' }} colSpan={1}>R$ {row.taxa_antecipa ?? 'Sem Taxa de Antecipação'}</TableCell>
                                    </TableRow>
                                  )}

                                  {/* Total Orçamento */}
                                  {row.total_orcamento !== null && (
                                    <TableRow>
                                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                                        Total Orçamento:
                                      </TableCell>
                                      <TableCell sx={{ border: 'none' }} colSpan={1}>R$ {row.total_orcamento ?? 'Sem total Definido'}</TableCell>
                                    </TableRow>
                                  )}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Paginação */}
          <Stack spacing={2} mt={2} alignItems="center">
            <Pagination
              count={Math.ceil(dataOrcamentos.total / dataOrcamentos.per_page)}
              page={dataOrcamentos.current_page}
              onChange={handlePageChange}
            />
          </Stack>

          <Dialog open={openEntregaDialog} onClose={handleCloseDialogEntrega}>
            {loadingPedido ? (
              <DialogContent>
                {/* Indicador de loading */}
                <CircularProgress />
              </DialogContent>
            ) : (
              <>
                <DialogTitle>Pedido N° {selectedPedido?.numero_pedido}</DialogTitle>
                <DialogContent>
                  <Stack direction="column" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                    <DialogContentText>Página do rastreio</DialogContentText>
                    <Button
                      variant="contained"
                      color="info"
                      // disabled={!hasEntrega}
                      onClick={() => handleOpenRastreamentoInterno(selectedPedido?.orcamento_id)}
                    >
                      Página do rastreio <IconTruckDelivery style={{ marginLeft: '5px' }} />
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      // disabled={!hasEntrega}
                      sx={{ color: theme.palette.text.primary }}
                      onClick={() => handleOpenRastreamentoCliente(selectedPedido?.orcamento_id)}
                    >
                      Link do rastreio <IconLink style={{ marginLeft: '5px' }} />
                    </Button>
                  </Stack>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={showInput}
                        onChange={(event) => setShowInput(event.target.checked)}
                      />
                    }
                    label="Adicionar Código de rastreio"
                  />
                  {showInput && (
                    <Stack spacing={2} sx={{ mt: 2 }}>
                      <TextField
                        label="Código de Rastreamento"
                        value={inputValueEntrega}
                        onChange={(event) => setInputValueEntrega(event.target.value)}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={hasEntrega}
                        onClick={() => handleSubmmitEntrega(inputValueEntrega)}
                      >
                        Enviar
                      </Button>
                    </Stack>
                  )}

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={showInputPedidosStatus}
                        onChange={(event) => setShowInputPedidosStatus(event.target.checked)}
                      />
                    }
                    label="Aprovar envio ou recebimento do pedido"
                  />
                  {showInputPedidosStatus && (
                    <Stack spacing={2} sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={selectedPedido?.pedido_status_id == 14 || selectedPedido?.pedido_status_id == 15}
                        onClick={() => handleAprovaEnvio(selectedPedido?.id, selectedPedido?.orcamento_id)}
                      >
                        Aprovar envio do pedido à transportadora
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={selectedPedido?.pedido_status_id == 15}
                        onClick={() => handleAprovaRecebimento(selectedPedido?.id, selectedPedido?.orcamento_id)}
                      >
                        Aprovar recebimento do pedido pelo cliente
                      </Button>
                    </Stack>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialogEntrega} color="primary">
                    Fechar
                  </Button>
                </DialogActions>
              </>
            )}
          </Dialog>

        </>
      </ParentCard>
    </PageContainer>
  );
}

export default OrcamentoBackofficeScreen;

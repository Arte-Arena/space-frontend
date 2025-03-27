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
import { Pagination, Stack, Button, Box, Typography, Collapse, FormControlLabel, Checkbox, TextField, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import InputAdornment from '@mui/material/InputAdornment';
import { IconPlus, IconSearch, IconLink, IconShirtSport, IconCheck, IconTrash, IconBrush, IconUser } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { IconTruckDelivery } from '@tabler/icons-react';
import useAprovarPedidoStatus from './components/useAprovarPedidoStatus';
import { logger } from '@/utils/logger';

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
  pedidos: Pedidos[];
}

interface Sketch {
  letter: string;
  quantity: number;
}

const OrcamentoBackofficeScreen = () => {
  const router = useRouter();
  const [query, setQuery] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingTiny, setIsAddingTiny] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [openRow, setOpenRow] = useState<{ [key: number]: boolean }>({});
  const [linkOrcamento, setLinkOrcamento] = useState<string>('');
  const [openLinkDialog, setOpenLinkDialog] = useState<boolean>(false);
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
  const [showInputPeidosStatus, setShowInputPedidosStatus] = useState(false);
  const [inputValueEntrega, setInputValueEntrega] = useState(selectedPedido?.codigo_rastreamento || '');
  const [hasEntrega, setHasEntrega] = useState(false);
  // const [hasEnvio, setHasEnvio] = useState(false);
  // const [HasRecebimento, setHasRecebimento] = useState(false);
  const [loadingPedido, setLoadingPedido] = useState(false);
  const [copiedRastreio, setCopiedRastreio] = useState(false);
  const [handleMakePedidoLoading, setIsLoadingMakePeido] = useState(false);
  const [loadingBrushIds, setLoadingBrushIds] = useState<{[key: number]: boolean}>({});
  const [navigateTo, setNavigateTo] = useState<string | null>(null);
  const [clientesConfigurados, setClientesConfigurados] = useState<{[key: number]: boolean}>({});
  const [uniformesConfigurados, setUniformesConfigurados] = useState<{[key: number]: boolean}>({});
  const [verificandoCliente, setVerificandoCliente] = useState<{[key: number]: boolean}>({});
  const [verificandoUniformes, setVerificandoUniformes] = useState<{[key: number]: boolean}>({});
  const theme = useTheme()

  const regexFrete = /Frete:\s*R\$\s?(\d{1,3}(?:\.\d{3})*,\d{2})\s?\(([^)]+)\)/;
  const regexPrazo = /Prazo de Produção:\s*\d{1,3}\s*dias úteis/;
  const regexEntrega = /Previsão de Entrega:\s*([\d]{1,2} de [a-zA-Z]+ de \d{4})\s?\(([^)]+)\)/;
  const regexBrinde = /Brinde:\s*\d+\s*un\s*[\w\s]*\s*R\$\s*\d{1,3}(?:,\d{2})*\s*\(R\$\s*\d{1,3}(?:,\d{2})*\)/;

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    throw new Error('Access token is missing');
  }

  const handleNovoPedido = () => {
    setIsAdding(true);
    router.push('/apps/producao/arte-final/add/');
  };

  const handleNovoPedidoTiny = () => {
    setIsAddingTiny(true);
    router.push('/apps/producao/arte-final/add-tiny/');
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
    setIsLoadingMakePeido(true);

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/orcamento/backoffice/pedido-cadastro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(orcamentoFormated),
      });

      const responseText = await response.text();
      let data;
      
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (jsonError: any) {
        console.error("Erro ao parsear resposta JSON:", responseText);
        alert(`Erro ao processar resposta do servidor: ${jsonError.message}`);
        setIsLoadingMakePeido(false);
        return;
      }

      setIsLoadingMakePeido(false);

      // Verifique o status dentro de data.retorno
      if (data.retorno && data.retorno.status === "Erro") {
        const registro = data.retorno.registros?.registro;
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
        console.log(data.message || "Erro desconhecido");
        alert(`Erro ao salvar: ${data.message || "Erro desconhecido"}`);
      }

      refetch();
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Ocorreu um erro ao processar o pedido. Verifique o console para mais detalhes.");
      setIsLoadingMakePeido(false);
      refetch();
    }
  };

  const handleSearch = () => {
    setSearchQuery(query); // Atualiza a busca
    setPage(1); // Reseta para a primeira página ao realizar uma nova busca
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

  const handleLinkOrcamento = async (orcamentoId: number) => {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/url/${orcamentoId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (!data.caminho) {
        console.log('Erro: servidor de short URL não disponível');
      } else {
        setLinkOrcamento(`${window.location.origin}/s${data.caminho}`);
        setOpenLinkDialog(true);
      }
    }
  };

  async function handleShortlinkUniform(uniformId: number) {
    setCurrentOrcamentoId(uniformId);
    setApiError(null);
    setIsLinkGenerated(false);
    setIsCheckingUniforms(true);

    try {
      const uniformResponse = await fetch(`${process.env.NEXT_PUBLIC_API}/api/orcamento/uniformes/${uniformId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const uniformData = await uniformResponse.json();

      if (uniformData && uniformData.length > 0) {
        setExistingUniforms(true);
      } else {
        setExistingUniforms(false);
      }
    } catch (error) {
      console.error('Erro ao verificar uniformes existentes:', error);
    } finally {
      setIsCheckingUniforms(false);
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/url/${uniformId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) return console.error('Erro ao criar link do uniforme:', response.status);
    const data = await response.json();
    if (!data.caminho) return console.error(
      'Erro ao criar link do uniforme: servidor de short URL não disponível'
    );
    setLinkUniform(`${window.location.origin}/u${data.caminho}`);
    setOpenUniformDialog(true);
  }

  const handleGenerateAndCopyLink = async () => {
    try {
      setIsGeneratingLink(true);
      setApiError(null);

      for (const sketch of sketches) {
        const uniformData = {
          orcamento_id: currentOrcamentoId,
          esboco: sketch.letter,
          quantidade_jogadores: sketch.quantity,
          configuracoes: []
        };

        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/orcamento/uniformes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(uniformData),
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 422 && data.errors) {
            setApiError(`Erro: Já existe um esboço ${sketch.letter} para este orçamento.`);
          } else {
            setApiError(`Erro ao salvar o esboço ${sketch.letter}: ${data.message || 'Erro desconhecido'}`);
          }
          setIsGeneratingLink(false);
          return;
        }
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
        setNavigateTo(`/apps/producao/arte-final/edit/${data.pedido.id}?block_tiny=${data.blockTiny}`);
      } else {
        throw new Error('Invalid response data');
      }
    } catch (error) {
      logger.error('Erro ao criar pedido:', error);
      alert('Erro ao criar pedido. Por favor, tente novamente.');
      setLoadingBrushIds(prev => ({ ...prev, [id]: false }));
    }
  };

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/orcamento/uniformes/${orcamentoId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const temConfiguracao = data.length > 0 && data.some(
          (uniforme: any) => uniforme.configuracoes && uniforme.configuracoes.length > 0
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
              {isAdding ? 'Adicionando... (apenas Space)' : 'Adicionar pedido (apenas Space)'}
            </Button>
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
                  <TableCell>ID do Pedido</TableCell>
                  <TableCell>Número do Cliente</TableCell>
                  <TableCell>Data de Criação</TableCell>
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
                  console.log(prazo)
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
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Button 
                              variant="outlined"
                              onClick={() => {
                                setOpenLinkDialog(true);
                                handleLinkOrcamento(row.id);
                              }}
                              sx={{ 
                                position: 'relative',
                                '&::after': clientesConfigurados[row.id] ? {
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
                              disabled={verificandoCliente[row.id]}
                            >
                              {verificandoCliente[row.id] ? <CircularProgress size={20} /> : <IconUser />}
                            </Button>
                            <Dialog
                              open={openLinkDialog}
                              onClose={() => setOpenLinkDialog(false)}
                            >
                              <DialogTitle>Link do Orçamento</DialogTitle>
                              <DialogContent>
                                <DialogContentText>
                                  {linkOrcamento}
                                </DialogContentText>
                              </DialogContent>
                              <DialogActions>
                                <Button
                                  onClick={() => {
                                    navigator.clipboard.writeText(linkOrcamento);
                                    setOpenLinkDialog(false);
                                  }}
                                >
                                  Copiar Link
                                </Button>
                              </DialogActions>
                            </Dialog>
                            <Button 
                              variant="outlined" 
                              onClick={() => {
                                setOpenUniformDialog(true);
                                handleShortlinkUniform(row.id);
                              }}
                              sx={{ 
                                position: 'relative',
                                '&::after': uniformesConfigurados[row.id] ? {
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
                              disabled={verificandoUniformes[row.id]}
                            >
                              {verificandoUniformes[row.id] ? <CircularProgress size={20} /> : <IconShirtSport />}
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() => handleBrushClick(row.id)}
                              disabled={loadingBrushIds[row.id]}
                            >
                              {loadingBrushIds[row.id] ? <CircularProgress size={20} /> : <IconBrush />}
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
                                  <Box sx={{ mt: 2, p: 1, bgcolor: 'warning.light', borderRadius: 1 }}>
                                    <Typography variant="body1" color="warning.dark">
                                      Já existem uniformes cadastrados para este orçamento. Não é possível adicionar ou editar esboços.
                                    </Typography>
                                  </Box>
                                ) : (
                                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 2 }}>
                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
                                          setSketches([...sketches, { letter: currentLetter, quantity: currentQuantity }]);
                                          setCurrentLetter('');
                                          setCurrentQuantity(1);
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
                                              <TableCell>Ações</TableCell>
                                            </TableRow>
                                          </TableHead>
                                          <TableBody>
                                            {sketches.map((sketch) => (
                                              <TableRow key={sketch.letter}>
                                                <TableCell>Esboço {sketch.letter}</TableCell>
                                                <TableCell>{sketch.quantity}</TableCell>
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
                                {!existingUniforms ? (
                                  !isLinkGenerated ? (
                                    <Button
                                      onClick={handleGenerateAndCopyLink}
                                      disabled={isGeneratingLink || sketches.length === 0}
                                      startIcon={isGeneratingLink && <CircularProgress size={16} />}
                                    >
                                      {isGeneratingLink ? 'Gerando...' : sketches.length === 0 ? 'Adicione um esboço' : 'Gerar Link'}
                                    </Button>
                                  ) : (
                                    <>
                                      <Typography variant="body2" color="success.main" sx={{ mr: 2 }}>
                                        Link gerado e copiado!
                                      </Typography>
                                      <Button
                                        onClick={() => navigator.clipboard.writeText(linkUniform)}
                                      >
                                        Copiar novamente
                                      </Button>
                                    </>
                                  )
                                ) : (
                                  <>
                                    {linkCopied ? (
                                      <>
                                        <Typography variant="body2" color="success.main" sx={{ mr: 2 }}>
                                          Link copiado!
                                        </Typography>
                                        <Button
                                          onClick={() => {
                                            navigator.clipboard.writeText(linkUniform);
                                            setLinkCopied(true);
                                          }}
                                        >
                                          Copiar novamente
                                        </Button>
                                      </>
                                    ) : (
                                      <Button
                                        onClick={() => {
                                          navigator.clipboard.writeText(linkUniform);
                                          setLinkCopied(true);
                                        }}
                                        variant="outlined"
                                      >
                                        Copiar link existente
                                      </Button>
                                    )}
                                  </>
                                )}
                                <Button onClick={handleDialogClose}>
                                  Fechar
                                </Button>
                              </DialogActions>
                            </Dialog>

                            {/* botão da chamada da api */}
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleMakePedido(row)}
                              disabled={hasPedidos}
                            >
                              {handleMakePedidoLoading ? <CircularProgress /> : <IconCheck />}
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

                                  {/* Texto do Orçamento */}
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
                                        Entrega:
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
                        checked={showInputPeidosStatus}
                        onChange={(event) => setShowInputPedidosStatus(event.target.checked)}
                      />
                    }
                    label="Aprovar envio ou recebimento do pedido"
                  />
                  {showInputPeidosStatus && (
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

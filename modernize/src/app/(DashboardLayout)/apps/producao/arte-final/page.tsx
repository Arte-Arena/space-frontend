'use client';
import React, { useEffect, useState } from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import { ArteFinal, Material, Produto } from './components/types';
import CircularProgress from '@mui/material/CircularProgress';
import { IconPlus, IconEdit, IconEye, IconTrash, IconShirt, IconBrush } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import {
  Typography,
  Grid,
  Stack,
  Button,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  IconButton,
  Collapse,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
  useTheme,
} from "@mui/material";
import { useRouter } from 'next/navigation';
import { GridPaginationModel } from '@mui/x-data-grid';
import { IconPrinter } from '@tabler/icons-react';
import { IconBrandTrello } from '@tabler/icons-react';
import SidePanel from './components/drawer';
import AssignDesignerDialog from './components/designerDialog';
import { ApiResponsePedidosArteFinal } from './components/types';
import { format } from 'date-fns';
import trocarStatusPedido from './components/useTrocarStatusPedido';
import DialogObs from './components/observacaoDialog';
import deletePedidoArteFinal from './components/useDeletePedido';
import { useThemeMode } from '@/utils/useThemeMode';
import atribuirDesigner from './components/useDeisgnerJoin';
import { IconUserPlus } from '@tabler/icons-react';

const ArteFinalScreen = () => {
  const [allPedidos, setAllPedidos] = useState<ArteFinal[]>([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedRowSidePanel, setSelectedRowSidePanel] = useState<ArteFinal | null>(null);
  const [openDialogDesinger, setOpenDialogDesinger] = useState(false);
  const [openDialogObs, setOpenDialogObs] = useState(false);
  const [selectedRowDesinger, setSelectedRowDesinger] = useState<ArteFinal | null>(null);
  const [selectedRowObs, setSelectedRowObs] = useState<ArteFinal | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, { editing: boolean; detailing: boolean }>>({});
  const [openRow, setOpenRow] = useState<{ [key: number]: boolean }>({});
  const [rows, setRows] = useState<ArteFinal[]>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 50,
    page: 0,
  });

  const router = useRouter();
  const theme = useTheme()
  const myTheme = useThemeMode()

  const accessToken = localStorage.getItem('accessToken');
  const designers = localStorage.getItem('designers');
  const roles = localStorage.getItem('roles')?.split(',').map(Number) || [];
  const allowedRoles = [1, 2, 3, 4];
  const DesignerRoles = [6, 7];
  const canShowButton = roles.some(role => allowedRoles.includes(role));
  const canShowButtonDesigner = roles.some(role => DesignerRoles.includes(role));

  const startIndex = paginationModel.page * paginationModel.pageSize;
  const endIndex = startIndex + paginationModel.pageSize;
  const paginatedPedidos = allPedidos.slice(startIndex, endIndex);


  const { data: dataPedidos, isLoading: isLoadingPedidos, isError: isErrorPedidos, refetch } = useQuery<ApiResponsePedidosArteFinal>({
    queryKey: ['pedidos'],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API}/api/producao/get-pedidos-arte-final?fila=D`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }).then((res) => res.json()),
  });

  useEffect(() => {
    if (dataPedidos && dataPedidos.data) { // Verificação adicional
      setAllPedidos(dataPedidos.data);
      console.log(dataPedidos);
    }
  }, [dataPedidos]);

  console.log(allPedidos);

  useEffect(() => {
    if (!openDialogDesinger) {
      refetch(); // Chama refetch quando o dialog é fechado
    }
  }, [openDialogDesinger, refetch]);


  // handles

  const handleNovoPedido = () => {
    setIsAdding(true);
    router.push('/apps/producao/arte-final/add/');
  };

  const handleEdit = (pedido: ArteFinal) => {
    const pedidoId = String(pedido.id);

    setLoadingStates((prev) => ({
      ...prev,
      [pedidoId]: { ...(prev[pedidoId] ?? { editing: false, detailing: false }), editing: true },
    }));

    router.push(`/apps/producao/arte-final/edit/${pedido.id}/`);
  };

  const handleDelete = async (row: ArteFinal) => {
    const sucesso = await deletePedidoArteFinal(row?.id, refetch);
    if (sucesso) {
      console.log("Pedido deletado com sucesso!");
      alert('sucesso');
    } else {
      console.log("Falha ao excluir pedido.");
    }
  };

  const handleLinkTrello = (row: ArteFinal) => {
    if (row.url_trello) {
      window.open(row.url_trello, '_blank');
    } else {
      alert('URL do Trello não disponível');
      console.warn('URL do Trello não disponível');
    }
  };
  const handleListaUniformes = async (row: ArteFinal) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/producao/pedido-arte-final/${row.id}/verificar-uniformes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        router.push(data.redirect);
      } else {
        console.error('Erro ao verificar uniformes:', data.error);
        alert('Erro ao verificar uniformes: ' + data.error);
      }
    } catch (error) {
      console.error('Erro ao verificar uniformes:', error);
      alert('Erro ao verificar uniformes');
    }
  };

  const handleAtribuirDesigner = (row: ArteFinal) => {
    setSelectedRowDesinger(row);
    setOpenDialogDesinger(true);
  };

  const handleEntrarDesigner = async (id: number | undefined) => {
    const resposta = await atribuirDesigner(id, refetch);
    if (resposta) {
      console.log("Designer adicionado com sucesso!");
      alert('sucesso');
    } else {
      console.log("Falha ao atribuir designer.");
    }
  }



  const handleVerDetalhes = (row: ArteFinal) => {
    setSelectedRowSidePanel(row);
    setOpenDrawer(true);
  };

  const handleEnviarImpressora = async (row: ArteFinal) => {
    const confirmar = window.confirm('Deseja enviar o pedido N° ' + row.numero_pedido + ' para Impressão?');

    if (confirmar) {
      const sucesso = await trocarStatusPedido(row?.id, 8, refetch);
      if (sucesso) {
        console.log("Pedido enviado com sucesso!");
        alert('Sucesso');
      } else {
        console.log("Falha ao enviar pedido.");
        alert('Falha ao enviar pedido.');
      }
    } else {
      console.log("Envio cancelado.");
      alert('Envio cancelado.');
    }
  };


  // handles dos selects
  const handleStatusChange = async (row: ArteFinal, status_id: number) => {
    const sucesso = await trocarStatusPedido(row?.id, status_id, refetch);
    if (sucesso) {
      console.log("Pedido enviado com sucesso!");
      alert('sucesso');
    } else {
      console.log("Falha ao enviar pedido.");
    }
  }

  const handleClickOpenDialogObs = async (row: ArteFinal) => {
    // abre o dialog e passa a row
    setSelectedRowObs(row);
    setOpenDialogObs(true);
  };

  const BCrumb = [
    {
      to: "/",
      title: "Home",
    },
    {
      to: "/apps/produção/",
      title: "produção",
    },
    {
      to: "/apps/produção/pedidos",
      title: "Pedidos",
    },
  ];

  useEffect(() => {
    console.log("📌 Estado atualizado - selectedRowIdSidePanel:", selectedRowSidePanel);
  }, [selectedRowSidePanel]);

  // console.log(allPedidos);
  // console.log(designers);

  return (
    <PageContainer title="Produção / Arte - Final" description="Tela de Produção da Arte - Final | Arte Arena">
      <Breadcrumb title="Produção / Arte - Final" items={BCrumb} />
      <ParentCard title="Arte - Final">
        <>
          <Stack direction="row" spacing={1} sx={{ marginBottom: '1em', height: '3em', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={isAdding ? <CircularProgress size={20} /> : <IconPlus />}
              sx={{ height: '100%' }}
              onClick={handleNovoPedido}
              disabled={isAdding}
            >
              {isAdding ? 'Adicionando...' : 'Adicionar Novo pedido'}
            </Button>
          </Stack>

          {isErrorPedidos ? (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
              <Typography variant="body1" color="error">Erro ao carregar pedidos.</Typography>
            </Stack>
          ) : isLoadingPedidos ? (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
              <CircularProgress />
              <Typography variant="body1" sx={{ mt: 1 }}>Carregando pedidos...</Typography>
            </Stack>
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    {/* <TableCell> </TableCell> */}
                    <TableCell align='center' sx={{ width: '5%' }}>N° Pedido</TableCell>
                    <TableCell align='center' sx={{ width: '15%' }}>Produtos</TableCell>
                    <TableCell align='center' sx={{ width: '10%' }}>Previsão de Entrega</TableCell>
                    {/* <TableCell align='center' sx={{ width: '5%' }}>Medida Linear</TableCell> */}
                    <TableCell align='center' sx={{ width: '10%' }}>Designer</TableCell>
                    <TableCell align='center' sx={{ width: '10%' }}>Observação</TableCell>
                    <TableCell align='center' sx={{ width: '10%' }}>Tipo</TableCell>
                    <TableCell align='center' sx={{ width: '10%' }}>Status</TableCell>
                    <TableCell align='center' sx={{ width: '20%' }}>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(paginatedPedidos) && paginatedPedidos.map((row) => {
                    const listaProdutos: Produto[] = row.lista_produtos
                      ? typeof row.lista_produtos === 'string'
                        ? JSON.parse(row.lista_produtos)
                        : row.lista_produtos
                      : [];

                    // definição das datas e atrasos
                    const dataPrevista = row?.data_prevista ? new Date(row?.data_prevista) : null;
                    const dataAtual = new Date();
                    let atraso = false;
                    if (dataPrevista && dataPrevista < dataAtual) {
                      atraso = true;
                    }

                    // definição dos designers
                    const parsedDesigners = typeof designers === 'string' ? JSON.parse(designers) : designers;
                    const usersMap = new Map(
                      Array.isArray(parsedDesigners)
                        ? parsedDesigners.map(designer => [designer.id, designer.name])
                        : []
                    );

                    const getUserNameById = (id: number | null | undefined) => {
                      return id && usersMap.has(id) ? usersMap.get(id) : "Desconhecido";
                    };
                    const designerNome = getUserNameById(row.designer_id);

                    const pedidoTipos = {
                      1: 'Prazo normal',
                      2: 'Antecipação',
                      3: 'Faturado',
                      4: 'Metade/Metade',
                      5: 'Amostra',
                    } as const;

                    const pedidoStatus = {
                      1: { nome: 'Pendente', fila: 'D' },
                      2: { nome: 'Em andamento', fila: 'D' },
                      3: { nome: 'Arte OK', fila: 'D' },
                      4: { nome: 'Em espera', fila: 'D' },
                      5: { nome: 'Cor teste', fila: 'D' },

                      // 8: { nome: 'Pendente', fila: 'I' },
                      // 9: { nome: 'Processando', fila: 'I' },
                      // 10: { nome: 'Renderizando', fila: 'I' },
                      // 11: { nome: 'Impresso', fila: 'I' },
                      // 12: { nome: 'Em Impressão', fila: 'I' },
                      // 13: { nome: 'Separação', fila: 'I' },
                      // 14: { nome: 'Em Transporte', fila: 'E' },
                      // 15: { nome: 'Entregue', fila: 'E' },
                    } as const;

                    const status = pedidoStatus[row.pedido_status_id as keyof typeof pedidoStatus];
                    const tipo = row.pedido_tipo_id && pedidoTipos[row.pedido_tipo_id as keyof typeof pedidoTipos];


                    return (
                      <>
                        {/* colocar as condições de data e de tipos de status e suas cores */}
                        {/* teste usar a theme   */}
                        <TableRow
                          key={row.id}
                          sx={{
                            backgroundColor: atraso
                              ? 'rgba(250, 0, 0, 0.8)' // Prioridade máxima
                              : row.pedido_tipo_id === 2
                                ? 'rgba(205, 92, 92, 0.8)' // indianred com transparência
                                : row.pedido_status_id === 2
                                  ? 'rgba(245, 75, 7, 0.8)' // #f54b07 com transparência
                                  : row.pedido_status_id === 4
                                    ? 'rgba(255, 165, 0, 0.8)' // #ffa500 com transparência
                                    : 'inherit',
                          }}
                        >

                          <TableCell sx={{
                            color: myTheme === 'dark' ? 'white' : 'black' // Branco no modo escuro e azul escuro no claro
                          }}>{String(row.numero_pedido)}</TableCell>

                          {/* Nome de produto */}
                          <TableCell sx={{
                            color: myTheme === 'dark' ? 'white' : 'black' // Branco no modo escuro e azul escuro no claro
                          }} align='center'>
                            {row.lista_produtos?.length > 0
                              ? (
                                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                  {listaProdutos.map((produto, index) => (
                                    <li key={index}>{produto.nome}</li> // Cada produto em uma nova linha
                                  ))}
                                </ul>
                              )
                              : 'N/A'}
                          </TableCell>

                          <TableCell sx={{
                            color: myTheme === 'dark' ? 'white' : 'black' // Branco no modo escuro e azul escuro no claro
                          }} align='center'>
                            {row?.data_prevista ? format(new Date(row?.data_prevista), "dd/MM/yyyy") : "Data inválida"}
                            {atraso && <span> (Atraso)</span>}
                          </TableCell>

                          {designerNome !== 'Desconhecido' ? (
                            <TableCell
                              sx={{
                                color: myTheme === "dark" ? "white" : "black", // Branco no modo escuro e preto no claro
                              }}
                              align="center"
                            >
                              {designerNome}
                            </TableCell>
                          ) : (
                            <TableCell align="center">
                              {canShowButtonDesigner ? (

                                <Button
                                  sx={{
                                    backgroundColor: 'transparent',
                                    borderRadius: '100px',
                                    border: myTheme === 'dark' ? '1px solid white' : '1px solid black',
                                    color: myTheme === 'dark' ? 'white' : 'black',
                                  }}
                                  onClick={() => handleEntrarDesigner(row.id)}
                                >
                                  <IconUserPlus />
                                </Button>
                              ) : (
                                <>
                                  Não Atribuído
                                </>
                              )}
                            </TableCell>
                          )}

                          {/*  */}
                          <TableCell
                            sx={{
                              color: myTheme === 'dark' ? 'white' : 'black' // Branco no modo escuro e azul escuro no claro
                            }}
                            align="center"
                          >
                            {row.observacoes ? (
                              <Button
                                sx={{
                                  background: 'transparent',
                                  color: myTheme === 'dark' ? 'white' : 'black',
                                  borderRadius: '4px',
                                  border: myTheme === 'dark' ? '1px solid white' : '1px solid black',
                                  fontSize: '12px',
                                  whiteSpace: 'nowrap', // Impede que o texto quebre em várias linhas
                                  overflow: 'hidden', // Esconde o texto que ultrapassa o limite do botão
                                  textOverflow: 'ellipsis', // Adiciona "..." ao texto que não cabe
                                  maxWidth: '150px', // Define uma largura máxima para o botão
                                  '&:hover': {
                                    backgroundColor: 'rgba(13, 12, 12, 0.1)', // Cor neutra ao passar o mouse
                                    color: theme.palette.text.secondary, // Cor do texto ao passar o mouse
                                  }
                                }}
                                onClick={() => handleClickOpenDialogObs(row)}
                              >
                                {row.observacoes}
                              </Button>
                            ): (
                              <Button  
                                sx={{
                                  // bordinha e texto em gray
                                  background: 'transparent',
                                  color: myTheme === 'dark' ? 'white' : 'black',
                                  borderRadius: '4px',
                                  border: myTheme === 'dark' ? '1px solid white' : '1px solid black',
                                  fontSize: '12px',
                                  whiteSpace: 'nowrap', // Impede que o texto quebre em várias linhas
                                  overflow: 'hidden', // Esconde o texto que ultrapassa o limite do botão
                                  textOverflow: 'ellipsis', // Adiciona "..." ao texto que não cabe
                                  maxWidth: '150px', // Define uma largura máxima para o botão
                                  '&:hover': {
                                    backgroundColor: 'rgba(13, 12, 12, 0.1)', // Cor neutra ao passar o mouse
                                    color: theme.palette.text.secondary, // Cor do texto ao passar o mouse
                                  }
                                }}
                                onClick={() => handleClickOpenDialogObs(row)}
                              >
                                Adicionar Observação
                              </Button>
                            )}
                          </TableCell>



                          <TableCell sx={{
                            color: myTheme === 'dark' ? 'white' : 'black' // Branco no modo escuro e azul escuro no claro
                          }} align='center'>{tipo ?? 'null'}</TableCell>

                          {/* STATUS (precisa validar qual q role do usuario pra usar ou um ou outro) */}
                          <TableCell sx={{
                            color: myTheme === 'dark' ? 'white' : 'black' // Branco no modo escuro e azul escuro no claro
                          }} align='center'>
                            <select
                              style={{
                                textAlign: 'center',
                                padding: '0px',
                                fontSize: '12px',
                                borderRadius: '4px',
                                border: myTheme === 'dark' ? '1px solid white' : '1px solid black',
                                backgroundColor: 'transparent',
                                color: myTheme === 'dark' ? 'white' : 'black',
                                appearance: 'none',
                                WebkitAppearance: 'none',
                                MozAppearance: 'none',
                                cursor: 'pointer',
                                width: 'auto',
                                boxSizing: 'border-box',  // Para garantir que o padding não quebre a largura
                              }}
                              value={String(row.pedido_status_id)} // O valor precisa ser uma string
                              onChange={(event) => {
                                const newStatus = event.target.value;  // O valor será do tipo string
                                handleStatusChange(row, Number(newStatus)); // Converte para número antes de passar para a função
                              }}
                            >
                              {Object.entries(pedidoStatus).map(([id, status]) => (
                                <option key={id} value={id}>  {/* O 'id' ainda é uma string */}
                                  {status.nome}  {status.fila} {/* Exibe o nome do status */}
                                </option>
                              ))}
                            </select>
                          </TableCell>

                          <TableCell sx={{
                            color: myTheme === 'dark' ? 'white' : 'black' // Branco no modo escuro e azul escuro no claro
                          }} align='center'>
                            <Tooltip title="Ver Detalhes">
                              <IconButton onClick={() => handleVerDetalhes(row)}>
                                <IconEye />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={row.url_trello === null ? "Sem Link do Trello" : "Link Trello"}>
                              <IconButton
                                onClick={() => handleLinkTrello(row)}
                                disabled={row.url_trello === null}
                              >
                                <IconBrandTrello />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Lista de Uniformes">
                              <IconButton onClick={() => handleListaUniformes(row)}>
                                <IconShirt />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Enviar para Impressão!">
                              <IconButton onClick={() => handleEnviarImpressora(row)}>
                                <IconPrinter />
                              </IconButton>
                            </Tooltip>
                            {/* validar a role do user 3,4,1*/}

                            {canShowButton && (
                              <>
                                <Tooltip title="Atribuir Designer">
                                  <IconButton onClick={() => handleAtribuirDesigner(row)}>
                                    <IconBrush />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Editar">
                                  <IconButton onClick={() => handleEdit(row)}>
                                    <IconEdit />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Excluir">
                                  <IconButton onClick={() => handleDelete(row)}>
                                    <IconTrash />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          {/* colSpan deve ter o mesmo número que o número de cabeçalhos da tabela, no caso 16 */}
                          <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                            <Collapse in={openRow[row.id ?? 0]} timeout="auto" unmountOnExit>
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
                                              Tipo:
                                            </TableCell>
                                            <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none', textAlign: 'center' }}>
                                              Material:
                                            </TableCell>
                                            <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none', textAlign: 'center' }}>
                                              Medida linear:
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
                                                  {produto.nome}
                                                </TableCell>
                                                {/* <TableCell sx={{ padding: '8px', textAlign: 'center' }} colSpan={1}>
                                                  {produto.materiais.map((material: Material) => material.material).join(', ')} 
                                                </TableCell> */}
                                                <TableCell sx={{ padding: '8px', textAlign: 'center' }} colSpan={1}>
                                                  {produto.medida_linear}
                                                </TableCell>
                                              </TableRow>
                                            ))
                                          ) : (
                                            <Typography variant="body2" color="textSecondary">Nenhum produto disponível</Typography>
                                          )}
                                        </TableBody>
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })}
                </TableBody>

              </Table >
              <TablePagination
                rowsPerPageOptions={[15, 25, 50]}
                component="div"
                count={allPedidos.length || 0}
                rowsPerPage={paginationModel.pageSize}
                page={paginationModel.page}
                onPageChange={(event, newPage) => setPaginationModel({ ...paginationModel, page: newPage })}
                onRowsPerPageChange={(event) => setPaginationModel({ ...paginationModel, pageSize: parseInt(event.target.value, 10), page: 0 })}
              />
            </TableContainer>
          )}
          {selectedRowDesinger !== null && (
            <AssignDesignerDialog openDialogDesinger={openDialogDesinger} onCloseDialogDesinger={() => setOpenDialogDesinger(false)} row={selectedRowDesinger} refetch={refetch} />
          )}
          <DialogObs openDialogObs={openDialogObs} onCloseDialogObs={() => setOpenDialogObs(false)} row={selectedRowObs} refetch={refetch} />
          <SidePanel openDrawer={openDrawer} onCloseDrawer={() => setOpenDrawer(false)} row={selectedRowSidePanel} refetch={refetch} />
        </>
      </ParentCard>
    </PageContainer>

  );
};

export default ArteFinalScreen;
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
} from "@mui/material";
import { useRouter } from 'next/navigation';
import { GridPaginationModel } from '@mui/x-data-grid';
import { IconPrinter } from '@tabler/icons-react';
import { IconBrandTrello } from '@tabler/icons-react';
import SidePanel from './components/drawer';
import AssignDesignerDialog from './components/designerDialog';
import { ApiResponsePedidosArteFinal } from './components/types';

const ArteFinalScreen = () => {
  const [allPedidos, setAllPedidos] = useState<ArteFinal[]>([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedRowSidePanel, setSelectedRowSidePanel] = useState<ArteFinal | null>(null);
  const [openDialogDesinger, setOpenDialogDesinger] = useState(false);
  const [selectedRowDesinger, setSelectedRowDesinger] = useState<ArteFinal | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, { editing: boolean; detailing: boolean }>>({});
  const [openRow, setOpenRow] = useState<{ [key: number]: boolean }>({});
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 5,
    page: 0,
  });

  const router = useRouter();

  const accessToken = localStorage.getItem('accessToken');
  const designers = localStorage.getItem('designers');


  const { data: dataPedidos, isLoading: isLoadingPedidos, isError: isErrorPedidos, refetch } = useQuery<ApiResponsePedidosArteFinal>({
    queryKey: ['pedidos'],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API}/api/producao/get-pedidos-arte-final`, {
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

    router.push(`/apps/produção/arte-final/edit/${pedido.id}/`);
  };

  const handleDelete = (row: ArteFinal) => {
    console.log("Deletar pedido", row);
  };

  const handleLinkTrello = (row: ArteFinal) => {
    console.log("Deletar pedido", row);
  };
  const handleListaUniformes = (row: ArteFinal) => {
    // provavelmente tem que ver validar se existe uma lista de uniformes nesse pedido
    // unica forma atualmente é pelo 'ocamento_id'
    console.log("Deletar pedido", row);
  };

  const handleAtribuirDesigner = (row: ArteFinal) => {
    setSelectedRowDesinger(row);
    setOpenDialogDesinger(true);
  };

  const handleVerDetalhes = (row: ArteFinal) => {
    setSelectedRowSidePanel(row);
    setOpenDrawer(true);
  };

  const handleEnviarImpressora = (row: ArteFinal) => {
    console.log("handleEnviarImpressora pedido", row);
  };

  // const handleToggleRow = (id: number) => {
  //   setOpenRow(prev => ({ ...prev, [id]: !prev[id] }));
  // };

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
                    <TableCell align='center' sx={{ width: '5%' }}>Número do Pedido</TableCell>
                    <TableCell align='center' sx={{ width: '15%' }}>Produtos</TableCell>
                    <TableCell align='center' sx={{ width: '10%' }}>Prazo Arte Final</TableCell>
                    {/* <TableCell align='center' sx={{ width: '5%' }}>Medida Linear</TableCell> */}
                    <TableCell align='center' sx={{ width: '10%' }}>Desinger</TableCell>
                    <TableCell align='center' sx={{ width: '10%' }}>Observação</TableCell>
                    <TableCell align='center' sx={{ width: '10%' }}>Tipo</TableCell>
                    <TableCell align='center' sx={{ width: '10%' }}>Status</TableCell>
                    <TableCell align='center' sx={{ width: '20%' }}>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(allPedidos) && allPedidos.map((row) => {
                    const listaProdutos: Produto[] = row.lista_produtos
                      ? typeof row.lista_produtos === 'string'
                        ? JSON.parse(row.lista_produtos)
                        : row.lista_produtos
                      : [];

                    // tem que definir aqui o que cada status vai ser em cada row e cada tipo vai ser em cada row.
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
                      8: { nome: 'Pendente', fila: 'I' },
                      9: { nome: 'Processando', fila: 'I' },
                      10: { nome: 'Renderizando', fila: 'I' },
                      11: { nome: 'Impresso', fila: 'I' },
                      12: { nome: 'Em Impressão', fila: 'I' },
                      13: { nome: 'Separação', fila: 'I' },
                      14: { nome: 'Em Transporte', fila: 'E' },
                      15: { nome: 'Entregue', fila: 'E' },
                    } as const;

                    const status = pedidoStatus[row.pedido_status_id as keyof typeof pedidoStatus];
                    const tipo = row.pedido_tipo_id && pedidoTipos[row.pedido_tipo_id as keyof typeof pedidoTipos];


                    return (
                      <>
                        <TableRow
                          key={row.id}
                          sx={{ backgroundColor: row.prioridade === 'Antecipação' || row.prioridade === null ? '#710f17' : 'inherit', }}
                        >
                          {/* <TableCell>
                            <IconButton
                              aria-label="expand row"
                              size="small"
                              onClick={() => handleToggleRow(row.id ?? 0)}
                            >
                              {openRow[row.id ?? 0] ? <KeyboardArrowUpIcon sx={{ fontSize: '15px' }} /> : <KeyboardArrowDownIcon sx={{ fontSize: '15px' }} />}
                            </IconButton>
                          </TableCell> */}

                          <TableCell>{String(row.numero_pedido)}</TableCell>

                          <TableCell align='center'>
                            {row.lista_produtos?.length > 0
                              ? listaProdutos.map((produto) => produto.nome).join(', ')
                              : 'N/A'}
                          </TableCell>

                          <TableCell align='center'>
                            {Number(row.prazo_arte_final)}
                          </TableCell>

                          {/* <TableCell align='center'>{Number(row.medidaLinear) ?? 0}</TableCell> */}
                          <TableCell align='center'>{designerNome ?? 'Não Atribuido'}</TableCell>
                          {/* <TableCell align='center'>{row.situacao ?? ''}</TableCell> */}

                          <TableCell align='center'>{row.observacoes ?? ''}</TableCell>
                          <TableCell align='center'>{tipo ?? 'null'}</TableCell>
                          <TableCell align='center'>{status.nome ?? 'null'}</TableCell>


                          <TableCell align='center'>
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
                            <Tooltip title="Atribuir Designer">
                              <IconButton onClick={() => handleAtribuirDesigner(row)}>
                                <IconBrush />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Enviar para Impressão!">
                              <IconButton onClick={() => handleEnviarImpressora(row)}>
                                <IconPrinter />
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

              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
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
            <AssignDesignerDialog openDialogDesinger={openDialogDesinger} onCloseDialogDesinger={() => setOpenDialogDesinger(false)} row={selectedRowDesinger} refetch={refetch}/>
          )}
          <SidePanel openDrawer={openDrawer} onCloseDrawer={() => setOpenDrawer(false)} row={selectedRowSidePanel} />
        </>
      </ParentCard>
    </PageContainer>

  );
};

export default ArteFinalScreen;
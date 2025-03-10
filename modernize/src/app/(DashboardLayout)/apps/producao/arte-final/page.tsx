'use client';
import React, { useState } from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import { ArteFinal, Data, Material, Produto } from './types';
import CircularProgress from '@mui/material/CircularProgress';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { IconPlus, IconEdit, IconEye, IconTrash, IconLink, IconTiltShift, IconPencilDown, IconShirt, IconEyeCheck, IconBrush } from '@tabler/icons-react';
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
import { DataGrid, GridColDef, GridActionsCellItem, GridPaginationModel, GridRowClassNameParams } from '@mui/x-data-grid';
import { IconPrinter } from '@tabler/icons-react';
import { IconBrandTrello } from '@tabler/icons-react';
import { IconMenu } from '@tabler/icons-react';
import SidePanel from './components/drawer';
import AssignDesignerDialog from './components/desingerDialog';

const ArteFinalScreen = () => {
  const router = useRouter();
  const accessToken = localStorage.getItem('accessToken');
  const [openDrawer, setOpenDrawer] = useState(false); //SidePanel
  const [selectedRowIdDesingerSidePanel, setSelectedRowIdSidePanel] = useState<number | null>(null);//SidePanel
  const [openDialogDesinger, setOpenDialogDesinger] = useState(false); //Dialog Designer
  const [selectedRowIdDesinger, setSelectedRowIdDesinger] = useState<number | null | undefined>(null);//Dialog designer
  const [isAdding, setIsAdding] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, { editing: boolean; detailing: boolean }>>({});
  const [openRow, setOpenRow] = useState<{ [key: number]: boolean }>({});
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 5,
    page: 0,
  });


  const pedidosFalsos = [
    {
      id: 1,
      numero_pedido: '12345',
      prazo_confeccao: '2025-03-20T00:00:00Z',
      prazo_arte_final: '2025-03-20T00:00:00Z',
      situacao: 'antecipacao',
      prioridade: 'Alta',
    },
    {
      id: 2,
      numero_pedido: '67890',
      prazo_confeccao: '2025-04-15T00:00:00Z',
      prazo_arte_final: '2025-04-15T00:00:00Z',
      situacao: 'Aguardando Aprovação',
      prioridade: 'Média',
    },
    {
      id: 3,
      numero_pedido: '11223',
      prazo_confeccao: '2025-05-01T00:00:00Z',
      prazo_arte_final: '2025-05-10T00:00:00Z',
      situacao: 'Finalizado',
      prioridade: 'Baixa',
    },
    {
      id: 4,
      numero_pedido: '44556',
      prazo_confeccao: '2025-06-10T00:00:00Z',
      prazo_arte_final: '2025-06-10T00:00:00Z',
      situacao: 'Em Produção',
      prioridade: 'Alta',
    },
    {
      id: 5,
      numero_pedido: '78901',
      prazo_confeccao: '2025-07-05T00:00:00Z',
      prazo_arte_final: '2025-07-05T00:00:00Z',
      situacao: 'Aguardando Aprovação',
      prioridade: 'Média',
    },
  ];


  const { data: pedidos, isLoading: isLoadingPedidos, isError: isErrorPedidos, isFetching } = useQuery<Data>({
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

  console.log(pedidos);

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
    setSelectedRowIdDesinger(row.id);
    setOpenDialogDesinger(true);
    console.log("handleAtribuirDesigner pedido", row);
  };

  const handleVerDetalhes = (row: ArteFinal) => {
    setOpenDrawer(true);
    console.log("handleVerDetalhes pedido", row);
  };

  const handleEnviarImpressora = (row: ArteFinal) => {
    console.log("handleEnviarImpressora pedido", row);
  };

  const handleOpenDialog = (rowId: number) => {
    setSelectedRowIdDesinger(rowId);
    setOpenDialogDesinger(true);
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
                    <TableCell align='center' sx={{ width: '5%' }}>Medida Linear</TableCell>
                    <TableCell align='center' sx={{ width: '10%' }}>Desinger</TableCell>
                    <TableCell align='center' sx={{ width: '10%' }}>Observação</TableCell>
                    <TableCell align='center' sx={{ width: '10%' }}>Prioridade</TableCell>
                    <TableCell align='center' sx={{ width: '20%' }}>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pedidos?.data.map((row) => {
                    const listaProdutos: Produto[] = row.lista_produtos
                      ? typeof row.lista_produtos === 'string'
                        ? JSON.parse(row.lista_produtos)
                        : row.lista_produtos
                      : [];

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
                            {row.prazo_arte_final
                              ? new Date(row.prazo_arte_final).toLocaleDateString('pt-BR')
                              : new Date().toLocaleDateString('pt-BR')}
                          </TableCell>

                          <TableCell align='center'>{row.medidaLinear ?? 0}</TableCell>
                          <TableCell align='center'>{row.designer ?? 'Não Atribuido'}</TableCell>
                          {/* <TableCell align='center'>{row.situacao ?? ''}</TableCell> */}

                          <TableCell align='center'>{row.observacoes ?? ''}</TableCell>
                          <TableCell align='center'>{row.prioridade ?? 'Antecipação'}</TableCell>

                          <TableCell align='center'>
                            <Tooltip title="Ver Detalhes">
                              <IconButton onClick={() => handleVerDetalhes(row)}>
                                <IconEyeCheck />
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
                                              Materiais:
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
                                                  {produto.tipo_produto}
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
                count={pedidos?.data.length || 0}
                rowsPerPage={paginationModel.pageSize}
                page={paginationModel.page}
                onPageChange={(event, newPage) => setPaginationModel({ ...paginationModel, page: newPage })}
                onRowsPerPageChange={(event) => setPaginationModel({ ...paginationModel, pageSize: parseInt(event.target.value, 10), page: 0 })}
              />
            </TableContainer>
          )}
          {selectedRowIdDesinger !== null && (
            <AssignDesignerDialog openDialogDesinger={openDialogDesinger} onCloseDialogDesinger={() => setOpenDialogDesinger(false)} rowId={selectedRowIdDesinger} />
          )}
          <SidePanel openDrawer={openDrawer} onCloseDrawer={() => setOpenDrawer(false)} rowId={selectedRowIdDesinger}/>
        </>
      </ParentCard>
    </PageContainer>

  );
};

export default ArteFinalScreen;
'use client';
import React, { useEffect, useState } from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import { ArteFinal, Produto } from './components/types';
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
import DialogObs from './components/observacaoDialog';
import { ApiResponsePedidosArteFinal } from './components/types';
import { format } from 'date-fns';
import trocarStatusPedido from './components/useTrocarStatusPedido';
import { useThemeMode } from '@/utils/useThemeMode';

const ConfeccaoScreen = () => {
  const [allPedidos, setAllPedidos] = useState<ArteFinal[]>([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDialogObs, setOpenDialogObs] = useState(false);
  const [selectedRowSidePanel, setSelectedRowSidePanel] = useState<ArteFinal | null>(null);
  const [selectedRowObs, setSelectedRowObs] = useState<ArteFinal | null>(null);
  const [openRow, setOpenRow] = useState<{ [key: number]: boolean }>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, { editing: boolean; detailing: boolean }>>({});
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 50,
    page: 0,
  });

  const router = useRouter();
  const theme = useTheme()
  const myTheme = useThemeMode()

  const accessToken = localStorage.getItem('accessToken');
  const designers = localStorage.getItem('designers');

  const startIndex = paginationModel.page * paginationModel.pageSize;
  const endIndex = startIndex + paginationModel.pageSize;
  const paginatedPedidos = allPedidos.slice(startIndex, endIndex);


  const { data: dataPedidos, isLoading: isLoadingPedidos, isError: isErrorPedidos, refetch } = useQuery<ApiResponsePedidosArteFinal>({
    queryKey: ['pedidos'],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API}/api/producao/get-pedidos-arte-final?fila=C`, {
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

  // console.log(allPedidos);

  // handles
  const handleLinkTrello = (row: ArteFinal) => {
    if (row.url_trello) {
      window.open(row.url_trello, '_blank');
    } else {
      alert('URL do Trello não disponível');
      console.warn('URL do Trello não disponível');
    }
  };

  const handleListaUniformes = (row: ArteFinal) => {
    // provavelmente tem que ver validar se existe uma lista de uniformes nesse pedido
    // unica forma atualmente é pelo 'ocamento_id'
    console.log("Deletar pedido", row);
  };

  const handleVerDetalhes = (row: ArteFinal) => {
    setSelectedRowSidePanel(row);
    setOpenDrawer(true);
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
    <PageContainer title="Produção / Confecção" description="Tela de Produção da Confecção | Arte Arena">
      <Breadcrumb title="Produção / Confecção" items={BCrumb} />
      <ParentCard title="Confecção">
        <>
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
                    <TableCell align='center' sx={{ width: '10%' }}>Data De Entrega</TableCell>
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

                    // tem que definir se as datas são maiores ou não e assim definir se vai ficar vermelho ou não
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
                      // 1: { nome: 'Pendente', fila: 'D' },
                      // 2: { nome: 'Em andamento', fila: 'D' },
                      // 3: { nome: 'Arte OK', fila: 'D' },
                      // 4: { nome: 'Em espera', fila: 'D' },
                      // 5: { nome: 'Cor teste', fila: 'D' },
                      // 6: { nome: 'Em espera', fila: 'D' },
                      // 7: { nome: 'Em espera', fila: 'D' },
                      // 8: { nome: 'Pendente', fila: 'I' },
                      // 9: { nome: 'Processando', fila: 'I' },
                      // 10: { nome: 'Renderizando', fila: 'I' },
                      // 11: { nome: 'Impresso', fila: 'I' },
                      // 12: { nome: 'Em Impressão', fila: 'I' },
                      // 13: { nome: 'Separação', fila: 'I' },

                      14: { nome: 'prensa/clandra', fila: 'C' },
                      15: { nome: 'checagem', fila: 'C' },
                      16: { nome: 'corte/preparaçao', fila: 'C' },
                      17: { nome: 'prateleriera/pendente', fila: 'C' },
                      18: { nome: 'costura/confeccao', fila: 'C' },
                      19: { nome: 'conferencia final', fila: 'C' },
                      20: { nome: 'finalizado', fila: 'C' },
                      21: { nome: 'reposição', fila: 'C' },
                    } as const;

                    const status = pedidoStatus[row.pedido_status_id as keyof typeof pedidoStatus];
                    const tipo = row.pedido_tipo_id && pedidoTipos[row.pedido_tipo_id as keyof typeof pedidoTipos];


                    return (
                      <>
                        {/* colocar as condições de data e de tipos de status e suas cores */}
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


                          <TableCell sx={{
                            color: myTheme === 'dark' ? 'white' : 'black' // Branco no modo escuro e azul escuro no claro
                          }} align='center'>{designerNome ?? 'Não Atribuido'}</TableCell>

                          <TableCell sx={{
                            color: myTheme === 'dark' ? 'white' : 'black' // Branco no modo escuro e azul escuro no claro
                          }} align="center">
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
                              {row.observacoes ?? "Adicionar Observação"}
                            </Button>
                          </TableCell>

                          <TableCell sx={{
                            color: myTheme === 'dark' ? 'white' : 'black' // Branco no modo escuro e azul escuro no claro
                          }} align='center'>{tipo ?? 'null'}</TableCell>

                          {/* STATUS (precisa validar qual q role do usuario pra usar ou um ou outro) */}
                          <TableCell
                            sx={{
                              color: myTheme === 'dark' ? 'white' : 'black' // Branco no modo escuro e azul escuro no claro
                            }}
                            align='center'>
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
                                  {status.nome}
                                  {/* {status.fila} */}
                                </option>
                              ))}
                            </select>
                          </TableCell>


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
                            {/* <Tooltip title="Enviar para Impressão!">
                                                            <IconButton onClick={() => handleEnviarImpressora(row)}>
                                                                <IconPrinter />
                                                            </IconButton>
                                                        </Tooltip> */}
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
                rowsPerPageOptions={[15, 25, 50, 100, 200]}
                component="div"
                count={allPedidos.length || 0}
                rowsPerPage={paginationModel.pageSize}
                page={paginationModel.page}
                onPageChange={(event, newPage) => setPaginationModel({ ...paginationModel, page: newPage })}
                onRowsPerPageChange={(event) => setPaginationModel({ ...paginationModel, pageSize: parseInt(event.target.value, 10), page: 0 })}
              />
            </TableContainer>
          )}
          <SidePanel openDrawer={openDrawer} onCloseDrawer={() => setOpenDrawer(false)} row={selectedRowSidePanel} />
          <DialogObs openDialogObs={openDialogObs} onCloseDialogObs={() => setOpenDialogObs(false)} row={selectedRowObs} refetch={refetch} />
        </>
      </ParentCard>
    </PageContainer>

  );
};

export default ConfeccaoScreen;
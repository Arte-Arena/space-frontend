"use client";
import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Box, Card, CardContent, Typography, useTheme, TextField, Button, InputAdornment, Stack, Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions, FormControlLabel, Checkbox, Select, MenuItem } from "@mui/material";
import useFetchOrcamentos from "@/utils/useGetAllOrcamentos"; 
import { useStatusChangeAprovado, useStatusChangeDesaprovado } from '@/utils/PutStatusOrcamentos';
import { IconSearch } from "@tabler/icons-react";
import CustomTextField from "../forms/theme-elements/CustomTextField";
import useEtapa from "@/utils/useLastStatus";

interface Etapa {
  id: string;
  etapa: string;
  orcamento_id: string;
  user_id: number;
  cliente_octa_number: string;
  nome_cliente: string | null;
  lista_produtos: string | null;
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
  status_aprovacao_arte_arena: string;
  status_aprovacao_cliente: string;
  status_envio_pedido: string;
  status_aprovacao_amostra_arte_arena: string;
  status_envio_amostra: string;
  status_aprovacao_amostra_cliente: string;
  status_faturamento: string;
  status_pagamento: string;
  status_producao_esboco: string;
  status_producao_arte_final: string;
  status_aprovacao_esboco: string;
  status_aprovacao_arte_final: string;
}

interface Column {
  name: string;
  items: Etapa[];
}

interface Columns {
  [key: string]: Column;
}

const initialColumns: Columns = {
  etapa1: {
    name: "Não Aprovado",
    items: [],
  },
  etapa3: {
    name: "Faturamento",
    items: [],
  },
  etapa4: {
    name: "Pagamento",
    items: [],
  },
  etapa5: {
    name: "Produção Arte Final",
    items: [],
  },
  etapa6: {
    name: "Aprovação Arte Final",
    items: [],
  },
  etapa7: {
    name: "Aprovação Amostra Arte Arena",
    items: [],
  },
  etapa8: {
    name: "Envio Amostra",
    items: [],
  },
  etapa9: {
    name: "Aprovação Amostra Cliente",
    items: [],
  },
  etapa10: {
    name: "Aprovação Cliente",
    items: [],
  },
  etapa11: {
    name: "Produção Esboço",
    items: [],
  },
  etapa12: {
    name: "Aprovação esboco",
    items: [],
  },
  etapa13: {
    name: "Envio Pedido",
    items: [],
  },
  etapa2: {
    name: "Aprovação Arte Arena",
    items: [],
  },

};

const KanbanBoard: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [columns, setColumns] = useState<Columns>(initialColumns);
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({});
  const statusMapping: Record<string, { campo: string; valor: string }> = {
    etapa1: { campo: "status", valor: "nao_aprovado" },
    etapa2: { campo: "status_aprovacao_arte_arena", valor: "aprovada" },
    etapa3: { campo: "status_faturamento", valor: "faturado" },
    etapa4: { campo: "status_pagamento", valor: "pago" },
    etapa5: { campo: "status_producao_arte_final", valor: "aguardando_melhoria" },
    etapa6: { campo: "status_aprovacao_arte_final", valor: "aprovada" },
    etapa7: { campo: "status_aprovacao_amostra_arte_arena", valor: "aprovada" },
    etapa8: { campo: "status_envio_amostra", valor: "enviada" },
    etapa9: { campo: "status_aprovacao_amostra_cliente", valor: "aprovada" },
    etapa10: { campo: "status_aprovacao_cliente", valor: "aprovado" },
    etapa11: { campo: "status_producao_esboco", valor: "aguardando_melhoria" },
    etapa12: { campo: "status_aprovacao_esboco", valor: "aprovado" },
    etapa13: { campo: "status_envio_pedido", valor: "enviado" },
  };
  const theme = useTheme();

  const { etapas, loading, error } = useEtapa()

  // Mapeia os orçamentos para as colunas
  useEffect(() => {
    if (etapas && Array.isArray(etapas)) {
      const newColumns: Columns = JSON.parse(JSON.stringify(initialColumns));
      const etapaMapping: Record<string, string> = {
        "": "etapa1",
        "aprovação_arte_arena": "etapa2",
        "status_faturamento": "etapa3",
        "status_pagamento": "etapa4",
        "status_producao_arte_final": "etapa5",
        "status_aprovacao_arte_final": "etapa6",
        "status_aprovacao_amostra_arte_arena": "etapa7",
        "status_envio_amostra": "etapa8",
        "status_aprovacao_amostra_cliente": "etapa9",
        "status_aprovacao_cliente": "etapa10",
        "status_producao_esboco": "etapa11",
        "status_aprovacao_esboco": "etapa12",
        "status_envio_pedido": "etapa13",
      };

      etapas.forEach((etapa) => {
        const columnId = etapaMapping[etapa.etapa];
        if (columnId) {
          newColumns[columnId].items.push(etapa);
        }
      });

      setColumns(newColumns);
    }
  }, [etapas]);

  // Atualiza quando `columns` mudar
  useEffect(() => {
    const initialPages = Object.keys(columns).reduce((acc, columnId) => {
      acc[columnId] = 1;
      return acc;
    }, {} as Record<string, number>);
    setCurrentPage(initialPages);
  }, [columns]);

  //  useEffect(() => {
  //   console.log(dialogData)
  //  }, [dialogData])

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }
    const sourceColumnId = source.droppableId;
    const destColumnId = destination.droppableId;
    const sourceColumn = columns[sourceColumnId];
    const destColumn = columns[destColumnId];
    if (!sourceColumn || !destColumn) return;
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [movedItem] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, movedItem);
    // Atualiza o estado local
    setColumns({
      ...columns,
      [sourceColumnId]: { ...sourceColumn, items: sourceItems },
      [destColumnId]: { ...destColumn, items: destItems },
    });

    // Chama a função para atualizar o status no banco de dados
    handleChangeStatus(movedItem, destColumnId);
    // handleDragEnd();
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

  const handleAprovar = async (campo: string, rowId: string) => {
    try {
      await useStatusChangeAprovado(campo, rowId);
      // refetch();    
    }
    catch (err) {
      console.log(err)
    }
  }

  // tenho que pensar em como fazer esse campo, se faço manualmente um card novo clicavel e vai pra pagina de alterar status de backlog
  //  ou se algo que for dropado na coluna dele automaticamente vai pra pagina de alterar o status pro backlog.

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar as etapas: {error}</div>;

  // arrumar os campos
  const handleChangeStatus = async (orcamento: Etapa, newColumnId: string) => {
    const statusInfo = statusMapping[newColumnId];
    if (!statusInfo) return;

    try {
      setColumns((prevColumns) => {
        const newColumns = { ...prevColumns };
        let movedItem: Etapa | undefined;

        // Encontrar e remover o item da coluna antiga
        Object.keys(newColumns).forEach((colId) => {
          newColumns[colId].items = newColumns[colId].items.filter((item) => {
            if (item.orcamento_id === orcamento.orcamento_id) {
              movedItem = item;
              return false; // Remover o item
            }
            return true; // Manter o item
          });
        });

        // Adicionar o item à nova coluna com o status atualizado
        if (movedItem) {
          newColumns[newColumnId].items.push({
            ...movedItem,
            [statusInfo.campo]: statusInfo.valor,
            updated_at: new Date().toISOString(),
          });
        }

        return newColumns;
      });

      // Chamar a API para atualizar o status no backend
      handleAprovar(statusInfo.campo, orcamento.orcamento_id);

    } catch (err) {
      console.error("Erro ao mudar status:", err);
    }
  };

  // O BUG PARECE ESTAR NO APROVADO ARTE FINAL
  
  return (
    <Box>
      {/*  onDragStart={handleDragStart} */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Stack spacing={1} direction="row" alignItems="center" mb={2} >
          <CustomTextField
            fullWidth
            value={query}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
            onKeyPress={handleSearchKeyPress}
            placeholder="Buscar orçamento..."
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


        <Box id="container" display="flex" gap={2} p={2} sx={{ marginLeft: '10px', overflowX: 'auto', display: 'flex', gap: 2, width: '100%', whiteSpace: 'nowrap' }}>
          {Object.entries(columns).map(([columnId, column]) => {
            const paginatedItems = column.items?.slice(
              ((currentPage[columnId] || 1) - 1) * 10,
              (currentPage[columnId] || 1) * 10
            ) || [];

            // console.log("Itens da coluna", columnId, paginatedItems, column);  
            return (
              <Box key={columnId} sx={{ overflowY: 'initial' }}>
                <Droppable key={columnId} droppableId={columnId} isDropDisabled={false}>
                  {(provided) => (
                    <Box
                      className='component'
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{
                        width: '270px',
                        height: '70vh',
                        overflowY: 'scroll',
                        background: theme.palette.background.paper,
                        padding: 2,
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                      }}
                    >
                      <Typography variant="h6" sx={{ textAlign: "start", paddingRight: 2, mb: 0.1, color: theme.palette.text.primary, overflow: "hidden", overflowWrap: 'break-word', wordBreak: 'break-word', whiteSpace: 'normal', hyphens: 'auto', paddingBottom: '8%' }}>
                        {column.name}
                      </Typography>
                      {/* box dos itens */}
                      <Box
                        sx={{
                          overflowX: 'hidden',
                          overflowY: 'auto', // Scroll vertical
                          paddingRight: 1, // Espaço para evitar sobreposição com a barra de scroll
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                          width: '100%',
                          '&::-webkit-scrollbar': { width: '8px' },
                        }}
                      >

                        {paginatedItems.map((item, index) => {
                          const itemId = item.orcamento_id.toString();
                          const total = item.total_orcamento;
                          let statusEtapa = '';

                          if (item.etapa == 'status_aprovacao_amostra_arte_arena') {
                            statusEtapa = item.status_aprovacao_amostra_arte_arena
                          }
                          if (item.etapa == 'status_aprovacao_amostra_cliente') {
                            statusEtapa = item.status_aprovacao_amostra_cliente
                          }
                          if (item.etapa == 'status_aprovacao_arte_arena') {
                            statusEtapa = item.status_aprovacao_arte_arena
                          }
                          if (item.etapa == 'status_aprovacao_arte_final') {
                            statusEtapa = item.status_aprovacao_arte_final
                          }
                          if (item.etapa == 'status_aprovacao_cliente') {
                            statusEtapa = item.status_aprovacao_cliente
                          }
                          if (item.etapa == 'status_aprovacao_esboco') {
                            statusEtapa = item.status_aprovacao_esboco
                          }
                          if (item.etapa == 'status_envio_amostra') {
                            statusEtapa = item.status_envio_amostra
                          }
                          if (item.etapa == 'status_envio_pedido') {
                            statusEtapa = item.status_envio_pedido
                          }
                          if (item.etapa == 'status_faturamento') {
                            statusEtapa = item.status_faturamento
                          }
                          if (item.etapa == 'status_pagamento') {
                            statusEtapa = item.status_pagamento
                          }
                          if (item.etapa == 'status_producao_arte_final') {
                            statusEtapa = item.status_producao_arte_final
                          }
                          if (item.etapa == 'status_producao_esboco') {
                            statusEtapa = item.status_producao_esboco
                          }

                          console.log("item: ", item)

                          return (
                            <Draggable key={itemId} draggableId={itemId} index={index} isDragDisabled={false}>
                              {(provided) => (
                                <Card

                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  sx={{ marginBottom: 1, background: theme.palette.background.default, padding: 0, width: '100%', minHeight: '35%' }}
                                >
                                  {/* <button style={{backgroundColor: 'transparent', border: '0', cursor: 'pointer'}} onClick={() => handleOpenDialog(statusKey, item.id, statusAprovado)}> */}
                                  <CardContent sx={{ textAlign: 'start', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', }}>
                                    <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                                      #{itemId}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: theme.palette.text.primary, marginY: '5px' }}>
                                      R${total}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: theme.palette.text.primary, overflowWrap: 'break-word', wordBreak: 'break-word', whiteSpace: 'normal', hyphens: 'auto' }}>
                                      <b>{item.etapa.replace(/status/g, '').replace(/_/g, ' ')}</b> <br></br>{statusEtapa}
                                    </Typography>
                                  </CardContent>
                                  {/* </button> */}
                                </Card>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </Box>

                      {/* DIALOG DO CARD (QUANDO PARTAR O CARD ELE ABRE O DIALOG COM AS INFOS) igual o trello*/}
                      {/* <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                    <DialogTitle>Alterar Status #{dialogData?.rowId}</DialogTitle>
                    <DialogContent>
                      <DialogContentText>Selecione a ação desejada para o status:</DialogContentText>

                      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        <FormControlLabel
                          control={<Checkbox checked={isAprovar} onChange={handleAprovarChange} />}
                          label="Aprovar"
                        /> */}
                      {/* <FormControlLabel
                          control={<Checkbox checked={isDesaprovar} onChange={handleDesaprovarChange} />}
                          label="Desaprovar"
                        /> */}
                      {/* </Stack>
                      
                      {isAprovar && (
                        <>
                        <Select
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          displayEmpty
                          fullWidth
                          sx={{ mt: 2 }}
                        >
                          {Object.entries(statusOptions)
                          .filter(([key, value]) => dialogData?.approvedValue !== value.aprovado) // Filtra os itens
                          .map(([key, value]) => (
                            <MenuItem key={key} value={key}>
                              {key}
                            </MenuItem>
                          ))}
                        </Select>
                        <Button 
                            onClick={() => {
                              console.log(dialogData?.statusKey);
                               if(dialogData?.statusKey === "status_aprovacao_arte_arena"){
                                   handleAprovarArteArena(dialogData.rowId);
                               }
                              
                               if (dialogData) {
                                 handleAprovar(dialogData.statusKey, dialogData.rowId);
                               }

                               handleCloseDialog();
                              }}
                            color="primary" sx={{ mt: 1}}>
                          Aprovar
                        </Button>
                      </>
                      )}
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseDialog} color="primary">
                        Fechar
                      </Button>
                    </DialogActions>
                  </Dialog> */}


                      {/* <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
                  <Button
                    disabled={currentPage[columnId] === 1}
                    onClick={() => setCurrentPage((prev) => ({ ...prev, [columnId]: prev[columnId] - 1 }))}
                  >
                    Anterior
                  </Button>

                  <Button
                    disabled={(currentPage[columnId] * 10) >= column.items.length}
                    onClick={() => setCurrentPage((prev) => ({ ...prev, [columnId]: prev[columnId] + 1 }))}
                  >
                    Próxima
                  </Button>
                  </Box> */}


                    </Box>
                  )}
                </Droppable>
              </Box>
            );
          })}
        </Box>
      </DragDropContext>
    </Box>
  );
};

export default KanbanBoard;
"use client";
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Box, Card, CardContent, Typography, useTheme, TextField, Button, InputAdornment, Stack, Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions, FormControlLabel, Checkbox, Select, MenuItem } from "@mui/material";
import useFetchOrcamentos from "@/utils/useGetAllOrcamentos"; // Importe o hook
import { useStatusChangeAprovado, useStatusChangeDesaprovado } from '@/utils/PutStatusOrcamentos';
import { IconSearch } from "@tabler/icons-react";
import CustomTextField from "../forms/theme-elements/CustomTextField";
import StatusArray from "./statusArray";

interface Orcamento {
  id: number;
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
  items: Orcamento[];
}

interface Columns {
  [key: string]: Column;
}

const initialColumns: Columns = {
  etapa1: {
    name: "Não Aprovado",
    items: [],
  },
  etapa2: {
    name: "Aprovação Arte Arena",
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

};

const KanbanBoard: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [columns, setColumns] = useState<Columns>(initialColumns);
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({});
  const theme = useTheme();
  const [isAprovar, setIsAprovar] = useState(false);
  const [isDesaprovar, setIsDesaprovar] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Status");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<{
    statusKey: string;
    rowId: number;
    approvedValue: string;
  } | null>(null);
  
  // busca os tipos de status
  const statusOptions = StatusArray || {};

  // Busca os orçamentos da API
  const { data, isLoading, isError, refetch} = useFetchOrcamentos(searchQuery, page);

  // Mapeia os orçamentos para as colunas
  useEffect(() => {
    console.log('dados: ', data)
    if (Array.isArray(data)) {
      // const newColumns = { ...initialColumns };
      const newColumns: Columns = JSON.parse(JSON.stringify(initialColumns));

      // valida para os ultimos campos adicionados como aprovados.
      data.forEach((orcamento) => {
        if(orcamento.status !== "aprovado" &&
          orcamento.status_faturamento !== "faturado" &&
          orcamento.status_pagamento !== "pago" && 
          orcamento.status_producao_arte_final !== "aguardando_melhoria" &&
          orcamento.status_aprovacao_arte_final !== "aprovada" &&
          orcamento.status_aprovacao_amostra_arte_arena !== "aprovada" &&
          orcamento.status_envio_amostra !== "enviada" &&
          orcamento.status_aprovacao_amostra_cliente !== "aprovada" &&
          orcamento.status_aprovacao_cliente !== "aprovado" &&
          orcamento.status_producao_esboco !== "aguardando_melhoria" &&
          orcamento.status_aprovacao_esboco !== "aprovado" &&
          orcamento.status_envio_pedido !== "enviado"
        ){
          newColumns.etapa1.items.push(orcamento);
        }

        if(orcamento.status == "aprovado"){
          newColumns.etapa2.items.push(orcamento);
        }
        
        if(orcamento.status_faturamento == "faturado" &&
          orcamento.status_pagamento !== "pago" && 
          orcamento.status_producao_arte_final !== "aguardando_melhoria" &&
          orcamento.status_aprovacao_arte_final !== "aprovada" &&
          orcamento.status_aprovacao_amostra_arte_arena !== "aprovada" &&
          orcamento.status_envio_amostra !== "enviada" &&
          orcamento.status_aprovacao_amostra_cliente !== "aprovada" &&
          orcamento.status_aprovacao_cliente !== "aprovado" &&
          orcamento.status_producao_esboco !== "aguardando_melhoria" &&
          orcamento.status_aprovacao_esboco !== "aprovado" &&
          orcamento.status_envio_pedido !== "enviado"
        )
        {
          newColumns.etapa3.items.push(orcamento);
        }

        if(orcamento.status_pagamento == "pago" && 
          orcamento.status_producao_arte_final !== "aguardando_melhoria" &&
          orcamento.status_aprovacao_arte_final !== "aprovada" &&
          orcamento.status_aprovacao_amostra_arte_arena !== "aprovada" &&
          orcamento.status_envio_amostra !== "enviada" &&
          orcamento.status_aprovacao_amostra_cliente !== "aprovada" &&
          orcamento.status_aprovacao_cliente !== "aprovado" &&
          orcamento.status_producao_esboco !== "aguardando_melhoria" &&
          orcamento.status_aprovacao_esboco !== "aprovado" &&
          orcamento.status_envio_pedido !== "enviado" &&
          orcamento.status_faturamento !== "faturado"
        ){
          newColumns.etapa4.items.push(orcamento);
        }
        
        if(orcamento.status_producao_arte_final == "aguardando_melhoria" &&
          orcamento.status_pagamento !== "pago" && 
          orcamento.status_aprovacao_arte_final !== "aprovada" &&
          orcamento.status_aprovacao_amostra_arte_arena !== "aprovada" &&
          orcamento.status_envio_amostra !== "enviada" &&
          orcamento.status_aprovacao_amostra_cliente !== "aprovada" &&
          orcamento.status_aprovacao_cliente !== "aprovado" &&
          orcamento.status_producao_esboco !== "aguardando_melhoria" &&
          orcamento.status_aprovacao_esboco !== "aprovado" &&
          orcamento.status_envio_pedido !== "enviado" &&
          orcamento.status_faturamento !== "faturado" 
        ){
          newColumns.etapa5.items.push(orcamento);
        }
        
        if(orcamento.status_aprovacao_arte_final == "aprovada" &&
          orcamento.status_pagamento !== "pago" && 
          orcamento.status_producao_arte_final !== "aguardando_melhoria" &&
          orcamento.status_aprovacao_amostra_arte_arena !== "aprovada" &&
          orcamento.status_envio_amostra !== "enviada" &&
          orcamento.status_aprovacao_amostra_cliente !== "aprovada" &&
          orcamento.status_aprovacao_cliente !== "aprovado" &&
          orcamento.status_producao_esboco !== "aguardando_melhoria" &&
          orcamento.status_aprovacao_esboco !== "aprovado" &&
          orcamento.status_envio_pedido !== "enviado" &&
          orcamento.status_faturamento !== "faturado"
        ){
          newColumns.etapa6.items.push(orcamento);
        }

        if(orcamento.status_aprovacao_amostra_arte_arena == "aprovada" &&
          orcamento.status_pagamento !== "pago" && 
          orcamento.status_producao_arte_final !== "aguardando_melhoria" &&
          orcamento.status_aprovacao_arte_final !== "aprovada" &&
          orcamento.status_envio_amostra !== "enviada" &&
          orcamento.status_aprovacao_amostra_cliente !== "aprovada" &&
          orcamento.status_aprovacao_cliente !== "aprovado" &&
          orcamento.status_producao_esboco !== "aguardando_melhoria" &&
          orcamento.status_aprovacao_esboco !== "aprovado" &&
          orcamento.status_envio_pedido !== "enviado" &&
          orcamento.status_faturamento !== "faturado"
        ){
          newColumns.etapa7.items.push(orcamento);
        }
        
        if(orcamento.status_envio_amostra == "enviada" && 
          orcamento.status_pagamento !== "pago" && 
          orcamento.status_producao_arte_final !== "aguardando_melhoria" &&
          orcamento.status_aprovacao_arte_final !== "aprovada" &&
          orcamento.status_aprovacao_amostra_arte_arena !== "aprovada" &&
          orcamento.status_aprovacao_amostra_cliente !== "aprovada" &&
          orcamento.status_aprovacao_cliente !== "aprovado" &&
          orcamento.status_producao_esboco !== "aguardando_melhoria" &&
          orcamento.status_aprovacao_esboco !== "aprovado" &&
          orcamento.status_envio_pedido !== "enviado" &&
          orcamento.status_faturamento !== "faturado"
        ){
          newColumns.etapa8.items.push(orcamento);
        }

        if(orcamento.status_aprovacao_amostra_cliente == "aprovada" && 
          orcamento.status_pagamento !== "pago" && 
          orcamento.status_producao_arte_final !== "aguardando_melhoria" &&
          orcamento.status_aprovacao_arte_final !== "aprovada" &&
          orcamento.status_aprovacao_amostra_arte_arena !== "aprovada" &&
          orcamento.status_envio_amostra !== "enviada" &&
          orcamento.status_aprovacao_cliente !== "aprovado" &&
          orcamento.status_producao_esboco !== "aguardando_melhoria" &&
          orcamento.status_aprovacao_esboco !== "aprovado" &&
          orcamento.status_envio_pedido !== "enviado" &&
          orcamento.status_faturamento !== "faturado"
        ){
          newColumns.etapa9.items.push(orcamento);
        }

        if(orcamento.status_aprovacao_cliente == "aprovado" && 
          orcamento.status_pagamento !== "pago" && 
          orcamento.status_producao_arte_final !== "aguardando_melhoria" &&
          orcamento.status_aprovacao_arte_final !== "aprovada" &&
          orcamento.status_aprovacao_amostra_arte_arena !== "aprovada" &&
          orcamento.status_envio_amostra !== "enviada" &&
          orcamento.status_aprovacao_amostra_cliente !== "aprovada" &&
          orcamento.status_producao_esboco !== "aguardando_melhoria" &&
          orcamento.status_aprovacao_esboco !== "aprovado" &&
          orcamento.status_envio_pedido !== "enviado" &&
          orcamento.status_faturamento !== "faturado"
        ){
          newColumns.etapa10.items.push(orcamento);
        }
        
        if(orcamento.status_producao_esboco == "aguardando_melhoria" && 
          orcamento.status_pagamento !== "pago" && 
          orcamento.status_producao_arte_final !== "aguardando_melhoria" &&
          orcamento.status_aprovacao_arte_final !== "aprovada" &&
          orcamento.status_aprovacao_amostra_arte_arena !== "aprovada" &&
          orcamento.status_envio_amostra !== "enviada" &&
          orcamento.status_aprovacao_amostra_cliente !== "aprovada" &&
          orcamento.status_aprovacao_cliente !== "aprovado" &&
          orcamento.status_aprovacao_esboco !== "aprovado" &&
          orcamento.status_envio_pedido !== "enviado" &&
          orcamento.status_faturamento !== "faturado"
        ){
          newColumns.etapa11.items.push(orcamento);
        }

        if(orcamento.status_aprovacao_esboco == "aprovado" && 
          orcamento.status_pagamento !== "pago" && 
          orcamento.status_producao_arte_final !== "aguardando_melhoria" &&
          orcamento.status_aprovacao_arte_final !== "aprovada" &&
          orcamento.status_aprovacao_amostra_arte_arena !== "aprovada" &&
          orcamento.status_envio_amostra !== "enviada" &&
          orcamento.status_aprovacao_amostra_cliente !== "aprovada" &&
          orcamento.status_aprovacao_cliente !== "aprovado" &&
          orcamento.status_producao_esboco !== "aguardando_melhoria" &&
          orcamento.status_envio_pedido !== "enviado" &&
          orcamento.status_faturamento !== "faturado"
        ){
          newColumns.etapa12.items.push(orcamento);
        }

        if(orcamento.status_envio_pedido == "enviado"){
          newColumns.etapa13.items.push(orcamento);
        }

      });

      setColumns(newColumns);
    }
  }, [data]);

  // Atualiza quando `columns` mudar
  useEffect(() => {
    const initialPages = Object.keys(columns).reduce((acc, columnId) => {
       acc[columnId] = 1;
       return acc;
    }, {} as Record<string, number>);
    setCurrentPage(initialPages);
 }, [columns]);

 useEffect(() => {
  console.log(dialogData)
 }, [dialogData])

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
    // handleChangeStatus(movedItem, destColumnId);
  };

  const handleSearch = () => {
    setSearchQuery(query); // Atualiza a busca
    setPage(1); // Reseta para a primeira página ao realizar uma nova busca
    refetch()
  };

  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };
  
  const handleAprovar = async (campo: string, rowId: number) =>{
    try{
      await useStatusChangeAprovado(campo, rowId);
      refetch();    
    }
    catch(err){
      console.log(err)
    }
  }

  const handleAprovarArteArena = (rowId: number) => {
    window.open(`/apps/orcamento/aprovar/${rowId}`, '_blank');
  };

  const handleDesaprovar = async (campo: string, rowId: number) =>{
    try{
      await useStatusChangeDesaprovado(campo, rowId);
      refetch();
    }catch(err){
      console.log(err)
    }
  }

  const handleOpenDialog = (statusKey: string, rowId: number, approvedValue: string) => {
    setDialogData({ statusKey, rowId, approvedValue });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogData(null);
  };
  

  const handleAprovarChange = () => {
    setIsAprovar(!isAprovar);
    setIsDesaprovar(false); // Desmarca "Desaprovar" ao selecionar "Aprovar"
  };

  const handleDesaprovarChange = () => {
    setIsDesaprovar(!isDesaprovar);
    setIsAprovar(false); // Desmarca "Aprovar" ao selecionar "Desaprovar"
  };


// arrumar os campos
  // const handleChangeStatus = async (orcamento: Orcamento, newColumnId: string) => {
  //   const statusMap: Record<string, { campo: string; valor: string }> = {
  //     etapa1: { campo: "status_producao_esboco", valor: "aguardando_melhoria" },
  //     etapa2: { campo: "status_aprovacao_arte_arena", valor: "aprovada" },
  //     etapa3: { campo: "status_envio_pedido", valor: "enviado" },
  //     etapa4: { campo: "status_faturamento", valor: "faturado" },
  //     etapa5: { campo: "status_pagamento", valor: "pago" },
  //   };
  
  //   const statusInfo = statusMap[newColumnId];
  //   if (!statusInfo) return;
  
  //   try {
  //     // Chama a API para atualizar o status no backend
  //     await useStatusChangeAprovado(statusInfo.campo, orcamento.id);
  
  //     // Atualiza o estado da tela com o novo status
  //     setColumns((prevColumns) => {
  //       const newColumns = JSON.parse(JSON.stringify(prevColumns));
  
  //       // Remove o item da coluna atual
  //       Object.keys(newColumns).forEach((colId) => {
  //         newColumns[colId].items = newColumns[colId].items.filter((item: { id: number; }) => item.id !== orcamento.id);
  //       });
  
  //       // Adiciona na nova coluna
  //       newColumns[newColumnId].items.push({
  //         ...orcamento,
  //         [statusInfo.campo]: statusInfo.valor, // Atualiza o status no item
  //       });
  
  //       return newColumns;
  //     });
  
  //     refetch(); // Recarrega os dados do backend
  //   } catch (err) {
  //     console.log("Erro ao mudar status:", err);
  //   }
  // };
  

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Stack spacing={1} direction="row" alignItems="center" mb={2}>
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
      <Box display="flex" gap={2} p={2} sx={{marginLeft: '10px', overflow: 'auto', overflowX: 'auto',}}>
        {Object.entries(columns).map(([columnId, column]) => {
          const paginatedItems = column.items?.slice(
            ((currentPage[columnId] || 1) - 1) * 10,
            (currentPage[columnId] || 1) * 10
         ) || [];

          // paginação
          // const handlePageChange = (_: React.ChangeEvent<unknown> | null, newPage: number) => {
          //   setCurrentPage((prev) => ({ ...prev, [columnId]: newPage }));
          //   refetch(); // Atualiza os dados sempre que a página mudar
          // };

          console.log("Itens da coluna", columnId, paginatedItems, column);
          return (
            <Box sx={{overflowY: 'initial'}}>
            <Droppable key={columnId} droppableId={columnId} isDropDisabled={true}>
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    width: '210px',
                    height: 'auto',
                    background: theme.palette.background.paper,
                    padding: 2,
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="h6" sx={{ textAlign: "center", mb: 2, color: theme.palette.text.primary, overflow: "hidden", textOverflow: "ellipsis", }}>
                    {column.name}
                  </Typography>
                  {paginatedItems.map((item, index) => {
                    const itemId = item.id.toString();

                    let statusAprovado = item.status || "Não Aprovado";
                    let statusKey = "Status";

                    if(item.status_aprovacao_arte_arena == "aprovado"){
                      statusAprovado = item.status_aprovacao_arte_arena;
                      statusKey = 'status_aprovacao_arte_arena';
                    }
                    
                    if(item.status_faturamento == "faturado"){
                      statusAprovado = item.status_faturamento;
                      statusKey = 'status_faturamento';
                    }
                    if(item.status_pagamento == "pago"){
                      statusAprovado = item.status_pagamento;
                      statusKey = 'status_pagamento';
                    }

                    if(item.status_producao_arte_final == "aguardando_melhoria"){
                      statusAprovado = item.status_producao_arte_final;
                      statusKey = 'status_producao_arte_final';
                    }
                    if(item.status_aprovacao_arte_final == "aprovada"){
                      statusAprovado = item.status_aprovacao_arte_final;
                      statusKey = 'status_aprovacao_arte_final';
                    }

                    if(item.status_aprovacao_amostra_arte_arena == "aprovada"){
                      statusAprovado = item.status_aprovacao_amostra_arte_arena;
                      statusKey = 'status_aprovacao_amostra_arte_arena';
                    }
                    if(item.status_envio_amostra == "enviada"){
                      statusAprovado = item.status_envio_amostra;
                      statusKey = 'status_envio_amostra';
                    }
                    if(item.status_aprovacao_amostra_cliente == "aprovada"){
                      statusAprovado = item.status_aprovacao_arte_arena;
                      statusKey = 'status_aprovacao_arte_arena';
                    }

                    if(item.status_aprovacao_cliente == "aprovado"){
                      statusAprovado = item.status_aprovacao_cliente;
                      statusKey = 'status_aprovacao_arte_arena';
                    }

                    if(item.status_producao_esboco == "aguardando_melhoria"){
                      statusAprovado = item.status_producao_esboco;
                      statusKey = 'status_producao_esboco';
                    }
                    if(item.status_aprovacao_esboco == "aprovado"){
                      statusAprovado = item.status_aprovacao_esboco;
                      statusKey = 'status_aprovacao_esboco';
                    }

                    if(item.status_envio_pedido == "enviado"){
                      statusAprovado = item.status_envio_pedido;
                      statusKey = 'status_aprovacao_arte_arena';

                    }

                    const clienteNome = item.nome_cliente;

                    return (
                      <Draggable key={itemId} draggableId={itemId} index={index} isDragDisabled={true}>
                        {(provided) => (
                          <Card
                          ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{ marginBottom: 2, background: theme.palette.background.default, padding: 0}}
                          >
                          {/* VAI SER AQUI QUE VAI TER A LOGICA DE PASSAR PRA UM STATUS OU OUTRO */}
                          <button style={{backgroundColor: 'transparent', border: '0', cursor: 'pointer'}} onClick={() => handleOpenDialog(statusKey, item.id, statusAprovado)}>
                            <CardContent sx={{textAlign: 'center'}}>
                              <Typography variant="body1" sx={{ color: theme.palette.text.primary}}>
                                #{itemId}
                              </Typography>
                              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 1 }}>
                                {clienteNome}
                              </Typography>
                              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 1, paddingX: '20px' }}>
                                Status {column.name}: {statusAprovado = statusAprovado === "aguardando_melhoria" ? "aguardando melhoria" : statusAprovado}
                              </Typography>
                            </CardContent>
                            </button>
                          </Card>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}

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
  );
};

export default KanbanBoard;
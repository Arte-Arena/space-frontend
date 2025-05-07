"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  Divider,
  Stack,
  Tooltip,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import {
  IconPlus,
  IconTrash,
  IconEdit,
  IconGripVertical,
  IconX,
  IconUser,
  IconPhone,
  IconMail,
  IconId,
  IconBuilding,
  IconEye,
  IconChevronDown,
} from "@tabler/icons-react";
import "simplebar-react/dist/simplebar.min.css";
import LeadSearchDialog from "./LeadSearchDialog";

interface LeadCardData {
  nome?: string;
  email?: string;
  telefone?: string;
  status?: string;
  origem?: string;
  id?: string;
  orcamento_id?: string;
  cpfCnpj?: string;
  jaCadastrado?: boolean;
  [key: string]: any;
}

interface Item {
  id: string;
  content: string;
  parsedData?: LeadCardData;
}

interface Column {
  id: string;
  title: string;
  items: Item[];
}

interface BoardProps {
  board: {
    id: string;
    name: string;
    cardType: string;
    columns: Column[];
  };
  onBoardUpdate?: (
    updatedBoard: BoardProps["board"],
    action: string,
    details: string,
  ) => void;
}

const Board: React.FC<BoardProps> = ({ board, onBoardUpdate }) => {
  const [columns, setColumns] = useState<Column[]>(board.columns);
  const [isAddColumnDialogOpen, setIsAddColumnDialogOpen] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [isEditColumnDialogOpen, setIsEditColumnDialogOpen] = useState(false);
  const [currentEditColumn, setCurrentEditColumn] = useState<Column | null>(
    null,
  );
  const [editColumnTitle, setEditColumnTitle] = useState("");
  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false);
  const [isLeadSearchDialogOpen, setIsLeadSearchDialogOpen] = useState(false);
  const [newCardContent, setNewCardContent] = useState("");
  const [currentColumnForCard, setCurrentColumnForCard] = useState<
    string | null
  >(null);
  const [selectedCard, setSelectedCard] = useState<Item | null>(null);
  const [isCardDetailsDialogOpen, setIsCardDetailsDialogOpen] = useState(false);

  useEffect(() => {
    // Parse existing card content to structured data
    const parsedColumns = board.columns.map((column) => ({
      ...column,
      items: column.items.map((item) => ({
        ...item,
        parsedData: parseCardContent(item.content),
      })),
    }));

    setColumns(parsedColumns);
  }, [board.id, board.columns]);

  // Parse card content string to structured data
  const parseCardContent = (content: string): LeadCardData => {
    const data: LeadCardData = {};

    const lines = content.split("\n");
    lines.forEach((line) => {
      const match = line.match(/^(.*?):\s*(.*?)$/);
      if (match) {
        const [, key, value] = match;
        const normalizedKey = key.toLowerCase().trim();

        if (normalizedKey === "nome") data.nome = value.trim();
        else if (normalizedKey === "email") data.email = value.trim();
        else if (normalizedKey === "telefone") data.telefone = value.trim();
        else if (normalizedKey === "status") data.status = value.trim();
        else if (normalizedKey === "origem") data.origem = value.trim();
        else if (normalizedKey === "id") data.id = value.trim();
        else if (normalizedKey === "orçamento")
          data.orcamento_id = value.trim();
        else if (normalizedKey === "cpf/cnpj") data.cpfCnpj = value.trim();
        else if (normalizedKey.includes("cadastrado"))
          data.jaCadastrado = value.includes("cadastrado");
        else data[normalizedKey] = value.trim();
      }
    });

    return data;
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type, draggableId } = result;

    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }

    if (type === "COLUMN") {
      const reorderedColumns = [...columns];
      const [movedColumn] = reorderedColumns.splice(source.index, 1);
      reorderedColumns.splice(destination.index, 0, movedColumn);

      setColumns(reorderedColumns);

      const updatedBoard = {
        ...board,
        columns: reorderedColumns,
      };

      if (onBoardUpdate) {
        onBoardUpdate(
          updatedBoard,
          "move_column",
          `Coluna "${movedColumn.title}" movida da posição ${source.index + 1} para ${destination.index + 1}`,
        );
      }

      return;
    }

    const sourceColumn = columns.find((col) => col.id === source.droppableId);
    const destColumn = columns.find(
      (col) => col.id === destination.droppableId,
    );

    if (sourceColumn && destColumn) {
      let newColumns;
      let movedItem;

      if (source.droppableId === destination.droppableId) {
        const newItems = [...sourceColumn.items];
        [movedItem] = newItems.splice(source.index, 1);
        newItems.splice(destination.index, 0, movedItem);

        newColumns = columns.map((col) =>
          col.id === sourceColumn.id ? { ...col, items: newItems } : col,
        );

        setColumns(newColumns);

        const updatedBoard = {
          ...board,
          columns: newColumns,
        };

        if (onBoardUpdate) {
          onBoardUpdate(
            updatedBoard,
            "move_card",
            `Cartão "${movedItem.content.substring(0, 30)}${movedItem.content.length > 30 ? "..." : ""}" reordenado dentro da coluna "${sourceColumn.title}"`,
          );
        }
      } else {
        const sourceItems = [...sourceColumn.items];
        const destItems = [...destColumn.items];
        [movedItem] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, movedItem);

        newColumns = columns.map((col) => {
          if (col.id === sourceColumn.id) {
            return { ...col, items: sourceItems };
          }
          if (col.id === destColumn.id) {
            return { ...col, items: destItems };
          }
          return col;
        });

        setColumns(newColumns);

        const updatedBoard = {
          ...board,
          columns: newColumns,
        };

        if (onBoardUpdate) {
          onBoardUpdate(
            updatedBoard,
            "move_card",
            `Cartão "${movedItem.content.substring(0, 30)}${movedItem.content.length > 30 ? "..." : ""}" movido da coluna "${sourceColumn.title}" para "${destColumn.title}"`,
          );
        }
      }
    }
  };

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      const newColumn: Column = {
        id: `col-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        title: newColumnTitle,
        items: [],
      };
      const updatedColumns = [...columns, newColumn];

      setColumns(updatedColumns);
      setNewColumnTitle("");
      setIsAddColumnDialogOpen(false);

      const updatedBoard = {
        ...board,
        columns: updatedColumns,
      };

      if (onBoardUpdate) {
        onBoardUpdate(
          updatedBoard,
          "add_column",
          `Coluna "${newColumn.title}" adicionada`,
        );
      }
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    const columnToDelete = columns.find((col) => col.id === columnId);
    const newColumns = columns.filter((col) => col.id !== columnId);

    setColumns(newColumns);

    if (columnToDelete) {
      const updatedBoard = {
        ...board,
        columns: newColumns,
      };

      if (onBoardUpdate) {
        onBoardUpdate(
          updatedBoard,
          "delete_column",
          `Coluna "${columnToDelete.title}" removida`,
        );
      }
    }
  };

  const handleEditColumnOpen = (column: Column) => {
    setCurrentEditColumn(column);
    setEditColumnTitle(column.title);
    setIsEditColumnDialogOpen(true);
  };

  const handleEditColumn = () => {
    if (currentEditColumn && editColumnTitle.trim()) {
      const oldTitle = currentEditColumn.title;
      const newColumns = columns.map((col) =>
        col.id === currentEditColumn.id
          ? { ...col, title: editColumnTitle }
          : col,
      );

      setColumns(newColumns);
      setIsEditColumnDialogOpen(false);

      const updatedBoard = {
        ...board,
        columns: newColumns,
      };

      if (onBoardUpdate) {
        onBoardUpdate(
          updatedBoard,
          "edit_column",
          `Coluna "${oldTitle}" renomeada para "${editColumnTitle}"`,
        );
      }
    }
  };

  const handleAddCardOpen = (columnId: string) => {
    setCurrentColumnForCard(columnId);

    if (board.cardType === "lead") {
      setIsLeadSearchDialogOpen(true);
    } else {
      setNewCardContent("");
      setIsAddCardDialogOpen(true);
    }
  };

  const handleAddCard = () => {
    if (currentColumnForCard && newCardContent.trim()) {
      const newCard: Item = {
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        content: newCardContent,
      };

      const targetColumn = columns.find(
        (col) => col.id === currentColumnForCard,
      );
      const newColumns = columns.map((col) =>
        col.id === currentColumnForCard
          ? { ...col, items: [...col.items, newCard] }
          : col,
      );

      setColumns(newColumns);
      setIsAddCardDialogOpen(false);

      if (targetColumn) {
        const updatedBoard = {
          ...board,
          columns: newColumns,
        };

        if (onBoardUpdate) {
          onBoardUpdate(
            updatedBoard,
            "add_card",
            `Cartão adicionado na coluna "${targetColumn.title}"`,
          );
        }
      }
    }
  };

  const handleLeadSelect = (leadContent: string) => {
    if (currentColumnForCard) {
      const parsedData = parseCardContent(leadContent);

      const newCard: Item = {
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        content: leadContent,
        parsedData,
      };

      const targetColumn = columns.find(
        (col) => col.id === currentColumnForCard,
      );
      const newColumns = columns.map((col) =>
        col.id === currentColumnForCard
          ? { ...col, items: [...col.items, newCard] }
          : col,
      );

      setColumns(newColumns);
      setIsLeadSearchDialogOpen(false);

      if (targetColumn) {
        const updatedBoard = {
          ...board,
          columns: newColumns,
        };

        if (onBoardUpdate) {
          onBoardUpdate(
            updatedBoard,
            "add_card",
            `Lead adicionado na coluna "${targetColumn.title}"`,
          );
        }
      }
    }
  };

  const handleDeleteCard = (columnId: string, cardId: string) => {
    const targetColumn = columns.find((col) => col.id === columnId);
    const cardToDelete = targetColumn?.items.find((item) => item.id === cardId);

    const newColumns = columns.map((col) =>
      col.id === columnId
        ? { ...col, items: col.items.filter((item) => item.id !== cardId) }
        : col,
    );

    setColumns(newColumns);

    if (targetColumn && cardToDelete) {
      const updatedBoard = {
        ...board,
        columns: newColumns,
      };

      if (onBoardUpdate) {
        onBoardUpdate(
          updatedBoard,
          "delete_card",
          `Cartão "${cardToDelete.content.substring(0, 30)}${cardToDelete.content.length > 30 ? "..." : ""}" removido da coluna "${targetColumn.title}"`,
        );
      }
    }
  };

  const handleOpenCardDetails = (item: Item) => {
    setSelectedCard(item);
    setIsCardDetailsDialogOpen(true);
  };

  return (
    <Box sx={{ height: "100%", overflow: "hidden", width: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography variant="body2" color="textSecondary" sx={{ mr: 2 }}>
          Tipo de cartão:{" "}
          <strong>{board.cardType === "lead" ? "Lead" : "Orçamento"}</strong>
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<IconPlus size="1rem" />}
          onClick={() => setIsAddColumnDialogOpen(true)}
        >
          Nova coluna
        </Button>
      </Box>

      <Box sx={{ overflowX: "auto", pb: 2, width: "100%" }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="board" type="COLUMN" direction="horizontal">
            {(provided) => (
              <Box
                {...provided.droppableProps}
                ref={provided.innerRef}
                sx={{
                  display: "flex",
                  minHeight: "500px",
                  gap: 2,
                  pb: 2,
                  width: "max-content",
                }}
              >
                {columns.map((column, index) => (
                  <Draggable
                    key={column.id}
                    draggableId={column.id}
                    index={index}
                  >
                    {(provided) => (
                      <Paper
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        elevation={1}
                        sx={{
                          width: "280px",
                          flexShrink: 0,
                          display: "flex",
                          flexDirection: "column",
                          maxHeight: "100%",
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderBottom: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            <Box
                              {...provided.dragHandleProps}
                              sx={{ mr: 1, cursor: "grab" }}
                            >
                              <IconGripVertical size="1.2rem" />
                            </Box>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: "medium", flexGrow: 1 }}
                            >
                              {column.title}
                            </Typography>
                            <Box>
                              <IconButton
                                size="small"
                                onClick={() => handleEditColumnOpen(column)}
                              >
                                <IconEdit size="1rem" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteColumn(column.id)}
                              >
                                <IconTrash size="1rem" />
                              </IconButton>
                            </Box>
                          </Box>
                        </Box>

                        <Droppable droppableId={column.id} type="ITEM">
                          {(provided, snapshot) => (
                            <Box
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              sx={{
                                p: 1,
                                flexGrow: 1,
                                minHeight: "100px",
                                backgroundColor: snapshot.isDraggingOver
                                  ? "action.hover"
                                  : "background.paper",
                                overflow: "auto",
                              }}
                            >
                              {column.items.map((item, index) => (
                                <Draggable
                                  key={item.id}
                                  draggableId={item.id}
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <Paper
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      elevation={snapshot.isDragging ? 3 : 1}
                                      sx={{
                                        p: 2,
                                        mb: 1,
                                        backgroundColor: snapshot.isDragging
                                          ? "background.default"
                                          : "background.paper",
                                        position: "relative",
                                        borderLeft: "4px solid",
                                        borderLeftColor:
                                          board.cardType === "lead"
                                            ? "primary.main"
                                            : "warning.main",
                                        cursor: "pointer",
                                        "&:hover": {
                                          boxShadow: 3,
                                        },
                                        transition: "all 0.2s ease-in-out",
                                        borderRadius: "8px",
                                        "&:active": {
                                          transform: "scale(0.98)",
                                        },
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenCardDetails(item);
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          mb: 1,
                                          display: "flex",
                                          justifyContent: "space-between",
                                          alignItems: "center",
                                        }}
                                      >
                                        <Chip
                                          size="small"
                                          label={
                                            board.cardType === "lead"
                                              ? "Lead"
                                              : "Orçamento"
                                          }
                                          color={
                                            board.cardType === "lead"
                                              ? "primary"
                                              : "warning"
                                          }
                                          variant="outlined"
                                        />
                                        {item.parsedData?.status && (
                                          <Chip
                                            size="small"
                                            label={item.parsedData.status}
                                            color={
                                              item.parsedData.status ===
                                              "Convertido"
                                                ? "success"
                                                : item.parsedData.status ===
                                                    "Aprovado"
                                                  ? "info"
                                                  : item.parsedData.status ===
                                                      "Perdido"
                                                    ? "error"
                                                    : item.parsedData.status ===
                                                        "Em andamento"
                                                      ? "warning"
                                                      : "default"
                                            }
                                          />
                                        )}
                                      </Box>

                                      {item.parsedData?.nome && (
                                        <Box
                                          sx={{
                                            mb: 1,
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          <Avatar
                                            sx={{
                                              width: 24,
                                              height: 24,
                                              mr: 1,
                                              bgcolor: "primary.main",
                                            }}
                                          >
                                            <IconUser size="1rem" />
                                          </Avatar>
                                          <Typography
                                            variant="subtitle2"
                                            noWrap
                                            sx={{ fontWeight: "medium" }}
                                          >
                                            {item.parsedData.nome}
                                          </Typography>
                                        </Box>
                                      )}

                                      {item.parsedData?.telefone && (
                                        <Box
                                          sx={{
                                            mb: 0.5,
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          <IconPhone
                                            size="0.9rem"
                                            style={{
                                              marginRight: 4,
                                              opacity: 0.7,
                                            }}
                                          />
                                          <Typography
                                            variant="caption"
                                            noWrap
                                            sx={{ color: "text.secondary" }}
                                          >
                                            {item.parsedData.telefone}
                                          </Typography>
                                        </Box>
                                      )}

                                      {item.parsedData?.email && (
                                        <Box
                                          sx={{
                                            mb: 0.5,
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          <IconMail
                                            size="0.9rem"
                                            style={{
                                              marginRight: 4,
                                              opacity: 0.7,
                                            }}
                                          />
                                          <Typography
                                            variant="caption"
                                            noWrap
                                            sx={{ color: "text.secondary" }}
                                          >
                                            {item.parsedData.email}
                                          </Typography>
                                        </Box>
                                      )}

                                      <Box
                                        sx={{
                                          mt: 1,
                                          display: "flex",
                                          justifyContent: "space-between",
                                          alignItems: "center",
                                          borderTop: "1px dashed",
                                          borderColor: "divider",
                                          pt: 1,
                                        }}
                                      >
                                        <Tooltip title="Ver detalhes">
                                          <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleOpenCardDetails(item);
                                            }}
                                          >
                                            <IconEye size="0.9rem" />
                                          </IconButton>
                                        </Tooltip>

                                        <IconButton
                                          size="small"
                                          sx={{
                                            color: "error.main",
                                          }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteCard(
                                              column.id,
                                              item.id,
                                            );
                                          }}
                                        >
                                          <IconX size="0.8rem" />
                                        </IconButton>
                                      </Box>
                                    </Paper>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </Box>
                          )}
                        </Droppable>

                        <Box sx={{ p: 1 }}>
                          <Button
                            fullWidth
                            variant="outlined"
                            size="small"
                            startIcon={<IconPlus size="1rem" />}
                            onClick={() => handleAddCardOpen(column.id)}
                          >
                            Adicionar cartão
                          </Button>
                        </Box>
                      </Paper>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      </Box>

      <Dialog
        open={isAddColumnDialogOpen}
        onClose={() => setIsAddColumnDialogOpen(false)}
      >
        <DialogTitle>Nova coluna</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Título da coluna"
            fullWidth
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddColumnDialogOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleAddColumn}
            variant="contained"
            disabled={!newColumnTitle.trim()}
          >
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isEditColumnDialogOpen}
        onClose={() => setIsEditColumnDialogOpen(false)}
      >
        <DialogTitle>Editar Coluna</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Título da coluna"
            fullWidth
            value={editColumnTitle}
            onChange={(e) => setEditColumnTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditColumnDialogOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleEditColumn}
            variant="contained"
            disabled={!editColumnTitle.trim()}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isAddCardDialogOpen}
        onClose={() => setIsAddCardDialogOpen(false)}
      >
        <DialogTitle>
          Novo {board.cardType === "lead" ? "Lead" : "Orçamento"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={
              board.cardType === "lead"
                ? "Detalhes do lead"
                : "Detalhes do orçamento"
            }
            fullWidth
            multiline
            rows={3}
            value={newCardContent}
            onChange={(e) => setNewCardContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddCardDialogOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleAddCard}
            variant="contained"
            disabled={!newCardContent.trim()}
            color={board.cardType === "lead" ? "primary" : "warning"}
          >
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isCardDetailsDialogOpen}
        onClose={() => setIsCardDetailsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        TransitionProps={{
          enter: true,
          exit: true,
        }}
        PaperProps={{
          elevation: 2,
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{
                  mr: 2,
                  bgcolor:
                    board.cardType === "lead" ? "primary.main" : "warning.main",
                  width: 40,
                  height: 40,
                }}
              >
                <IconUser size="1.5rem" />
              </Avatar>
              <Typography variant="h6">
                {board.cardType === "lead"
                  ? "Detalhes do Lead"
                  : "Detalhes do Orçamento"}
              </Typography>
            </Box>
            {selectedCard?.parsedData?.status && (
              <Chip
                label={selectedCard.parsedData.status}
                color={
                  selectedCard.parsedData.status === "Convertido"
                    ? "success"
                    : selectedCard.parsedData.status === "Aprovado"
                      ? "info"
                      : selectedCard.parsedData.status === "Perdido"
                        ? "error"
                        : selectedCard.parsedData.status === "Em andamento"
                          ? "warning"
                          : "default"
                }
              />
            )}
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent>
          {selectedCard && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: "background.default",
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                {selectedCard.parsedData?.nome && (
                  <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                    <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                      {selectedCard.parsedData.nome.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {selectedCard.parsedData.nome}
                      </Typography>
                      {selectedCard.parsedData?.jaCadastrado !== undefined && (
                        <Chip
                          size="small"
                          label={
                            selectedCard.parsedData.jaCadastrado
                              ? "Cliente cadastrado"
                              : "Lead não cadastrado"
                          }
                          color={
                            selectedCard.parsedData.jaCadastrado
                              ? "success"
                              : "default"
                          }
                          sx={{ mt: 0.5 }}
                        />
                      )}
                    </Box>
                  </Box>
                )}

                <Stack spacing={1.5} sx={{ ml: 1 }}>
                  {selectedCard.parsedData?.email && (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <IconMail size="1.2rem" style={{ marginRight: 8 }} />
                      <Typography variant="body2">
                        {selectedCard.parsedData.email}
                      </Typography>
                    </Box>
                  )}

                  {selectedCard.parsedData?.telefone && (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <IconPhone size="1.2rem" style={{ marginRight: 8 }} />
                      <Typography variant="body2">
                        {selectedCard.parsedData.telefone}
                      </Typography>
                    </Box>
                  )}

                  {selectedCard.parsedData?.cpfCnpj && (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <IconId size="1.2rem" style={{ marginRight: 8 }} />
                      <Typography variant="body2">
                        {selectedCard.parsedData.cpfCnpj}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>

              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  gutterBottom
                >
                  Informações Adicionais
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  {selectedCard.parsedData?.origem && (
                    <Grid item xs={6}>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        display="block"
                      >
                        Origem
                      </Typography>
                      <Typography variant="body2">
                        {selectedCard.parsedData.origem}
                      </Typography>
                    </Grid>
                  )}

                  {selectedCard.parsedData?.id && (
                    <Grid item xs={6}>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        display="block"
                      >
                        ID
                      </Typography>
                      <Typography variant="body2">
                        {selectedCard.parsedData.id}
                      </Typography>
                    </Grid>
                  )}

                  {selectedCard.parsedData?.orcamento_id && (
                    <Grid item xs={6}>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        display="block"
                      >
                        Orçamento
                      </Typography>
                      <Typography variant="body2">
                        {selectedCard.parsedData.orcamento_id}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCardDetailsDialogOpen(false)}>
            Fechar
          </Button>
          {selectedCard?.parsedData?.id && (
            <Button
              variant="contained"
              color={board.cardType === "lead" ? "primary" : "warning"}
              startIcon={
                board.cardType === "lead" ? (
                  <IconUser size="1rem" />
                ) : (
                  <IconBuilding size="1rem" />
                )
              }
            >
              {board.cardType === "lead"
                ? "Ver Perfil do Lead"
                : "Ver Orçamento"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <LeadSearchDialog
        open={isLeadSearchDialogOpen}
        onClose={() => setIsLeadSearchDialogOpen(false)}
        onSelectLead={handleLeadSelect}
      />
    </Box>
  );
};

export default Board;

"use client";
import React, { useState } from "react";
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
} from "@tabler/icons-react";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

interface Item {
  id: string;
  content: string;
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
  const [newCardContent, setNewCardContent] = useState("");
  const [currentColumnForCard, setCurrentColumnForCard] = useState<
    string | null
  >(null);

  const notifyUpdate = (action: string, details: string) => {
    if (onBoardUpdate) {
      const updatedBoard = {
        ...board,
        columns,
      };
      onBoardUpdate(updatedBoard, action, details);
    }
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

      notifyUpdate(
        "move_column",
        `Coluna "${movedColumn.title}" movida da posição ${source.index + 1} para ${destination.index + 1}`,
      );

      return;
    }

    const sourceColumn = columns.find((col) => col.id === source.droppableId);
    const destColumn = columns.find(
      (col) => col.id === destination.droppableId,
    );

    if (sourceColumn && destColumn) {
      if (source.droppableId === destination.droppableId) {
        const newItems = [...sourceColumn.items];
        const [movedItem] = newItems.splice(source.index, 1);
        newItems.splice(destination.index, 0, movedItem);

        const newColumns = columns.map((col) =>
          col.id === sourceColumn.id ? { ...col, items: newItems } : col,
        );
        setColumns(newColumns);

        notifyUpdate(
          "move_card",
          `Cartão "${movedItem.content.substring(0, 30)}${movedItem.content.length > 30 ? "..." : ""}" reordenado dentro da coluna "${sourceColumn.title}"`,
        );
      } else {
        const sourceItems = [...sourceColumn.items];
        const destItems = [...destColumn.items];
        const [movedItem] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, movedItem);

        const newColumns = columns.map((col) => {
          if (col.id === sourceColumn.id) {
            return { ...col, items: sourceItems };
          }
          if (col.id === destColumn.id) {
            return { ...col, items: destItems };
          }
          return col;
        });

        setColumns(newColumns);

        notifyUpdate(
          "move_card",
          `Cartão "${movedItem.content.substring(0, 30)}${movedItem.content.length > 30 ? "..." : ""}" movido da coluna "${sourceColumn.title}" para "${destColumn.title}"`,
        );
      }
    }
  };

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      const newColumn: Column = {
        id: `col-${Date.now()}`,
        title: newColumnTitle,
        items: [],
      };
      const updatedColumns = [...columns, newColumn];
      setColumns(updatedColumns);
      setNewColumnTitle("");
      setIsAddColumnDialogOpen(false);

      notifyUpdate("add_column", `Coluna "${newColumn.title}" adicionada`);
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    const columnToDelete = columns.find((col) => col.id === columnId);
    const newColumns = columns.filter((col) => col.id !== columnId);
    setColumns(newColumns);

    if (columnToDelete) {
      notifyUpdate(
        "delete_column",
        `Coluna "${columnToDelete.title}" removida`,
      );
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

      notifyUpdate(
        "edit_column",
        `Coluna "${oldTitle}" renomeada para "${editColumnTitle}"`,
      );
    }
  };

  const handleAddCardOpen = (columnId: string) => {
    setCurrentColumnForCard(columnId);
    setNewCardContent("");
    setIsAddCardDialogOpen(true);
  };

  const handleAddCard = () => {
    if (currentColumnForCard && newCardContent.trim()) {
      const newCard: Item = {
        id: `item-${Date.now()}`,
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
        notifyUpdate(
          "add_card",
          `Cartão adicionado na coluna "${targetColumn.title}"`,
        );
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
      notifyUpdate(
        "delete_card",
        `Cartão "${cardToDelete.content.substring(0, 30)}${cardToDelete.content.length > 30 ? "..." : ""}" removido da coluna "${targetColumn.title}"`,
      );
    }
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
                                      }}
                                    >
                                      <Box sx={{ mb: 1 }}>
                                        <Typography
                                          variant="caption"
                                          sx={{
                                            display: "inline-block",
                                            px: 1,
                                            py: 0.5,
                                            borderRadius: 1,
                                            bgcolor:
                                              board.cardType === "lead"
                                                ? "primary.light"
                                                : "warning.light",
                                            color:
                                              board.cardType === "lead"
                                                ? "primary.contrastText"
                                                : "warning.contrastText",
                                          }}
                                        >
                                          {board.cardType === "lead"
                                            ? "Lead"
                                            : "Orçamento"}
                                        </Typography>
                                      </Box>
                                      <Typography variant="body2">
                                        {item.content}
                                      </Typography>
                                      <IconButton
                                        size="small"
                                        sx={{
                                          position: "absolute",
                                          top: 2,
                                          right: 2,
                                        }}
                                        onClick={() =>
                                          handleDeleteCard(column.id, item.id)
                                        }
                                      >
                                        <IconX size="0.8rem" />
                                      </IconButton>
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
    </Box>
  );
};

export default Board;

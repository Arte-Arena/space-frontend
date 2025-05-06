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
    columns: Column[];
  };
}

const Board: React.FC<BoardProps> = ({ board }) => {
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

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

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
      }

      else {
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
      setColumns([...columns, newColumn]);
      setNewColumnTitle("");
      setIsAddColumnDialogOpen(false);
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    setColumns(columns.filter((col) => col.id !== columnId));
  };

  const handleEditColumnOpen = (column: Column) => {
    setCurrentEditColumn(column);
    setEditColumnTitle(column.title);
    setIsEditColumnDialogOpen(true);
  };

  const handleEditColumn = () => {
    if (currentEditColumn && editColumnTitle.trim()) {
      setColumns(
        columns.map((col) =>
          col.id === currentEditColumn.id
            ? { ...col, title: editColumnTitle }
            : col,
        ),
      );
      setIsEditColumnDialogOpen(false);
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

      setColumns(
        columns.map((col) =>
          col.id === currentColumnForCard
            ? { ...col, items: [...col.items, newCard] }
            : col,
        ),
      );
      setIsAddCardDialogOpen(false);
    }
  };

  const handleDeleteCard = (columnId: string, cardId: string) => {
    setColumns(
      columns.map((col) =>
        col.id === columnId
          ? { ...col, items: col.items.filter((item) => item.id !== cardId) }
          : col,
      ),
    );
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5">{board.name}</Typography>
        <Button
          variant="contained"
          startIcon={<IconPlus size="1rem" />}
          onClick={() => setIsAddColumnDialogOpen(true)}
        >
          Nova Coluna
        </Button>
      </Box>

      <SimpleBar style={{ overflowX: "auto" }}>
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
                                      }}
                                    >
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
                            Adicionar Cartão
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
      </SimpleBar>

      <Dialog
        open={isAddColumnDialogOpen}
        onClose={() => setIsAddColumnDialogOpen(false)}
      >
        <DialogTitle>Nova Coluna</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Título da Coluna"
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
            label="Título da Coluna"
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
        <DialogTitle>Novo Cartão</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Conteúdo do Cartão"
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
          >
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Board;

"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  IconButton,
} from "@mui/material";
import { IconPlus, IconEdit, IconX } from "@tabler/icons-react";
import Board from "./Board";
import CreateBoardDialog from "./CreateBoardDialog";

const initialBoards = [
  {
    id: "1",
    name: "Funil de Vendas",
    columns: [
      { id: "col-1", title: "Prospecção", items: [] },
      { id: "col-2", title: "Contato Inicial", items: [] },
      { id: "col-3", title: "Apresentação", items: [] },
      { id: "col-4", title: "Proposta", items: [] },
      { id: "col-5", title: "Negociação", items: [] },
      { id: "col-6", title: "Fechamento", items: [] },
    ],
  },
];

const drawerWidth = 240;

const BoardManager = () => {
  const [boards, setBoards] = useState(initialBoards);
  const [selectedBoardId, setSelectedBoardId] = useState(initialBoards[0].id);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const selectedBoard = boards.find((board) => board.id === selectedBoardId);

  const handleCreateBoard = (boardName: string) => {
    const newBoard = {
      id: Date.now().toString(),
      name: boardName,
      columns: [{ id: `col-${Date.now()}-1`, title: "Nova Coluna", items: [] }],
    };

    setBoards([...boards, newBoard]);
    setSelectedBoardId(newBoard.id);
    setIsCreateDialogOpen(false);
  };

  const handleDeleteBoard = (boardId: string) => {
    const newBoards = boards.filter((board) => board.id !== boardId);

    if (newBoards.length > 0) {
      if (selectedBoardId === boardId) {
        setSelectedBoardId(newBoards[0].id);
      }
      setBoards(newBoards);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
        }}
      >
        <Typography variant="h6" noWrap component="div">
          Quadros
        </Typography>
        <IconButton
          color="inherit"
          aria-label="close drawer"
          edge="end"
          onClick={handleDrawerToggle}
          sx={{ display: { sm: "none" } }}
        >
          <IconX />
        </IconButton>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<IconPlus size="1rem" />}
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Novo Quadro
        </Button>
      </Box>
      <Divider />
      <List>
        {boards.map((board) => (
          <ListItem key={board.id} disablePadding>
            <ListItemButton
              selected={selectedBoardId === board.id}
              onClick={() => setSelectedBoardId(board.id)}
            >
              <ListItemText primary={board.name} />
              {boards.length > 1 && selectedBoardId === board.id && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteBoard(board.id);
                  }}
                >
                  <IconX size="1rem" />
                </IconButton>
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              position: "relative",
              height: "100%",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {selectedBoard && <Board board={selectedBoard} />}
      </Box>

      <CreateBoardDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateBoard}
      />
    </Box>
  );
};

export default BoardManager;

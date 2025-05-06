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
  Badge,
  Tabs,
  Tab,
} from "@mui/material";
import { IconPlus, IconEdit, IconX, IconHistory } from "@tabler/icons-react";
import Board from "./Board";
import CreateBoardDialog from "./CreateBoardDialog";
import BoardHistory from "./BoardHistory";

interface HistoryEntry {
  id: string;
  userId: string;
  timestamp: number;
  boardId: string;
  boardName: string;
  action: string;
  details: string;
}

interface Item {
  id: string;
  content: string;
}

interface Column {
  id: string;
  title: string;
  items: Item[];
}

interface BoardData {
  id: string;
  name: string;
  columns: Column[];
}

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
  const [boards, setBoards] = useState<BoardData[]>(initialBoards);
  const [selectedBoardId, setSelectedBoardId] = useState(initialBoards[0].id);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyMode, setHistoryMode] = useState<"board" | "global">("board");
  const mockUserId = "user-123";

  const selectedBoard = boards.find((board) => board.id === selectedBoardId);

  const addHistoryEntry = (
    boardId: string,
    action: string,
    details: string,
  ) => {
    const boardName =
      boards.find((board) => board.id === boardId)?.name ||
      "Quadro desconhecido";

    const newEntry: HistoryEntry = {
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      userId: mockUserId,
      timestamp: Date.now(),
      boardId,
      boardName,
      action,
      details,
    };
    setHistory((prev) => [newEntry, ...prev]);
  };

  const handleCreateBoard = (boardName: string) => {
    const newBoard = {
      id: Date.now().toString(),
      name: boardName,
      columns: [{ id: `col-${Date.now()}-1`, title: "Nova Coluna", items: [] }],
    };

    setBoards([...boards, newBoard]);
    setSelectedBoardId(newBoard.id);
    setIsCreateDialogOpen(false);

    addHistoryEntry(
      newBoard.id,
      "create_board",
      `Quadro "${boardName}" criado`,
    );
  };

  const handleDeleteBoard = (boardId: string) => {
    const boardToDelete = boards.find((board) => board.id === boardId);
    const newBoards = boards.filter((board) => board.id !== boardId);

    if (newBoards.length > 0) {
      if (selectedBoardId === boardId) {
        setSelectedBoardId(newBoards[0].id);
      }
      setBoards(newBoards);

      if (boardToDelete) {
        addHistoryEntry(
          boardId,
          "delete_board",
          `Quadro "${boardToDelete.name}" excluído`,
        );
      }
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleBoardUpdate = (
    updatedBoard: BoardData,
    action: string,
    details: string,
  ) => {
    if (!updatedBoard) return;

    setBoards(
      boards.map((board) =>
        board.id === updatedBoard.id ? updatedBoard : board,
      ),
    );

    addHistoryEntry(updatedBoard.id, action, details);
  };

  const filteredHistory =
    historyMode === "board"
      ? history.filter((entry) => entry.boardId === selectedBoardId)
      : history;

  const toggleHistory = () => {
    setShowHistory(!showHistory);
    if (!showHistory) {
      setHistoryMode("board");
    }
  };

  const handleHistoryModeChange = (
    _: React.SyntheticEvent,
    newMode: "board" | "global",
  ) => {
    setHistoryMode(newMode);
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
        {selectedBoard && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h5">{selectedBoard.name}</Typography>
              <Button
                variant="outlined"
                startIcon={
                  <Badge badgeContent={history.length} color="primary" max={99}>
                    <IconHistory size="1.2rem" />
                  </Badge>
                }
                onClick={toggleHistory}
              >
                {showHistory ? "Voltar ao Quadro" : "Histórico"}
              </Button>
            </Box>

            {showHistory ? (
              <Box>
                <Tabs
                  value={historyMode}
                  onChange={handleHistoryModeChange}
                  sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}
                >
                  <Tab
                    label={`Histórico do Quadro (${filteredHistory.filter((h) => h.boardId === selectedBoardId).length})`}
                    value="board"
                  />
                  <Tab
                    label={`Histórico Global (${history.length})`}
                    value="global"
                  />
                </Tabs>
                <BoardHistory
                  history={filteredHistory}
                  onClose={toggleHistory}
                  showBoardNames={historyMode === "global"}
                />
              </Box>
            ) : (
              <Board board={selectedBoard} onBoardUpdate={handleBoardUpdate} />
            )}
          </>
        )}
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

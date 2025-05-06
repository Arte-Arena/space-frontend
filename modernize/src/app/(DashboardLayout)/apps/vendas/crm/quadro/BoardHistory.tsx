"use client";
import React from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import {
  IconUser,
  IconPlus,
  IconTrash,
  IconArrowsMove,
  IconEdit,
  IconRefresh,
  IconLayoutKanban,
} from "@tabler/icons-react";

interface HistoryEntry {
  id: string;
  userId: string;
  timestamp: number;
  boardId: string;
  boardName: string;
  action: string;
  details: string;
}

interface BoardHistoryProps {
  history: HistoryEntry[];
  onClose: () => void;
  showBoardNames?: boolean;
}

const BoardHistory: React.FC<BoardHistoryProps> = ({
  history,
  onClose,
  showBoardNames = false,
}) => {
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "create_board":
      case "add_column":
      case "add_card":
        return <IconPlus size="1.5rem" color="#4caf50" />;
      case "delete_board":
      case "delete_column":
      case "delete_card":
        return <IconTrash size="1.5rem" color="#f44336" />;
      case "edit_column":
      case "edit_card":
        return <IconEdit size="1.5rem" color="#2196f3" />;
      case "move_column":
      case "move_card":
        return <IconArrowsMove size="1.5rem" color="#ff9800" />;
      default:
        return <IconRefresh size="1.5rem" color="#9e9e9e" />;
    }
  };

  return (
    <Box>
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Este histórico mostra todas as alterações feitas no quadro,
            incluindo quem fez a alteração e quando.
          </Typography>
        </CardContent>
      </Card>

      {history.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "background.default",
            borderRadius: 1,
          }}
        >
          <Typography variant="h6" color="text.secondary" align="center">
            Nenhuma alteração registrada
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            As alterações realizadas neste quadro serão exibidas aqui
          </Typography>
        </Paper>
      ) : (
        <Paper elevation={0} sx={{ borderRadius: 1 }}>
          <List sx={{ width: "100%" }}>
            {history.map((entry, index) => (
              <React.Fragment key={entry.id}>
                {index > 0 && <Divider variant="inset" component="li" />}
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      <IconUser />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 1,
                        }}
                      >
                        <Typography
                          component="span"
                          variant="body1"
                          fontWeight="medium"
                        >
                          {entry.details}
                        </Typography>
                        {showBoardNames && (
                          <Chip
                            icon={<IconLayoutKanban size="1rem" />}
                            label={entry.boardName}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <React.Fragment>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mt: 1 }}
                        >
                          {getActionIcon(entry.action)}
                          <Box sx={{ ml: 1 }}>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.secondary"
                            >
                              Usuário: {entry.userId}
                            </Typography>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.secondary"
                              sx={{ display: "block" }}
                            >
                              {formatDate(entry.timestamp)}
                            </Typography>
                          </Box>
                        </Box>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default BoardHistory;

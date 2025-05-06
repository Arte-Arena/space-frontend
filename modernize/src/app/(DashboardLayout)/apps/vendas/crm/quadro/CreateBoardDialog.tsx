"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

interface CreateBoardDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (boardName: string) => void;
}

const CreateBoardDialog: React.FC<CreateBoardDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [boardName, setBoardName] = useState("");

  const handleSubmit = () => {
    if (boardName.trim()) {
      onSubmit(boardName);
      setBoardName("");
    }
  };

  const handleCancel = () => {
    setBoardName("");
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && boardName.trim()) {
      handleSubmit();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Criar Novo Quadro</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nome do Quadro"
          type="text"
          fullWidth
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancelar</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!boardName.trim()}
        >
          Criar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateBoardDialog;

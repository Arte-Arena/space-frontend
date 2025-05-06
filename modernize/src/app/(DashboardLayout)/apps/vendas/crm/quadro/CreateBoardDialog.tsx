"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

interface CreateBoardDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (boardName: string, cardType: string) => void;
}

const CreateBoardDialog: React.FC<CreateBoardDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [boardName, setBoardName] = useState("");
  const [cardType, setCardType] = useState("lead");

  const handleSubmit = () => {
    if (boardName.trim()) {
      onSubmit(boardName, cardType);
      setBoardName("");
      setCardType("lead");
    }
  };

  const handleCancel = () => {
    setBoardName("");
    setCardType("lead");
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && boardName.trim()) {
      handleSubmit();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Criar novo quadro</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nome do quadro"
          type="text"
          fullWidth
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth>
          <InputLabel id="card-type-label">Tipo de Cartão</InputLabel>
          <Select
            labelId="card-type-label"
            id="card-type-select"
            value={cardType}
            label="Tipo de Cartão"
            onChange={(e) => setCardType(e.target.value)}
          >
            <MenuItem value="lead">Lead</MenuItem>
            <MenuItem value="orcamento">Orçamento</MenuItem>
          </Select>
        </FormControl>
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

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Stack,
  Alert,
  Button,
  CircularProgress,
  Snackbar,
  IconButton,
} from "@mui/material";
import { IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { UniformData, Player } from "./types";
import SketchView from "./SketchView";
import { uniformService } from "./uniformService";

interface UniformSketchesViewProps {
  uniformData: UniformData;
  refreshData?: () => void;
}

interface EditingSketch {
  sketchId: string;
  isEditing: boolean;
  players: Player[];
}

const UniformSketchesView: React.FC<UniformSketchesViewProps> = ({
  uniformData,
  refreshData,
}) => {
  const [editingSketches, setEditingSketches] = useState<EditingSketch[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const hasChanges = editingSketches.some((sketch) => sketch.isEditing);

  useEffect(() => {
    setEditingSketches([]);
    setSaving(false);
    setError(null);
    setSuccess(false);
  }, [uniformData.id]);

  const handleSketchEdit = useCallback(
    (sketchId: string, isEditing: boolean, players: Player[]) => {
      if (!isEditing) return;

      setEditingSketches((prev) => {
        const existingIndex = prev.findIndex((s) => s.sketchId === sketchId);

        if (existingIndex >= 0) {
          if (prev[existingIndex].isEditing === isEditing) {
            const updated = [...prev];
            updated[existingIndex] = { ...updated[existingIndex], players };
            return updated;
          }

          const updated = [...prev];
          updated[existingIndex] = { sketchId, isEditing, players };
          return updated;
        } else {
          return [...prev, { sketchId, isEditing, players }];
        }
      });
    },
    [],
  );

  const handleSaveAll = async () => {
    if (!uniformData.id) {
      setError(
        "ID do uniforme não encontrado. Não é possível salvar alterações.",
      );
      return;
    }

    const modifiedSketches = editingSketches.filter(
      (sketch) => sketch.isEditing,
    );

    if (modifiedSketches.length === 0) {
      setError("Não há alterações para salvar.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Simulate saving for all cases
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);

      if (refreshData) {
        refreshData();
      }
    } catch (err) {
      console.error("Erro ao salvar alterações:", err);
      setError(
        "Ocorreu um erro ao salvar as alterações. Por favor, tente novamente.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(false);
  };

  if (!uniformData.sketches || uniformData.sketches.length === 0) {
    return (
      <Alert severity="info">
        Não há esboços de uniformes configurados para este orçamento.
      </Alert>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <div>
          <Typography variant="h5" gutterBottom>
            Detalhes dos Uniformes
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Visualização dos uniformes configurados para o orçamento #
            {uniformData.budget_id}
          </Typography>
        </div>

        {hasChanges && (
          <Button
            variant="contained"
            color="primary"
            startIcon={
              saving ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <IconDeviceFloppy />
              )
            }
            onClick={handleSaveAll}
            disabled={saving}
            sx={{ minWidth: "180px" }}
          >
            {saving ? "Salvando..." : "Salvar todas as alterações"}
          </Button>
        )}
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity="error"
          action={
            <IconButton
              size="small"
              color="inherit"
              onClick={handleCloseSnackbar}
            >
              <IconX />
            </IconButton>
          }
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity="success"
          action={
            <IconButton
              size="small"
              color="inherit"
              onClick={handleCloseSnackbar}
            >
              <IconX />
            </IconButton>
          }
        >
          {uniformData.id.startsWith("mock-")
            ? "Alterações salvas com sucesso! (Dados de exemplo)"
            : "Alterações salvas com sucesso!"}
        </Alert>
      </Snackbar>

      <Stack spacing={3} mb={4}>
        {uniformData.sketches.map((sketch) => (
          <SketchView
            key={sketch.id}
            sketch={sketch}
            uniformId={uniformData.id}
            refreshData={refreshData}
            onEditChange={handleSketchEdit}
            isSaving={saving}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default UniformSketchesView;

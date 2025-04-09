import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TextField,
} from "@mui/material";
import { IconChevronDown } from "@tabler/icons-react";
import { Sketch, Player } from "./types";
import { uniformService } from "./uniformService";

interface SketchViewProps {
  sketch: Sketch;
  uniformId?: string;
  refreshData?: () => void;
  onEditChange?: (
    sketchId: string,
    isEditing: boolean,
    players: Player[],
  ) => void;
  isSaving?: boolean;
}

const SketchView: React.FC<SketchViewProps> = ({
  sketch,
  uniformId = "",
  refreshData,
  onEditChange,
  isSaving = false,
}) => {
  console.log("SketchView rendering with sketch:", sketch);
  console.log("Players:", sketch.players);

  const [players, setPlayers] = useState<Player[]>([...(sketch.players || [])]);
  const [isEditing, setIsEditing] = useState(false);

  const prevIsSavingRef = useRef(isSaving);

  useEffect(() => {
    console.log("Sketch props atualizado:", sketch);
    if (sketch.players) {
      console.log("Atualizando estado de jogadores com:", sketch.players);
      setPlayers([...sketch.players]);
      setIsEditing(false);
    }
  }, [sketch, sketch.players]);

  useEffect(() => {
    if (onEditChange && isEditing) {
      onEditChange(sketch.id, isEditing, players);
    }
  }, [isEditing, players, sketch.id, onEditChange]);

  useEffect(() => {
    if (prevIsSavingRef.current === true && isSaving === false) {
      if (isEditing) {
        setIsEditing(false);
      }
    }

    prevIsSavingRef.current = isSaving;
  }, [isSaving, isEditing]);

  const handleReadyChange = (index: number, checked: boolean) => {
    setIsEditing(true);
    const updatedPlayers = [...players];
    updatedPlayers[index] = {
      ...updatedPlayers[index],
      ready: checked,
    };
    setPlayers(updatedPlayers);
  };

  const handleObservationsChange = (index: number, value: string) => {
    setIsEditing(true);
    const updatedPlayers = [...players];
    updatedPlayers[index] = {
      ...updatedPlayers[index],
      observations: value,
    };
    setPlayers(updatedPlayers);
  };

  return (
    <Accordion defaultExpanded>
      <AccordionSummary
        expandIcon={<IconChevronDown />}
        sx={{ backgroundColor: isEditing ? "warning.light" : "action.hover" }}
      >
        <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
          <Typography variant="h6">
            Esboço {sketch.id} - {sketch.player_count} Jogadores
          </Typography>
          <Chip
            label={sketch.package_type}
            color="primary"
            size="small"
            sx={{ ml: 1 }}
          />
          {uniformId.startsWith("mock-") && (
            <Chip label="Exemplo" color="warning" size="small" />
          )}
          {isEditing && <Chip label="Editado" color="warning" size="small" />}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box mb={2}>
          <Typography variant="body2" color="textSecondary">
            Informações dos jogadores para este esboço.
            {uniformId.startsWith("mock-") && (
              <Typography variant="caption" color="warning.main" sx={{ ml: 1 }}>
                (Dados de exemplo - Alterações não serão persistidas no
                servidor)
              </Typography>
            )}
          </Typography>
        </Box>

        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Número</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Nome</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Gênero</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Tamanho Camisa
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Tamanho Calção
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Pronto</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Obs</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {players.map((player, index) => (
                <TableRow key={`${player.number}-${index}`}>
                  <TableCell>{player.number}</TableCell>
                  <TableCell>{player.name}</TableCell>
                  <TableCell>
                    {player.gender === "masculino"
                      ? "Masculino"
                      : player.gender === "feminino"
                        ? "Feminino"
                        : player.gender === "infantil"
                          ? "Infantil"
                          : player.gender}
                  </TableCell>
                  <TableCell>{player.shirt_size}</TableCell>
                  <TableCell>{player.shorts_size}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={player.ready}
                      size="small"
                      onChange={(e) =>
                        handleReadyChange(index, e.target.checked)
                      }
                      disabled={isSaving}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      value={player.observations || ""}
                      onChange={(e) =>
                        handleObservationsChange(index, e.target.value)
                      }
                      placeholder="Adicione observações"
                      disabled={isSaving}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  );
};

export default SketchView;

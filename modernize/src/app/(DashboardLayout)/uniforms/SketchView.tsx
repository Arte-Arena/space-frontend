import React from "react";
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
  Paper
} from "@mui/material";
import { IconChevronDown } from "@tabler/icons-react";
import { Sketch, Player } from "./types";

interface SketchViewProps {
  sketch: Sketch;
}

const SketchView: React.FC<SketchViewProps> = ({ sketch }) => {
  return (
    <Accordion defaultExpanded>
      <AccordionSummary
        expandIcon={<IconChevronDown />}
        sx={{ backgroundColor: "action.hover" }}
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
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box mb={2}>
          <Typography variant="body2" color="textSecondary">
            Informações dos jogadores para este esboço.
          </Typography>
        </Box>

        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Número</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Gênero</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Tamanho Camisa</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Tamanho Calção</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sketch.players.map((player) => (
                <TableRow key={player.number}>
                  <TableCell>{player.number}</TableCell>
                  <TableCell>{player.name}</TableCell>
                  <TableCell>
                    {player.gender === 'masculino' ? 'Masculino' : 
                     player.gender === 'feminino' ? 'Feminino' : 
                     player.gender === 'infantil' ? 'Infantil' : player.gender}
                  </TableCell>
                  <TableCell>{player.shirt_size}</TableCell>
                  <TableCell>{player.shorts_size}</TableCell>
                  <TableCell>
                    <Chip 
                      label={player.ready ? "Pronto" : "Pendente"} 
                      color={player.ready ? "success" : "warning"}
                      size="small"
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
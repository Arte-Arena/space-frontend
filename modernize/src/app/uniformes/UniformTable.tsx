import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Column, TableData } from "./types";
import { UniformTableRow } from "./UniformTableRow";

interface UniformTableProps {
  letter: string;
  columns: Column[];
  tableData: TableData;
  editingCell: { letter: string; rowId: number; colIndex: number } | null;
  editValue: string;
  onCellClick: (letter: string, rowId: number, colIndex: number, value: string) => void;
  onCellEdit: (letter: string, rowId: number, colIndex: number, value: string) => void;
  onToggleConfirm: (letter: string, rowId: number) => void;
  setEditValue: (value: string) => void;
  setEditingCell: (value: { letter: string; rowId: number; colIndex: number } | null) => void;
}

export function UniformTable({
  letter,
  columns,
  tableData,
  editingCell,
  editValue,
  onCellClick,
  onCellEdit,
  onToggleConfirm,
  setEditValue,
  setEditingCell
}: UniformTableProps) {
  const letterData = tableData[letter] || [];
  const confirmedCount = letterData.filter(row => row.confirmed).length;

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel${letter}-content`}
        id={`panel${letter}-header`}
      >
        <Typography>
          Esboço {letter}{" "}
          <Typography component="span" color="text.secondary" sx={{ ml: 1 }}>
            {letterData.length} jogador{letterData.length !== 1 ? 'es(as)' : '(a)'} - {confirmedCount} confirmado{confirmedCount !== 1 ? 's' : ''}
          </Typography>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} sx={{ padding: '4px 8px', height: '32px' }}>
                    {column.name}
                  </TableCell>
                ))}
                <TableCell sx={{ padding: '4px 8px', height: '32px' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {letterData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1}>
                    <Box sx={{ py: 3, textAlign: 'center' }}>
                      <Typography variant="body1" color="text.secondary">
                        Nenhum jogador cadastrado neste esboço.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                letterData.map((row) => (
                  <UniformTableRow
                    key={row.id}
                    letter={letter}
                    row={row}
                    columns={columns}
                    editingCell={editingCell}
                    editValue={editValue}
                    onCellClick={onCellClick}
                    onCellEdit={onCellEdit}
                    onToggleConfirm={onToggleConfirm}
                    setEditValue={setEditValue}
                    setEditingCell={setEditingCell}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  );
}
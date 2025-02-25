'use client'

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Box,
  IconButton,
  styled,
  Select,
  MenuItem,
  FormControl,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Column {
  id: number;
  name: string;
  type: "select" | "text" | "number";
  options?: string[];
}

interface TableRow {
  id: number;
  data: string[];
}

interface TableData {
  [key: string]: TableRow[];
}

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    color: 'inherit',
    backgroundColor: 'transparent',
    minHeight: '32px',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
  },
  '& .MuiInputBase-input': {
    padding: '4px',
    height: 'auto',
    minHeight: '24px',
    lineHeight: '1.2',
    fontSize: 'inherit',
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  '& .MuiSelect-select': {
    padding: '4px',
    backgroundColor: 'transparent',
    border: 'none',
    minHeight: '24px !important',
    lineHeight: '1.2',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
}));

const TAMANHOS = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG'];
const LETRAS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

export default function UniformBackofficeScreen() {
  const [columns] = useState<Column[]>([
    { id: 1, name: "Sexo", type: "select", options: ['M', 'F'] },
    { id: 2, name: "Nome do jogador(a)", type: "text" },
    { id: 3, name: "Número", type: "number" },
    { id: 4, name: "Tamanho camisa", type: "select", options: TAMANHOS },
    { id: 5, name: "Tamanho calção", type: "select", options: TAMANHOS },
  ]);

  const [tableData, setTableData] = useState<TableData>(
    LETRAS.reduce((acc, letra) => ({
      ...acc,
      [letra]: [
        { id: 1, data: ["M", "João Silva", "10", "G", "M"] },
      ],
    }), {} as TableData)
  );

  const [editingCell, setEditingCell] = useState<{ letra: string; rowId: number; colIndex: number } | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleAddRow = (letra: string) => {
    const letraRows = tableData[letra] || [];
    const newRow: TableRow = {
      id: letraRows.length + 1,
      data: columns.map(() => ""),
    };
    setTableData({
      ...tableData,
      [letra]: [...letraRows, newRow],
    });
  };

  const handleDeleteRow = (letra: string, rowId: number) => {
    setTableData((prevData: TableData) => ({
      ...prevData,
      [letra]: prevData[letra].filter((row: TableRow) => row.id !== rowId),
    }));
  };

  const handleCellClick = (letra: string, rowId: number, colIndex: number, value: string) => {
    setEditingCell({ letra, rowId, colIndex });
    setEditValue(value || '');
  };

  const handleCellEdit = (letra: string, rowId: number, colIndex: number, newValue: string) => {
    const column = columns[colIndex];

    if (column.type === 'number' && newValue !== '' && !/^\d+$/.test(newValue)) {
      return;
    }

    setTableData((prevData: TableData) => ({
      ...prevData,
      [letra]: prevData[letra].map((row: TableRow) => {
        if (row.id === rowId) {
          const newData = [...row.data];
          newData[colIndex] = newValue;
          return { ...row, data: newData };
        }
        return row;
      }),
    }));
    setEditingCell(null);
    setEditValue('');
  };

  const renderCell = (letra: string, cell: string, rowId: number, colIndex: number) => {
    const column = columns[colIndex];
    const isEditing = editingCell?.letra === letra &&
      editingCell?.rowId === rowId &&
      editingCell?.colIndex === colIndex;

    if (isEditing) {
      if (column.type === 'select') {
        return (
          <FormControl fullWidth size="small">
            <StyledSelect
              value={cell || ''}
              onChange={(e) => {
                const value = e.target.value as string;
                handleCellEdit(letra, rowId, colIndex, value);
              }}
              onBlur={() => setEditingCell(null)}
              autoFocus
            >
              {column.options?.map((option: string) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </StyledSelect>
          </FormControl>
        );
      }

      return (
        <StyledTextField
          value={editValue}
          onChange={(e) => {
            const value = e.target.value;
            if (column.type === 'number') {
              if (value === '' || /^\d+$/.test(value)) {
                setEditValue(value);
              }
            } else {
              setEditValue(value);
            }
          }}
          onBlur={() => handleCellEdit(letra, rowId, colIndex, editValue)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleCellEdit(letra, rowId, colIndex, editValue);
            }
          }}
          type={column.type === 'number' ? 'text' : 'text'}
          inputProps={{
            style: {
              textAlign: column.type === 'number' ? 'right' : 'left',
              padding: '2px 4px'
            }
          }}
          autoFocus
          fullWidth
          variant="outlined"
        />
      );
    }

    return cell || '';
  };

  return (
    <Box sx={{ p: 3 }}>
      {LETRAS.map((letra) => (
        <Accordion key={letra}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${letra}-content`}
            id={`panel${letra}-header`}
          >
            <Typography>
              Esboço {letra}{" "}
              <Typography component="span" color="text.secondary" sx={{ ml: 1 }}>
                {(tableData[letra] || []).length} jogador{(tableData[letra] || []).length !== 1 ? 'es(as)' : '(a)'}
              </Typography>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ mb: 2 }}>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AddIcon />}
                onClick={() => handleAddRow(letra)}
              >
                Adicionar nova linha
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell key={column.id} sx={{ padding: '4px 8px', height: '32px' }}>{column.name}</TableCell>
                    ))}
                    <TableCell sx={{ padding: '4px 8px', height: '32px' }}>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(tableData[letra] || []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length + 1}>
                        <Box sx={{ py: 3, textAlign: 'center' }}>
                          <Typography variant="body1" color="text.secondary">
                            Nenhum jogador(a) adicionado. Clique no botão "Adicionar nova linha" para começar.
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    (tableData[letra] || []).map((row) => (
                      <TableRow key={row.id}>
                        {row.data.map((cell, index) => (
                          <TableCell
                            key={index}
                            onClick={() => handleCellClick(letra, row.id, index, cell)}
                            sx={{
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.08)'
                              },
                              padding: '4px 8px',
                              height: '32px',
                            }}
                          >
                            {renderCell(letra, cell, row.id, index)}
                          </TableCell>
                        ))}
                        <TableCell>
                          <IconButton
                            onClick={() => handleDeleteRow(letra, row.id)}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
import { FormControl, IconButton, MenuItem, TableCell, TableRow } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { StyledSelect, StyledTextField } from "./StyledComponents";
import { Column } from "./types";

interface UniformTableRowProps {
  letter: string;
  row: { id: number; data: string[] };
  columns: Column[];
  editingCell: { letter: string; rowId: number; colIndex: number } | null;
  editValue: string;
  onCellClick: (letter: string, rowId: number, colIndex: number, value: string) => void;
  onCellEdit: (letter: string, rowId: number, colIndex: number, value: string) => void;
  onDeleteRow: (letter: string, rowId: number) => void;
  setEditValue: (value: string) => void;
  setEditingCell: (value: { letter: string; rowId: number; colIndex: number } | null) => void;
}

export function UniformTableRow({
  letter,
  row,
  columns,
  editingCell,
  editValue,
  onCellClick,
  onCellEdit,
  onDeleteRow,
  setEditValue,
  setEditingCell
}: UniformTableRowProps) {
  const renderCell = (cell: string, colIndex: number) => {
    const column = columns[colIndex];
    const isEditing = editingCell?.letter === letter &&
      editingCell?.rowId === row.id &&
      editingCell?.colIndex === colIndex;

    if (isEditing) {
      if (column.type === 'select') {
        return (
          <FormControl fullWidth size="small">
            <StyledSelect
              value={cell || ''}
              onChange={(e) => {
                const value = e.target.value as string;
                onCellEdit(letter, row.id, colIndex, value);
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
          onBlur={() => onCellEdit(letter, row.id, colIndex, editValue)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onCellEdit(letter, row.id, colIndex, editValue);
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
    <TableRow>
      {row.data.map((cell, index) => (
        <TableCell
          key={index}
          onClick={() => onCellClick(letter, row.id, index, cell)}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)'
            },
            padding: '4px 8px',
            height: '32px',
          }}
        >
          {renderCell(cell, index)}
        </TableCell>
      ))}
      <TableCell>
        <IconButton
          onClick={() => onDeleteRow(letter, row.id)}
          color="error"
          size="small"
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
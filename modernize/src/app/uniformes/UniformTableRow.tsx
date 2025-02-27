import { FormControl, MenuItem, TableCell, TableRow, Checkbox } from "@mui/material";
import { StyledSelect, StyledTextField } from "./StyledComponents";
import { Column } from "./types";

const ADULT_SIZES_M = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG', 'XXXG'];
const ADULT_SIZES_F = ['P', 'M', 'G', 'GG', 'XG', 'XXG', 'XXXG'];
const KIDS_SIZES = ['2', '4', '6', '8', '10', '12', '14', '16'];

interface UniformTableRowProps {
  letter: string;
  row: { id: number; data: string[]; confirmed: boolean };
  columns: Column[];
  editingCell: { letter: string; rowId: number; colIndex: number } | null;
  editValue: string;
  onCellClick: (letter: string, rowId: number, colIndex: number, value: string) => void;
  onCellEdit: (letter: string, rowId: number, colIndex: number, value: string) => void;
  onToggleConfirm: (letter: string, rowId: number) => void;
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
  onToggleConfirm,
  setEditValue,
}: UniformTableRowProps) {
  const renderCell = (cell: string, colIndex: number) => {
    const column = columns[colIndex];
    const isEditing = editingCell?.letter === letter &&
      editingCell?.rowId === row.id &&
      editingCell?.colIndex === colIndex;

    if (isEditing) {
      if (column.type === 'select') {
        let options;
        if (colIndex === 3 || colIndex === 4) {
          const gender = row.data[0];
          options = gender === 'I' ? KIDS_SIZES 
                 : gender === 'F' ? ADULT_SIZES_F 
                 : ADULT_SIZES_M;
        } else {
          options = column.options;
        }

        return (
          <FormControl fullWidth size="small">
            <StyledSelect
              value={cell || ''}
              onChange={(e) => {
                const value = e.target.value as string;
                setEditValue(value);
                onCellEdit(letter, row.id, colIndex, value);
              }}
              autoFocus
            >
              {options?.map((option: string) => (
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
          onKeyUp={(e) => {
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
        <Checkbox
          checked={row.confirmed}
          onChange={() => onToggleConfirm(letter, row.id)}
          size="small"
        />
      </TableCell>
    </TableRow>
  );
}
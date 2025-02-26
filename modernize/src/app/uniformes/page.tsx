'use client'

import { useState } from "react";
import { Box, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import { useSearchParams } from 'next/navigation';
import { Column, TableData } from "./types";
import { PageHeader } from "./PageHeader";
import { UniformTable } from "./UniformTable";
import { LoadingState } from "./LoadingState";

const ADULT_SIZES_M = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG', 'XXXG'];
const ADULT_SIZES_F = ['P', 'M', 'G', 'GG', 'XG', 'XXG', 'XXXG'];
const KIDS_SIZES = ['2', '4', '6', '8', '10', '12', '14', '16'];
const LETTERS = Array.from({ length: 4 }, (_, i) => String.fromCharCode(65 + i));

export default function UniformBackofficeScreen() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [columns] = useState<Column[]>([
    { id: 1, name: "Gênero", type: "select", options: ['M', 'F', 'I'] },
    { id: 2, name: "Nome do jogador(a)", type: "text" },
    { id: 3, name: "Número", type: "number" },
    { id: 4, name: "Tamanho da camisa", type: "select", options: ADULT_SIZES_M },
    { id: 5, name: "Tamanho do shorts", type: "select", options: ADULT_SIZES_M },
  ]);

  const [tableData, setTableData] = useState<TableData>(
    LETTERS.reduce((acc, letter) => ({
      ...acc,
      [letter]: [
        { id: 1, data: ["M", "John Smith", "10", "G", "M"], confirmed: false },
      ],
    }), {} as TableData)
  );

  const [editingCell, setEditingCell] = useState<{ letter: string; rowId: number; colIndex: number } | null>(null);
  const [editValue, setEditValue] = useState("");

  const [openEmptyTeamsDialog, setOpenEmptyTeamsDialog] = useState(false);
  const [emptyTeams, setEmptyTeams] = useState<string[]>([]);

  const handleAddRow = (letter: string) => {
    const letterRows = tableData[letter] || [];
    const newRow = {
      id: letterRows.length + 1,
      data: columns.map(() => ""),
      confirmed: false,
    };
    setTableData({
      ...tableData,
      [letter]: [...letterRows, newRow],
    });
  };

  const handleDeleteRow = (letter: string, rowId: number) => {
    setTableData((prevData) => ({
      ...prevData,
      [letter]: prevData[letter].filter((row) => row.id !== rowId),
    }));
  };

  const handleToggleConfirm = (letter: string, rowId: number) => {
    setShowValidationError(false);
    setTableData((prevData) => ({
      ...prevData,
      [letter]: prevData[letter].map((row) => {
        if (row.id === rowId) {
          return { ...row, confirmed: !row.confirmed };
        }
        return row;
      }),
    }));
  };

  const handleCellClick = (letter: string, rowId: number, colIndex: number, value: string) => {
    setEditingCell({ letter, rowId, colIndex });
    setEditValue(value || '');
  };

  const handleCellEdit = (letter: string, rowId: number, colIndex: number, newValue: string) => {
    const column = columns[colIndex];

    if (column.type === 'number' && newValue !== '' && !/^\d+$/.test(newValue)) {
      return;
    }

    setTableData((prevData) => ({
      ...prevData,
      [letter]: prevData[letter].map((row) => {
        if (row.id === rowId) {
          const newData = [...row.data];
          newData[colIndex] = newValue;

          if (colIndex === 0) {
            let sizeOptions;
            if (newValue === 'I') {
              sizeOptions = KIDS_SIZES;
            } else if (newValue === 'F') {
              sizeOptions = ADULT_SIZES_F;
            } else {
              sizeOptions = ADULT_SIZES_M;
            }
            if (!sizeOptions.includes(newData[3])) newData[3] = '';
            if (!sizeOptions.includes(newData[4])) newData[4] = '';
          }

          if (colIndex === 3 || colIndex === 4) {
            const gender = newData[0];
            const sizeOptions = gender === 'I' ? KIDS_SIZES
              : gender === 'F' ? ADULT_SIZES_F
                : ADULT_SIZES_M;

            if (!sizeOptions.includes(newValue)) {
              newData[colIndex] = '';
            }
          }

          return { ...row, data: newData };
        }
        return row;
      }),
    }));
    setEditingCell(null);
    setEditValue('');
  };

  const validateData = () => {
    const errors: string[] = [];

    Object.entries(tableData).forEach(([letter, rows]) => {
      rows.forEach((row, index) => {
        row.data.forEach((value, colIndex) => {
          if (!value || value.trim() === '') {
            const fieldName = columns[colIndex].name;
            const playerNumber = index + 1;
            errors.push(`Esboço ${letter}: Jogador ${playerNumber} - Campo "${fieldName}" está vazio`);
          }
        });
      });
    });

    return errors;
  };

  const handleConfirm = async () => {
    const validationErrors = validateData();
    setValidationErrors(validationErrors);

    const allConfirmed = Object.values(tableData).every(rows =>
      rows.length === 0 || rows.every(row => row.confirmed)
    );

    if (!allConfirmed) {
      setShowValidationError(true);
      return;
    }

    if (validationErrors.length > 0) {
      setShowValidationError(true);
      return;
    }

    const emptyTeams = LETTERS.filter(letter => !tableData[letter] || tableData[letter].length === 0);
    if (emptyTeams.length > 0) {
      setEmptyTeams(emptyTeams);
      setOpenEmptyTeamsDialog(true);
      return;
    }

    await submitData();
  };

  const submitData = async () => {
    setShowValidationError(false);
    setIsLoading(true);
    setIsError(false);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Dados confirmados:', tableData);
      setIsSuccess(true);
    } catch (error) {
      console.error('Erro ao confirmar:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setIsError(false);
    setIsSuccess(false);
    setIsLoading(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      {!isLoading && !isSuccess && !isError && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Importante: Para cada jogador, você deve confirmar os tamanhos escolhidos marcando a caixa de seleção correspondente. Todos os jogadores devem ter seus tamanhos confirmados antes de prosseguir.
        </Alert>
      )}

      {showValidationError && (
        <>
          <Alert severity="error" sx={{ mb: 3 }}>
            {validationErrors.length > 0 ? (
              <>
                <div>Por favor, corrija os seguintes erros:</div>
                <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </>
            ) : (
              'Por favor, confirme todos os tamanhos marcando as caixas de seleção para cada jogador antes de prosseguir.'
            )}
          </Alert>
        </>
      )}

      <PageHeader
        orderId={orderId}
        onConfirm={handleConfirm}
        isSuccess={isSuccess}
        isLoading={isLoading}
        isError={isError}
      />

      {isLoading || isSuccess || isError ? (
        <LoadingState isSuccess={isSuccess} isLoading={isLoading} onRetry={handleRetry} />
      ) : (
        LETTERS.map((letter) => (
          <UniformTable
            key={letter}
            letter={letter}
            columns={columns}
            tableData={tableData}
            editingCell={editingCell}
            editValue={editValue}
            onAddRow={handleAddRow}
            onCellClick={handleCellClick}
            onCellEdit={handleCellEdit}
            onDeleteRow={handleDeleteRow}
            onToggleConfirm={handleToggleConfirm}
            setEditValue={setEditValue}
            setEditingCell={setEditingCell}
          />
        ))
      )}

      <Dialog
        open={openEmptyTeamsDialog}
        onClose={() => setOpenEmptyTeamsDialog(false)}
      >
        <DialogTitle>Confirmar envio</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Os seguintes esboços não possuem jogadores cadastrados:
            {emptyTeams.map(team => ` ${team}`).join(', ')}
            <br /><br />
            Deseja continuar mesmo assim?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEmptyTeamsDialog(false)}>Cancelar</Button>
          <Button onClick={() => {
            setOpenEmptyTeamsDialog(false);
            submitData();
          }} color="primary" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
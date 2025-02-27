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

  const [tableData, setTableData] = useState<TableData>({
    'A': [
      { id: 1, data: ["M", "João Silva", "10", "G", "G"], confirmed: false },
      { id: 2, data: ["M", "Pedro Santos", "7", "M", "M"], confirmed: false },
      { id: 3, data: ["F", "Maria Oliveira", "11", "M", "M"], confirmed: false },
      { id: 4, data: ["M", "Carlos Souza", "4", "GG", "G"], confirmed: false },
      { id: 5, data: ["F", "Ana Costa", "8", "P", "P"], confirmed: false }
    ],
    'B': [
      { id: 1, data: ["M", "Roberto Lima", "9", "G", "G"], confirmed: false },
      { id: 2, data: ["M", "Lucas Ferreira", "5", "M", "M"], confirmed: false },
      { id: 3, data: ["F", "Paula Ribeiro", "3", "M", "M"], confirmed: false }
    ],
    'C': [
      { id: 1, data: ["M", "André Santos", "15", "XG", "XG"], confirmed: false },
      { id: 2, data: ["F", "Beatriz Lima", "6", "P", "P"], confirmed: false },
      { id: 3, data: ["M", "Marcos Silva", "12", "G", "G"], confirmed: false },
      { id: 4, data: ["F", "Clara Oliveira", "14", "M", "M"], confirmed: false }
    ],
    'D': [
      { id: 1, data: ["M", "Felipe Costa", "2", "G", "G"], confirmed: false },
      { id: 2, data: ["F", "Julia Santos", "1", "M", "M"], confirmed: false },
      { id: 3, data: ["M", "Ricardo Pereira", "13", "GG", "GG"], confirmed: false }
    ]
  });

  const [editingCell, setEditingCell] = useState<{ letter: string; rowId: number; colIndex: number } | null>(null);
  const [editValue, setEditValue] = useState("");

  const [openEmptyTeamsDialog, setOpenEmptyTeamsDialog] = useState(false);
  const [emptyTeams, setEmptyTeams] = useState<string[]>([]);

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
            onCellClick={handleCellClick}
            onCellEdit={handleCellEdit}
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
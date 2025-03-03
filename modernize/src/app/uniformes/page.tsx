'use client'

import { useState, useEffect } from "react";
import { Box, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, CircularProgress } from "@mui/material";
import { useSearchParams } from 'next/navigation';
import { useFetch } from "@/utils/useFetch";
import { Column, TableData, UniformData } from "./types";
import { PageHeader } from "./PageHeader";
import { UniformTable } from "./UniformTable";
import { LoadingState } from "./LoadingState";
import { NoDataFound } from "./NoDataFound";

const ADULT_SIZES_M = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG', 'XXXG'];
const ADULT_SIZES_F = ['P', 'M', 'G', 'GG', 'XG', 'XXG', 'XXXG'];
const KIDS_SIZES = ['2', '4', '6', '8', '10', '12', '14', '16'];

export default function UniformBackofficeScreen() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const { data: uniformData, loading: isLoadingData, error: fetchError, fetchData } = useFetch<UniformData[]>();
  const [initialLoading, setInitialLoading] = useState(true);

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

  const [tableData, setTableData] = useState<TableData>({});

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

    const availableSketches = Object.keys(tableData);
    const emptyTeams = availableSketches.filter(letter => !tableData[letter] || tableData[letter].length === 0);
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

  useEffect(() => {
    if (orderId) {
      const apiUrl = `${process.env.NEXT_PUBLIC_API}/api/orcamento/uniformes/${orderId}`;
      fetchData(apiUrl);
    }
  }, [orderId]);

  useEffect(() => {
    if (!isLoadingData && uniformData) {
      const transformedData: TableData = {};

      uniformData.forEach(uniform => {
        const letter = uniform.esboco;
        if (uniform.configuracoes && uniform.configuracoes.length > 0) {
          transformedData[letter] = uniform.configuracoes.map((config, index) => ({
            id: index + 1,
            data: [
              config.genero || '',
              config.nome_jogador || '',
              config.numero || '',
              config.tamanho_camisa || '',
              config.tamanho_shorts || ''
            ],
            confirmed: false
          }));
        } else {
          transformedData[letter] = Array(uniform.quantidade_jogadores).fill(null).map((_, index) => ({
            id: index + 1,
            data: ['', '', '', '', ''],
            confirmed: false
          }));
        }
      });

      setTableData(transformedData);
      setInitialLoading(false);
    }
  }, [uniformData, isLoadingData]);

  if (initialLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {fetchError && (
        <NoDataFound
          type="error"
          message={`Erro ao carregar dados dos uniformes: ${fetchError.message}`}
        />
      )}

      {!fetchError && (
        <>
          {isLoadingData ? (
            <LoadingState isLoading={true} isSuccess={false} onRetry={() => { }} />
          ) : (
            <>
              {uniformData && uniformData.length === 0 ? (
                <NoDataFound
                  type="info"
                  title="Nenhum uniforme encontrado"
                  message="Não existem uniformes cadastrados para este pedido."
                />
              ) : (
                <>
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
                    uniformData && Object.keys(tableData).map((letter) => (
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
                </>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
}
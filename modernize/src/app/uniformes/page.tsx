'use client'

import { useState } from "react";
import { Box } from "@mui/material";
import { useSearchParams } from 'next/navigation';
import { Column, TableData } from "./types";
import { PageHeader } from "./PageHeader";
import { UniformTable } from "./UniformTable";

const SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG'];
const LETTERS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

export default function UniformBackofficeScreen() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');

  const [columns] = useState<Column[]>([
    { id: 1, name: "Gênero", type: "select", options: ['M', 'F', 'I'] },
    { id: 2, name: "Nome do jogador(a)", type: "text" },
    { id: 3, name: "Número", type: "number" },
    { id: 4, name: "Tamanho da camisa", type: "select", options: SIZES },
    { id: 5, name: "Tamanho do shorts", type: "select", options: SIZES },
  ]);

  const [tableData, setTableData] = useState<TableData>(
    LETTERS.reduce((acc, letter) => ({
      ...acc,
      [letter]: [
        { id: 1, data: ["M", "John Smith", "10", "G", "M"] },
      ],
    }), {} as TableData)
  );

  const [editingCell, setEditingCell] = useState<{ letter: string; rowId: number; colIndex: number } | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleAddRow = (letter: string) => {
    const letterRows = tableData[letter] || [];
    const newRow = {
      id: letterRows.length + 1,
      data: columns.map(() => ""),
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
          return { ...row, data: newData };
        }
        return row;
      }),
    }));
    setEditingCell(null);
    setEditValue('');
  };

  const handleConfirm = () => {
    console.log('Dados confirmados:', tableData);
  };

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader orderId={orderId} onConfirm={handleConfirm} />
      
      {LETTERS.map((letter) => (
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
          setEditValue={setEditValue}
          setEditingCell={setEditingCell}
        />
      ))}
    </Box>
  );
}
'use client'
import React, { useState, useEffect } from "react";
import PageContainer from "@/app/components/container/PageContainer";
import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import ApexPedidosTotal from "@/app/components/charts/TotalPedidos";
import ParentCard from "@/app/components/shared/ParentCard";

interface Pedidos {
  total_orcamento: number;
  id: number;
  orcamento_id: number;
  created_at: string;
}

const ValorTotalPedidosComponent = () => {
  const [dados, setDados] = useState<Pedidos[]>([]);
  const [tipoGrafico, setTipoGrafico] = useState("linha"); // Estado para o tipo de gráfico

  // Pega token do localStorage
  const accessToken = typeof window !== "undefined" ? localStorage.getItem('accessToken') : null;

  if (!accessToken) {
    // console.error('Access token is missing');
    console.error('Access token is missing');
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) {
        return console.log('Token de acesso não disponível');
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/vendas/pedido-total`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          return console.log('erro:', res)
        }

        const data = await res.json();
        setDados(data);
        // console.log('dados:', data);
      } catch (error) {
        console.log(error);
      } 
    };

    fetchData();
  }, [accessToken]);

  useEffect(() => {
    if (dados) {
      setDados(dados);
    }
  }, [dados]);

  const handleTipoGraficoChange = (event: SelectChangeEvent<string>) => {
    setTipoGrafico(event.target.value); // Altera o tipo de gráfico
  };

  return (
    <PageContainer title="Relatório de Vendas - Pedidos" description="Total dos Pedidos por dia">

      {/* Seleção de tipo de gráfico */}
      <div style={{ marginBottom: '20px' }}>
        <FormControl fullWidth>
          <InputLabel id="grafico-select-label">Escolha o tipo de gráfico</InputLabel>
          <Select
            labelId="grafico-select-label"
            id="graficoSelect"
            value={tipoGrafico}
            onChange={handleTipoGraficoChange}
            label="Escolha o tipo de gráfico"
          >
            <MenuItem value="linha">Linha - Dias</MenuItem>
            <MenuItem value="barras">Barras - Mês</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Passando dados para o gráfico */}
      <div style={{ marginBottom: '50px' }}>
          {dados.length > 0 ? (
            <>
              <ApexPedidosTotal totalOrcamentos={dados} tipoGrafico={tipoGrafico} />
            </>
          ) : (
            <div>Sem dados disponíveis para exibir.</div>
          )}
      </div>
    </PageContainer>
  );
};

export default ValorTotalPedidosComponent;

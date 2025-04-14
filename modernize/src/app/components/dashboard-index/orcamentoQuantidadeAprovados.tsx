'use client'
import React, { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import Typography from "@mui/material/Typography";

const VendasRelatoriosQuantidadeOrcamentosComponent = () => {
  const [total, setTotal] = useState(0);

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    throw new Error('Access token is missing');
  }

  const { isFetching, error } = useQuery({
    queryKey: ['quantidadeOrcamentosAprovadosData'],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API}/api/vendas/quantidade-orcamentos-aprovados`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }).then(async (res) => {
        if (!res.ok) {
          // Se a resposta não estiver ok, obtenha o texto para ajudar na depuração
          const errorText = await res.text();
          throw new Error(`Erro ${res.status}: ${errorText}`);
        }
        // Tente ler a resposta como texto primeiro, para evitar a exceção de JSON vazio
        const text = await res.text();
        if (!text) {
          throw new Error("Resposta vazia da API");
        }
        try {
          return JSON.parse(text);
        } catch (err) {
          throw new Error("Falha ao converter resposta para JSON: " + err);
        }
      }).then((res) => res.json()).then(data => setTotal(data.totalOrcamentosAprovados)),
  });

  return (
    <div>
      <Typography variant="h6" component="p" gutterBottom>
        Aprovados:
        <strong style={{ backgroundColor: '#0b73e5', color: 'white', borderRadius: '5px', padding: '0.25rem 0.5rem', margin: '0.5rem' }}>{total}</strong>
      </Typography>
    </div>
  );
};

export default VendasRelatoriosQuantidadeOrcamentosComponent;

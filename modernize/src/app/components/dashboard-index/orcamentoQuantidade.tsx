'use client'
import React, { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import Typography from "@mui/material/Typography";

const VendasRelatoriosOrcamentosComponent = () => {
  const [total, setTotal] = useState(0);

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    // throw new Error('Access token is missing');
    console.error('Access token is missing');
  }

  const { isFetching, error } = useQuery({
    queryKey: ['quantidadeOrcamentosData'],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API}/api/vendas/quantidade-orcamentos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((res) => res.json()).then(data => setTotal(data.totalOrcamentos)),
  });

  return (
    <div>
      <Typography variant="h6" component="p" gutterBottom>
        Total:
        <strong style={{ backgroundColor: '#0b73e5', color: 'white', borderRadius: '5px', padding: '0.25rem 0.5rem', margin: '0.5rem' }}>{total}</strong>
      </Typography>
    </div>
  );
};

export default VendasRelatoriosOrcamentosComponent;

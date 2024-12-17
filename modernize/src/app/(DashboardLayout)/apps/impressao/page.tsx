'use client';

import React, { useState, useEffect } from 'react';
import { unstable_noStore as noStore } from 'next/cache';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import { DataGrid } from '@mui/x-data-grid';

interface Pedido {
  id: number;
  numero_pedido: string;
  data_prevista: string;
  pedido_produto_categoria: string;
  pedido_material: number;
  medida_linear: number;
  designer_id: number;
  pedido_status_id: number;
  pedido_tipo_id: number;
}

const ImpressaoScreen = () => {
  noStore();

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    // Log fetching data for current page
    console.log(`Fetching data for page: ${currentPage}`);
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page: number) => {
    try {
      const accessToken = localStorage.getItem('accessToken');

      const response = await fetch(`process.env.NEXT_PUBLIC_API/api/pedido?page=${page}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const data: { data: Pedido[]; total_count: number; per_page: number } = await response.json();

      setPedidos(data.data);
      setTotalPages(Math.ceil(data.total_count / data.per_page));

      // Log successful data fetch
      console.log(`Successfully fetched data for page: ${currentPage}`);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const columns = [
    { field: 'numero_pedido', headerName: 'Pedido', width: 150 },
    { field: 'data_prevista', headerName: 'Data Prevista', width: 150 },
    { field: 'pedido_produto_categoria', headerName: 'Tipos de Produtos', width: 200 },
    { field: 'pedido_material', headerName: 'Material', width: 100 },
    { field: 'medida_linear', headerName: 'Medida Linear', width: 100 },
    { field: 'designer_id', headerName: 'Designer', width: 150 },
    { field: 'pedido_status_id', headerName: 'Status', width: 100 },
    { field: 'pedido_tipo_id', headerName: 'Tipo de Pedido', width: 150 },
  ];

  return (
    <PageContainer title="Contas a Pagar e a Receber / Adicionar" description="Contas a Pagar e a Receber da Arte Arena">
      <Breadcrumb title="Contas a Pagar e a Receber / Adicionar" subtitle="Gerencie as contas a pagar e a receber da Arte Arena / Adicionar" />
      <ParentCard title="Impressão">
        <div>
          <div style={{ marginTop: '10px' }}>
            Medida Linear:
          </div>
          <div style={{ marginTop: '10px' }}>
            Tempo Estimado:
          </div>
          <DataGrid
            rows={pedidos}
            columns={columns}
            // pageSize={10} // Adjust as needed
            // rowsPerPageOptions={[5, 10, 20]}
          // Additional features like sorting, filtering can be added here
          />
        </div>
      </ParentCard>
    </PageContainer>
  );
};

export default ImpressaoScreen
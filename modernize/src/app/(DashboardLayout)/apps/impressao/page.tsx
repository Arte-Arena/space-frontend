'use client'

import React, { useState, useEffect } from 'react';
import { unstable_noStore as noStore } from 'next/cache';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

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
    // Fetch the initial page of data from the API
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page: number) => {
    try {
      const accessToken = localStorage.getItem('accessToken');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/pedido?page=${page}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data: { data: Pedido[]; total_count: number; per_page: number } = await response.json();

      setPedidos(data.data);

      setTotalPages(Math.ceil(data.total_count / data.per_page));
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

  return (
    <PageContainer title="Contas a Pagar e a Receber / Adicionar" description="Contas a Pagar e a Receber da Arte Arena">
      <Breadcrumb title="Contas a Pagar e a Receber / Adicionar" subtitle="Gerencie as contas a pagar e a receber da Arte Arena / Adicionar" />
      <ParentCard title="Impressão">
        <div>
          Impressão
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Pedido</TableCell>
                  <TableCell>Data Prevista</TableCell>
                  <TableCell>Tipos de Produtos</TableCell>
                  <TableCell>Material</TableCell>
                  <TableCell>Medida Linear</TableCell>
                  <TableCell>Designer</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Tipo de Pedido</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pedidos?.map((pedido: Pedido) => (
                  <TableRow key={pedido.id}>
                    <TableCell>{pedido.numero_pedido}</TableCell>
                    <TableCell>{pedido.data_prevista}</TableCell>
                    <TableCell>{pedido.pedido_produto_categoria}</TableCell>
                    <TableCell>{pedido.pedido_material}</TableCell>
                    <TableCell>{pedido.medida_linear}</TableCell>
                    <TableCell>{pedido.designer_id}</TableCell>
                    <TableCell>{pedido.pedido_status_id}</TableCell>
                    <TableCell>{pedido.pedido_tipo_id}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </ParentCard>
    </PageContainer>
  );
};

export default ImpressaoScreen;

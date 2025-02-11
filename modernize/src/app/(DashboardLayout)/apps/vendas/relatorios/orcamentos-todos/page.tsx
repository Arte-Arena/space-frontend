'use client'
import React, { useState } from "react";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import { useQuery } from '@tanstack/react-query';
import { DataGrid, GridColDef, GridLogicOperator } from '@mui/x-data-grid';
import CustomToolbar from '@/app/components/DataGridFilters/CustomDataGridFilters';
import { Tooltip, Typography, Box, TextField } from "@mui/material";

interface Orcamento {
  id_orcamento: number;
  cliente_octa_number: number;
  lista_produtos: Produto[];
  user_id: number;
}

interface Produto {
  id: number;
  nome: string;
  preco: number;
  subtotal: number;
  quantidade: number;
}

const BCrumb = [
  { to: "/", title: "Home" },
  { to: '/apps/vendas/', title: "Vendas" },
  { to: '/apps/vendas/relatorios/', title: "Relatórios" },
  { to: '/apps/vendas/relatorios/orcamentos-nao-aprovados/', title: "Orçamentos Não Aprovados" },
];

const VendasRelatoriosTodosOrcamentos = () => {
  const [orcamentosNaoAprovados, setOrcamentosNaoAprovados] = useState<Orcamento[]>([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [filters, setFilters] = useState<{ [key: string]: string }>({});


  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    throw new Error('Access token is missing');
  }

  const { isFetching, error } = useQuery({
    queryKey: ['orcamentosNaoAprovadosData'],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API}/api/vendas/orcamentos-nao-aprovados`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((res) => res.json()).then(data => {
        setOrcamentosNaoAprovados(data);
        return data;
      }),
  });


const filteredRows = orcamentosNaoAprovados.filter((row) => {
  return Object.entries(filters).every(([column, value]) => {
    if (!value) return true;
    return row[column as keyof Orcamento]?.toString().toLowerCase().includes(value.toString().toLowerCase());
  });
});

  // Manipula mudanças nos filtros
  const handleFilterChange = (column: string, value: string) => {
    setFilters((prev) => ({ ...prev, [column]: value }));
  };


  // Define as colunas para o DataGrid
  const columns: GridColDef[] = [
    {
      field: 'id_orcamento',
      headerName: 'ID Orçamento',
      width: 120
    },
    {
      field: 'cliente_octa_number',
      headerName: 'Cliente',
      width: 150
    },
    {
      field: 'quantidade_items_total',
      headerName: 'Total de Itens',
      width: 150,
    },
    {
      field: 'produtos',
      headerName: 'Produtos',
      width: 300,
      renderCell: (params) => {
        const orcamento = params.row as Orcamento;
        if (!orcamento.lista_produtos || orcamento.lista_produtos.length === 0) {
          return <Typography variant="body2" color="textSecondary">Sem produtos</Typography>;
        }

        return (
          <Tooltip
            title={
              <Box component="ul" sx={{ paddingLeft: '16px', margin: 0 }}>
                {orcamento.lista_produtos.map((produto) => (
                  <li key={produto.id}>
                    {produto.nome} (x{produto.quantidade})
                  </li>
                ))}
              </Box>
            }
            arrow
          >
            <Typography variant="body2" noWrap>
              <ul style={{ paddingLeft: '16px', margin: 0 }}>
                {orcamento.lista_produtos.map((produto) => (
                  <li key={produto.id} style={{ listStyleType: 'disc' }}>
                    {produto.nome} (x{produto.quantidade})
                  </li>
                ))}
              </ul>
            </Typography>
          </Tooltip>
        );
      }
    },
    {
      field: 'data',
      headerName: 'Data',
      width: 150,
      renderCell: (params) => {
        const data = params.row.data;
        const dataString = data.split(" ")[0]
        return (
          <Typography variant="body2">
            {dataString.toLocaleString('pt-BR')}
          </Typography>
        );
      }
    },
    {
      field: 'vendedor',
      headerName: 'Vendedor',
      width: 150
    },
    {
      field: 'valor_total',
      headerName: 'Valor Total',
      width: 150,
      renderCell: (params) => {
        const valorTotal = params.row.valor_total;
        return (
          <Typography variant="body2">
            {valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </Typography>
        );
      }
    }
  ];

  return (
    <PageContainer title="Relatório de Vendas - Orçamentos Não Aprovados" description="Histórico de Orçamentos Não Aprovados">
      <Breadcrumb title="Relatorio de Vendas - Orçamentos Não Aprovados" items={BCrumb} />

      <>
      <div style={{ marginBottom: '1rem' }}>
        <Typography variant="h6" component="p" gutterBottom>Filtrar Resultados:</Typography>
        <Box display="flex" gap={2}>
          <TextField
            label="ID Orçamento"
            variant="outlined"
            size="small"
            onChange={(e) => handleFilterChange('id_orcamento', e.target.value)}
          />
          <TextField
            label="Cliente"
            variant="outlined"
            size="small"
            onChange={(e) => handleFilterChange('cliente_octa_number', e.target.value)}
          />
          <TextField
            label="Vendedor"
            variant="outlined"
            size="small"
            onChange={(e) => handleFilterChange('vendedor', e.target.value)}
          />
          <TextField
            label="Valor Total"
            variant="outlined"
            size="small"
            onChange={(e) => handleFilterChange('valor_total', e.target.value)}
          />
        </Box>
      </div>

        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            autoHeight
            rows={filteredRows}
            // rows={orcamentosNaoAprovados as Orcamento[]}
            columns={columns}
            getRowId={(row) => row.id_orcamento}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 25]}
            loading={isFetching}
            slots={{ toolbar: CustomToolbar }}
            initialState={{
              filter:{
                filterModel:{
                  items: [],
                  logicOperator: GridLogicOperator.And,
                }
              }
            }}
            disableRowSelectionOnClick
          />
        </div>

        {error && <Typography color="error">Erro ao buscar dados</Typography>}
      </>
    </PageContainer>
  );
};

export default VendasRelatoriosTodosOrcamentos;

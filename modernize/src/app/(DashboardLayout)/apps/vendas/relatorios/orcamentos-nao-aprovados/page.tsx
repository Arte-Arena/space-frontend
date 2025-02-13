'use client'
import React, { useMemo, useState } from "react";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import { useQuery } from '@tanstack/react-query';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Tooltip, Typography, Box, TextField, Grid, Button } from "@mui/material";
import CustomToolbar from "@/app/components/DataGridFilters/CustomDataGridFilters";

interface Orcamento {
  id_orcamento: number;
  data: string;
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

const VendasRelatoriosOrcamentosNaoAprovados = () => {
  const [orcamentosNaoAprovados, setOrcamentosNaoAprovados] = useState<Orcamento[]>([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  // Filtragem daqui pra baixo:
  const [dateFilter, setDateFilter] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [filters, setFilters] = useState({
    cliente_octa_number: "",
    id_orcamento: "",
    vendedor: "",
    valor_total: "",
  }); 

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

  //Filtragem:
  const filteredRows = useMemo(() => {
    return orcamentosNaoAprovados.filter((row) => {
      // Verificar se cada coluna e filtro se aplicam
      return Object.entries(filters).every(([column, value]) => {
        if (!value) return true;
        const rowValue = row[column as keyof Orcamento];
        return rowValue?.toString().toLowerCase().includes(value.toLowerCase());
      }) && 
      // Filtro de data
      (!dateFilter.start || new Date(row.data) >= new Date(dateFilter.start)) &&
      (!dateFilter.end || new Date(row.data) <= new Date(dateFilter.end)) 
    });
  }, [orcamentosNaoAprovados, filters, dateFilter]);

  // Manipula mudanças nos filtros
  const handleFilterChange = (column: string, value: string ) => {
    setFilters((prev) => ({ ...prev, [column]: value }));
  };

  // Função para limpar os filtros
  const handleClearFilters = () => {
    setFilters({
      cliente_octa_number: "",
      id_orcamento: "",
      vendedor: "",
      valor_total: "",
    });
    setDateFilter({ start: '', end: '' });
  }


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
          <Typography variant="h6" component="p" gutterBottom style={{ marginBottom: '2rem' }}>
            Orçamentos Não Aprovados:
          </Typography>
          
          <Box display="flex" gap={2} flexWrap="wrap" >
            <TextField
              label="ID Orçamento"
              variant="outlined"
              size="small"
              value={filters.id_orcamento}
              onChange={(e) => handleFilterChange('id_orcamento', e.target.value)}
            />

            <TextField
              label="Cliente"
              variant="outlined"
              size="small"
              value={filters.cliente_octa_number}
              onChange={(e) => handleFilterChange('cliente_octa_number', e.target.value)}
            />
            <TextField
              label="Vendedor"
              variant="outlined"
              size="small"
              type=""
              value={filters.vendedor}
              onChange={(e) => handleFilterChange('vendedor', e.target.value)}
            />

            {/*Filtro de Data Personalizado */}
            <TextField
              label="Data Inicial"
              type="date"
              size="small"
              value={dateFilter.start}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setDateFilter((prev) => ({ ...prev, start: e.target.value }))}
            />
            <TextField
              label="Data Final"
              type="date"
              size="small"
              value={dateFilter.end}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setDateFilter((prev) => ({ ...prev, end: e.target.value }))}
            />
            
            {/* Botão para limpar os filtros */}
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleClearFilters}
              >
                Limpar Filtro
              </Button>
            </Grid>

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
            disableRowSelectionOnClick
          />
        </div>

        {error && <Typography color="error">Erro ao buscar dados</Typography>}
      </>
    </PageContainer>
  );
};

export default VendasRelatoriosOrcamentosNaoAprovados;

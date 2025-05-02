'use client';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import ParentCard from '@/app/components/shared/ParentCard';
import { Button, Grid, InputAdornment, LinearProgress, Pagination, Stack } from '@mui/material';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import { IconSearch } from '@tabler/icons-react';
import { LoadingButton } from '@mui/lab';
import { Fornecedor } from './components/Types';
import FornecedoresTable from './components/FornecedorTable';

export default function EstoqueScreen() {
  const [query, setQuery] = useState<string>('');
  const [searchDateStart, setSearchDateStart] = useState<string | null>(null);
  const [searchDateEnd, setSearchDateEnd] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const router = useRouter();

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    // throw new Error('Access token is missing');
    console.error('Access token is missing');
    router.push('/auth/login');
  }

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ['Fornecedor', searchQuery, page, searchDateEnd, searchDateStart],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_API}/api/fornecedores?` +
        `q=${encodeURIComponent(searchQuery)}` +
        `&page=${page}` +
        `&data_inicial=${searchDateStart}&data_final=${searchDateEnd}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      ).then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json() as Promise<any>;
      }),
  });

  const handleCleanSearch = () => {
    setQuery('');
    setSearchDateStart(null);
    setSearchDateEnd(null);
    setPage(1);
    setSearchQuery('');
    // refetch();
  };
  const handleSearch = () => {
    setSearchQuery(query);
    setPage(1);
    refetch();
  };

  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  if (error) return <p>Erro na pagina de Fornecedores: {(error as Error).message}</p>;

  return (
    <PageContainer title="Fornecedores" description="Fornecedores">
      <Breadcrumb title="Fornecedores" subtitle='Fornecedores' />
      <ParentCard title="Fornecedores">
        <>
          {/* Campo de busca com botão */}
          <Grid container spacing={2} alignItems="center" mb={2}>
            {/* 1️⃣ Primeiro campo ocupa 4/12 colunas */}
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                placeholder="Buscar por nome ou email ou celular..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconSearch />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            {/* <Grid item xs={12} sm={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Data Inicial"
                  value={searchDateStart ? parseISO(searchDateStart) : null}
                  onChange={(newDate) => setSearchDateStart(newDate ? format(newDate, 'yyyy-MM-dd') : null)}
                  renderInput={(params: TextFieldProps) => (
                    <CustomTextField
                      {...params}
                      error={false}
                      size="small"
                    />
                  )}
                  inputFormat="dd/MM/yyyy"
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Data Final"
                  value={searchDateEnd ? parseISO(searchDateEnd) : null}
                  onChange={(newDate) => setSearchDateEnd(newDate ? format(newDate, 'yyyy-MM-dd') : null)}
                  renderInput={(params: TextFieldProps) => (
                    <CustomTextField
                      {...params}
                      error={false}
                      size="small"
                    />
                  )}
                  inputFormat="dd/MM/yyyy"
                />
              </LocalizationProvider>
            </Grid> */}

            {/* 5️⃣ Botão ocupa 1/12 colunas */}
            <Grid item xs={12} sm={1}>
              <LoadingButton
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSearch}
                loading={isFetching}
                startIcon={<IconSearch />}
              >
                Buscar
              </LoadingButton>
            </Grid>

            <Grid item xs={12} sm={1}>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                onClick={handleCleanSearch}
                startIcon={<IconSearch />}
              >
                Limpar
              </Button>
            </Grid>
          </Grid>

          {/* Tabela */}
          {data && <FornecedoresTable data={data.data as Fornecedor[]} />}

          {/* Paginação */}
          {data && (
            <Stack spacing={2} mt={2} alignItems="center">
              <Pagination
                count={Math.ceil(data.total / data.per_page)}
                page={data.current_page}
                onChange={handlePageChange}
              />
            </Stack>
          )}
          {(isFetching) && (
            <LinearProgress
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 9999,
              }}
            />
          )}
        </>
      </ParentCard>
    </PageContainer>
  );
}

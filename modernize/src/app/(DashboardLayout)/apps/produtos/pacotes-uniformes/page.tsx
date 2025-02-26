'use client';
import React, { useState, useEffect } from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import { IconSearch } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';

import { Typography, Card, CardContent, List, ListItem, ListItemText, Grid, Stack, Button } from "@mui/material";

const ProdutosBuscarScreen = () => {
  const accessToken = localStorage.getItem('accessToken');
  
  const { data: pacotesUniforme, isLoading: isLoadingPacotesUniforme } = useQuery({
    queryKey: ['pacotes-uniforme'],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API}/api/produto/pacote/uniforme/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }).then((res) => res.json()),
  });

  useEffect(() => {
    console.log(pacotesUniforme);
  }, [pacotesUniforme]);

  return (
    <PageContainer title="Produtos / Pacotes de Uniformes" description="Pacotes de Uniformes da Arte Arena">
      <Breadcrumb title="Produtos / Pacotes de Uniformes" subtitle="Gerencie Produtos da Arte Arena / Pacotes de Uniformes" />
      <ParentCard title="Pacotes de Uniformes">

        <>

          {isLoadingPacotesUniforme ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={2}>
              {pacotesUniforme?.map((pacote: any) => (
                <Grid item xs={12} sm={6} md={4} key={pacote.id}>
                  <Card>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {pacote.nome}
                      </Typography>
                      <List dense={true}> {/* Adicionando dense={true} para reduzir o espaçamento */}
                        <ListItem>
                          <ListItemText primary="Tecido da camisa" secondary={pacote.tipo_de_tecido_camisa} />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Tecido do calção" secondary={pacote.tipo_de_tecido_calcao} />
                        </ListItem>
                        {/* ... outros ListItems ... */}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>

      </ParentCard>
    </PageContainer>
  );
};

export default ProdutosBuscarScreen;
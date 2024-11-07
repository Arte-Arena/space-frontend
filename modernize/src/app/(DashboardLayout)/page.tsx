'use client'

import Box from '@mui/material/Box'
import { useEffect, useState } from 'react';
import PageContainer from '@/app/components/container/PageContainer';
import { useAuth } from '@/utils/useAuth';

export default function Dashboard() {

  const isLoggedIn = useAuth();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    setLoading(false);
  }, [isLoggedIn]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box mt={3}>
        Página principal do Space.
      </Box>
    </PageContainer>
  )
}

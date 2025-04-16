'use client'
import Grid from '@mui/material/Grid'
import PageContainer from '@/app/components/container/PageContainer';
import ProfileBanner from '@/app/components/apps/userprofile/profile/ProfileBanner';
import { useRouter } from 'next/navigation';

const SuperAdmin = () => {
  const router = useRouter();

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    console.error('Access token not found. Redirecting to login page...');
    router.push('/auth/login');
  }

  return (
    <PageContainer title="Perfil" description="Perfil do Usuário">
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <ProfileBanner />
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default SuperAdmin;

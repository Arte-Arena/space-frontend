import Grid from '@mui/material/Grid'
import PageContainer from '@/app/components/container/PageContainer';
import ProfileBanner from '@/app/components/apps/userprofile/profile/ProfileBanner';


const SuperAdmin = () => {
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

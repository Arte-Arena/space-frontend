import Grid from '@mui/material/Grid'
import PageContainer from '@/app/components/container/PageContainer';

import ProfileBanner from '@/app/components/apps/userprofile/profile/ProfileBanner';
import IntroCard from '@/app/components/apps/userprofile/profile/IntroCard';
import PhotosCard from '@/app/components/apps/userprofile/profile/PhotosCard';
import Post from '@/app/components/apps/userprofile/profile/Post';

const UserProfile = () => {
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

export default UserProfile;

import PageContainer from '@/app/components/container/PageContainer';
import HeaderAlert from '../../components/frontend-pages/shared/header/HeaderAlert';
import HpHeader from '../../components/frontend-pages/shared/header/HpHeader';
import C2a from '../../components/frontend-pages/shared/c2a';
import Footer from '../../components/frontend-pages/shared/footer';
import Banner from '../../components/frontend-pages/portfolio/Banner';
import ScrollToTop from '../../components/frontend-pages/shared/scroll-to-top';
import GalleryCard from '@/app/components/apps/userprofile/gallery/GalleryCard';
import { Box, Container } from '@mui/material';

const PricingPage = () => {
    return (
        <PageContainer title="Portfolio" description="this is Portfolio">

            <HeaderAlert />
            <HpHeader />
            <Banner />
            <Box my={3}>
                <Container maxWdith="lg">
                    <GalleryCard />
                </Container>
            </Box>
            <C2a />
            <Footer />
            <ScrollToTop />
        </PageContainer>
    );
};

export default PricingPage;

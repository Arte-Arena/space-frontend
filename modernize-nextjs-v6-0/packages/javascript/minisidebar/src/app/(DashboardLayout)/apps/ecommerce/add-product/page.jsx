import { Box, Button, Grid, Stack } from '@mui/material';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';

import GeneralCard from '@/app/components/apps/ecommerce/productAdd/GeneralCard';
import MediaCard from '@/app/components/apps/ecommerce/productAdd/Media';
import VariationCard from '@/app/components/apps/ecommerce/productAdd/VariationCard';
import PricingCard from '@/app/components/apps/ecommerce/productAdd/Pricing';
import Thumbnail from '@/app/components/apps/ecommerce/productAdd/Thumbnail';
import StatusCard from '@/app/components/apps/ecommerce/productAdd/Status';
import ProductDetails from '@/app/components/apps/ecommerce/productAdd/ProductDetails';
import ProductTemplate from '@/app/components/apps/ecommerce/productAdd/ProductTemplate';
import BlankCard from '@/app/components/shared/BlankCard';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Add Product',
  },
];

const EcommerceAddProduct = () => {
  return (
    <PageContainer title="Add Product" description="this is Add Product">
      {/* breadcrumb */}
      <Breadcrumb title="Add Product" items={BCrumb} />
      <form>
        <Grid container spacing={3}>
          <Grid item lg={8}>
            <Stack spacing={3}>
              <BlankCard>
                <GeneralCard />
              </BlankCard>

              <BlankCard>
                <MediaCard />
              </BlankCard>

              <BlankCard>
                <VariationCard />
              </BlankCard>

              <BlankCard>
                <PricingCard />
              </BlankCard>
            </Stack>


          </Grid>

          <Grid item lg={4}>
            <Stack spacing={3}>
              <BlankCard>
                <Thumbnail />
              </BlankCard>

              <BlankCard>
                <StatusCard />
              </BlankCard>

              <BlankCard>
                <ProductDetails />
              </BlankCard>

              <BlankCard>
                <ProductTemplate />
              </BlankCard>
            </Stack>
          </Grid>
        </Grid>

        <Stack direction="row" spacing={2} mt={3}>
          <Button variant="contained" color="primary">Save Changes</Button>
          <Button variant="outlined" color="error">Cancel</Button>
        </Stack>
      </form>
    </PageContainer>
  );
};

export default EcommerceAddProduct;

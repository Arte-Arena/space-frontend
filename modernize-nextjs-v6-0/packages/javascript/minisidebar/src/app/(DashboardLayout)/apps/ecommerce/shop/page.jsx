import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import ProductShop from '@/app/components/apps/ecommerce/productGrid';
import PageContainer from '@/app/components/container/PageContainer';
import AppCard from '@/app/components/shared/AppCard';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Shop',
  },
];
const Ecommerce = () => {


  return (
    <PageContainer title="Shop" description="this is Shop">
      {/* breadcrumb */}
      <Breadcrumb title="Shop" items={BCrumb} />
      <AppCard>
        <ProductShop />
      </AppCard>
    </PageContainer>
  );
};

export default Ecommerce;

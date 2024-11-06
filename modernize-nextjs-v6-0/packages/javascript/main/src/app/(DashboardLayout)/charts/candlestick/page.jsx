import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import CandelStick from '@/app/components/charts/CandelStick';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Candlestick Chart',
  },
];

const CandlestickChart = () => {


  return (
    <PageContainer title="Candlestick Chart" description="this is Candlestick Chart">
      {/* breadcrumb */}
      <Breadcrumb title="Candlestick Chart" items={BCrumb} />
      {/* end breadcrumb */}
      <CandelStick />
    </PageContainer>
  );
};

export default CandlestickChart;

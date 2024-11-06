import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import GradientChart from '@/app/components/charts/GradientChart';


const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Gradient Chart',
  },
];

const Gradient = () => {


  return (
    <PageContainer title="Gradient Chart" description="this is Gradient Chart">
      {/* breadcrumb */}
      <Breadcrumb title="Gradient Chart" items={BCrumb} />
      {/* end breadcrumb */}
      <GradientChart />
    </PageContainer>
  );
};

export default Gradient;

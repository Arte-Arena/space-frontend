import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import RadialApexChart from '@/app/components/charts/RadialApexChart';


const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Radialbar Chart',
  },
];

const RadialbarChart = () => {

  return (
    <PageContainer title="Radialbar Chart" description="this is Radialbar Chart">
      {/* breadcrumb */}
      <Breadcrumb title="Radialbar Chart" items={BCrumb} />
      {/* end breadcrumb */}
      <RadialApexChart />
    </PageContainer>
  );
};

export default RadialbarChart;

import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import DoughNutChart from '@/app/components/charts/DoughNutChart';


const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Doughtnut Chart',
  },
];

const DoughnutChart = () => {



  return (
    <PageContainer title="Doughnut Chart" description="this is Doughnut Chart">
      {/* breadcrumb */}
      <Breadcrumb title="Doughtnut Chart" items={BCrumb} />
      <DoughNutChart />
    </PageContainer>
  );
};

export default DoughnutChart;

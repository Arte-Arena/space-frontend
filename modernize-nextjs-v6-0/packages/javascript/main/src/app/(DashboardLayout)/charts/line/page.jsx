import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import LineApexChart from '@/app/components/charts/LineApexChart';


const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Line Chart',
  },
];

const LineChart = () => {


  return (
    <PageContainer title="Line Chart" description="this is Line Chart">
      {/* breadcrumb */}
      <Breadcrumb title="Line Chart" items={BCrumb} />
      {/* end breadcrumb */}
      <LineApexChart />
    </PageContainer>
  );
};

export default LineChart;

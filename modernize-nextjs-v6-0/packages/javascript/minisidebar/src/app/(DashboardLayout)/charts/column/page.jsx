import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import ColumnApexChart from '@/app/components/charts/ColumnChart';


const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Column Chart',
  },
];

const ColumnChart = () => {


  return (
    <PageContainer title="Column Chart" description="this is Column Chart">
      {/* breadcrumb */}
      <Breadcrumb title="Column Chart" items={BCrumb} />
      {/* end breadcrumb */}
      <ColumnApexChart />
    </PageContainer>
  );
};

export default ColumnChart;

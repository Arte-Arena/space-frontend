import PageContainer from '@/app/components/container/PageContainer';
import DashboardCard from '@/app/components/shared/DashboardCard';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';

const Icons = () => {
  return (
    <PageContainer title="Icons" description="this is Icons">
      {/* breadcrumb */}
      <Breadcrumb title="Tabler Icons" subtitle="Icons" />
      <DashboardCard title="Icons">
        <iframe src="https://tabler-icons.io/" title="Inline Frame Example" frameBorder={0}
          width="100%"
          height="650"></iframe>
      </DashboardCard>
    </PageContainer>
  );
};

export default Icons;

import Typography from '@mui/material/Typography'
import PageContainer from "@/app/components/container/PageContainer";
import DashboardCard from "@/app/components/shared/DashboardCard";
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';

export default function SamplePage() {
  return (
    <PageContainer title="Sample Page" description="this is Sample page">
       {/* breadcrumb */}
       <Breadcrumb title="Sample Page" subtitle="Sample Page" />
      <DashboardCard title="Sample Page">
        <Typography>This is a sample2 page</Typography>
      </DashboardCard>
    </PageContainer>
  );
};



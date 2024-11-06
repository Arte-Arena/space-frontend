import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import NotesApp from '@/app/components/apps/notes/index'

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Notes',
  },
];

export default function Notes() {

  return (
    <PageContainer title="Note App" description="this is Note App">
      <Breadcrumb title="Note app" items={BCrumb} />
      <NotesApp />
    </PageContainer>
  );
}

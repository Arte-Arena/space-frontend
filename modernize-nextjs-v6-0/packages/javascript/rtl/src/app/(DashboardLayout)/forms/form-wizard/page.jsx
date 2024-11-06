import React from 'react';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import FormWizardCode from '@/app/components/forms/form-wizard/code/FormWizardCode';
import ParentCard from '@/app/components/shared/ParentCard';
import FormWizardSteps from '@/app/components/forms/form-wizard/FormWizardSteps';


const FormWizard = () => {

  return (
    <PageContainer title="Form Wizard" description="this is Form Wizard">
      <Breadcrumb title="Form Wizard" subtitle="this is Form Wizard page" />
      <ParentCard title="Form Wizard" codeModel={<FormWizardCode />}>
        <FormWizardSteps />
      </ParentCard>
    </PageContainer>
  );
};

export default FormWizard;

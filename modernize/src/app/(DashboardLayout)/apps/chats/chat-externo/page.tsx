import React from "react";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import AppCard from "@/app/components/shared/AppCard";
import ChatsApp from "@/app/components/apps/chats";



const ChatExternoScreen = () => {
  
  return (
    <PageContainer title="Chat" description="this is Chat">
      <Breadcrumb title="Chat Externo" subtitle="Atendimento Externo" />
      <AppCard>
        <ChatsApp />
      </AppCard>
    </PageContainer>
  );
};

export default ChatExternoScreen;

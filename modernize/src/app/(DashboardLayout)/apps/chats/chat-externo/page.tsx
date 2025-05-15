'use client'

import React from "react";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import AppCard from "@/app/components/shared/AppCard";
import ChatsApp from "@/app/components/apps/chats";
import { useRouter } from "next/navigation";

const ChatExternoScreen = () => {
  const router = useRouter();
  const accessToken = localStorage.getItem('accessToken');
  const roles = localStorage.getItem('roles')?.split(',').map(Number) || [];
  const allowedRoles = [1, 9];
  const canShowChatExterno = roles.some(role => allowedRoles.includes(role));

  if (!accessToken || !canShowChatExterno) {
    router.push('/');
    return null;
  }


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

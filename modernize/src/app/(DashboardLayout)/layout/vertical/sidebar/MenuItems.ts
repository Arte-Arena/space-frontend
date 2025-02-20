import { uniqueId } from "lodash";
import {
  IconBrandProducthunt,
  IconBrandCashapp,
  IconFlag,
  IconReportMoney,
  IconPrinter,
  IconNeedleThread,
  IconBrush,
  IconReplace,
  IconBuildingStore,
  IconBuildingFactory,
  IconZoomMoney,
  IconStack3,
  IconCalendar,
  IconBuilding,
  IconMessage2,
  IconReportAnalytics,
  IconMessage2Dollar,
  IconBrandSlack,
  IconBusinessplan,
  IconLink,
  IconPencil,
  IconChartBar
} from "@tabler/icons-react";

interface MenuitemsType {
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: any;
  href?: string;
  children?: MenuitemsType[];
  chip?: string;
  chipColor?: string;
  variant?: string;
  external?: boolean;
}

// Função para verificar se o usuário é superUser
const checkSuperUser = (): boolean => {
  if (typeof window === "undefined") return false;
  const rolesString = localStorage.getItem("roles");
  if (!rolesString) return false;
  const roles = rolesString.split(",").map((role) => role.trim());
  return roles.includes("1");
};

// Item do menu de custo de bandeira
const custoBandeiraItem: MenuitemsType = {
  id: uniqueId(),
  title: "Custo de Bandeira",
  icon: IconFlag,
  href: "/apps/orcamento/custo-bandeira",
};

// Função que gera o menu atualizado dinamicamente
const getMenuItems = (): MenuitemsType[] => {
  const isSuperUser = checkSuperUser();

  const menuItems: MenuitemsType[] = [
    {
      navlabel: true,
      subheader: "Apps",
    },
    {
      id: uniqueId(),
      title: "Produtos",
      icon: IconBrandProducthunt,
      href: "/apps/produtos/buscar",
    },
    {
      id: uniqueId(),
      title: "Contas",
      icon: IconBrandCashapp,
      href: "/apps/contas-pagar-receber",
      children: [
        {
          id: uniqueId(),
          title: "Adicionar Conta",
          icon: IconBrandCashapp,
          href: "/apps/contas-pagar-receber/adicionar",
        },
        {
          id: uniqueId(),
          title: "Buscar Conta",
          icon: IconBrandCashapp,
          href: "/apps/contas-pagar-receber/buscar",
        },
        {
          id: uniqueId(),
          title: "Relatórios de Contas",
          icon: IconBrandCashapp,
          href: "/apps/contas-pagar-receber/relatorios",
        },
      ],
    },
    {
      id: uniqueId(),
      title: "Orçamento",
      icon: IconReportMoney,
      href: "/apps/orcamento",
      children: [
        {
          id: uniqueId(),
          title: "Gerar Orçamento",
          icon: IconReportMoney,
          href: "/apps/orcamento/gerar",
        },
        {
          id: uniqueId(),
          title: "Editar Orçamento",
          icon: IconPencil,
          href: "/apps/orcamento/editar",
        },
        {
          id: uniqueId(),
          title: "Buscar Orçamento",
          icon: IconZoomMoney,
          href: "/apps/orcamento/buscar",
        },
        {
          id: uniqueId(),
          title: "Status de Orçamento",
          icon: IconZoomMoney,
          href: "/apps/orcamento/status",
        },
        {
          id: uniqueId(),
          title: "Orçamento Status Trello",
          icon: IconChartBar,
          href: "/apps/orcamento/status-trello",
        },
        {
          id: uniqueId(),
          title: "Backoffice",
          icon: IconBuilding,
          href: "/apps/orcamento/backoffice",
        },
        {
          id: uniqueId(),
          title: "Preco de Bandeira",
          icon: IconFlag,
          href: "/apps/orcamento/preco-bandeira",
        },
        ...(isSuperUser ? [custoBandeiraItem] : []),
      ],
    },
    {
      id: uniqueId(),
      title: "Vendas",
      icon: IconBuildingStore,
      href: "/apps/vendas",
      children: [
        {
          id: uniqueId(),
          title: "CRM",
          icon: IconBusinessplan,
          href: "/apps/vendas/crm",
        },
        {
          id: uniqueId(),
          title: "Relatórios de Vendas",
          icon: IconReportAnalytics,
          href: "/apps/vendas/relatorios",
        },
      ],
    },
    {
      id: uniqueId(),
      title: "Chats",
      icon: IconMessage2,
      href: "/apps/chats",
      children: [
        {
          id: uniqueId(),
          title: "Chat Interno",
          icon: IconBrandSlack,
          href: "/apps/chats/chat-interno",
        },
        {
          id: uniqueId(),
          title: "Atendimento Externo",
          icon: IconMessage2Dollar,
          href: "/apps/chats/chatbot",
        },
      ],
    },
    {
      id: uniqueId(),
      title: "Produção",
      icon: IconBuildingFactory,
      href: "/apps/orcamento",
      children: [
        {
          id: uniqueId(),
          title: "Arte Final",
          icon: IconBrush,
          href: "/apps/arte-final",
        },
        {
          id: uniqueId(),
          title: "Impressão",
          icon: IconPrinter,
          href: "/apps/impressao",
        },
        {
          id: uniqueId(),
          title: "Confecção",
          icon: IconNeedleThread,
          href: "/apps/confeccao",
        },
      ],
    },
    {
      id: uniqueId(),
      title: "Reposição",
      icon: IconReplace,
      href: "/apps/reposicao",
    },
    {
      id: uniqueId(),
      title: "Encurtador de Link",
      icon: IconLink,
      href: "/apps/encurtador-link",
    },
    {
      id: uniqueId(),
      title: "Calendar",
      icon: IconCalendar,
      href: "/apps/calendar",
    },
    {
      id: uniqueId(),
      title: "Estoque",
      icon: IconStack3,
      href: "/apps/estoque",
    },
  ];

  return menuItems;
};

// Exporta a função ao invés de um objeto fixo
export default getMenuItems;

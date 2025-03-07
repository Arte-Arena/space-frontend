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
  IconMessage2Dollar,
  IconBrandSlack,
  IconLink,
  IconPencil,
  IconChartBar,
  IconTool,
  IconBrandTrello,
  IconProgressCheck,
  IconCircleCheck,
  IconShirt,
  IconShoppingBagEdit,
  IconListLetters,
  IconSchool,
  IconBuildingBank,
  IconSoccerField,
  IconEye,
  IconDeviceFloppy,
  IconOctahedron,
  IconBusinessplan,
  IconReportAnalytics,
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
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
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

const createCopyLinkHandler = (url: string) => (e: React.MouseEvent<HTMLElement>) => {
  e.preventDefault();
  navigator.clipboard.writeText(url)
    .then(() => {
      alert("Link copiado para a área de transferência!");
    })
    .catch((err) => {
      console.error("Falha ao copiar:", err);
      alert("Erro ao copiar o link.");
    });
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
      children: [
        {
          id: uniqueId(),
          title: "Buscar Produto",
          icon: IconBrandProducthunt,
          href: "/apps/produtos/buscar"
        },
        {
          id: uniqueId(),
          title: "Pacotes de Uniformes",
          icon: IconShirt,
          href: "/apps/produtos/pacotes-uniformes"
        },
        {
          id: uniqueId(),
          title: "Bandeiras Oficiais",
          icon: IconFlag,
          href: "/apps/produtos/bandeiras-oficiais"
        },
        {
          id: uniqueId(),
          title: "Produos Personalizados",
          icon: IconShoppingBagEdit,
          href: "/apps/produtos/produtos-personalizados"
        },
      ]
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
          icon: IconZoomMoney,
          href: "/apps/contas-pagar-receber/buscar",
        },
        {
          id: uniqueId(),
          title: "Relatórios de Contas",
          icon: IconChartBar,
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
          title: "Aprovar Orçamento",
          icon: IconCircleCheck,
          href: "/apps/orcamento/aprovar",
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
          icon: IconProgressCheck,
          href: "/apps/orcamento/status",
        },
        {
          id: uniqueId(),
          title: "Backoffice",
          icon: IconBuilding,
          href: "/apps/orcamento/backoffice",
        },
        {
          id: uniqueId(),
          title: "Catálogos",
          icon: IconListLetters,
          children: [
            {
              id: uniqueId(),
              title: "Geral",
              icon: IconListLetters,
              children: [
                {
                  id: uniqueId(),
                  title: "Visualizar",
                  icon: IconEye,
                  href: "https://eu2.contabostorage.com/266f14ebe17c4c958a0fa24cd49f7719:mkt/Cat%C3%A1logo%20-%20Arte%20Arena%20(2025).pdf",
                },
                {
                  id: uniqueId(),
                  title: "Copiar Link",
                  icon: IconDeviceFloppy,
                  href: "#",
                  onClick: createCopyLinkHandler("https://eu2.contabostorage.com/266f14ebe17c4c958a0fa24cd49f7719:mkt/Cat%C3%A1logo%20-%20Arte%20Arena%20(2025).pdf")
                },
              ]
            },
            {
              id: uniqueId(),
              title: "Atléticas",
              icon: IconSchool,
              children: [
                {
                  id: uniqueId(),
                  title: "Visualizar",
                  icon: IconEye,
                  href: "https://eu2.contabostorage.com/266f14ebe17c4c958a0fa24cd49f7719:mkt/Cat%C3%A1logo%20-%20Atl%C3%A9tica%20%20interclasse.pdf",
                },
                {
                  id: uniqueId(),
                  title: "Copiar Link",
                  icon: IconDeviceFloppy,
                  href: "#",
                  onClick: createCopyLinkHandler("https://eu2.contabostorage.com/266f14ebe17c4c958a0fa24cd49f7719:mkt/Cat%C3%A1logo%20-%20Atl%C3%A9tica%20%20interclasse.pdf")
                },
              ]
            },
            {
              id: uniqueId(),
              title: "Política",
              icon: IconBuildingBank,
              children: [
                {
                  id: uniqueId(),
                  title: "Visualizar",
                  icon: IconEye,
                  href: "https://eu2.contabostorage.com/266f14ebe17c4c958a0fa24cd49f7719:mkt/Cat%C3%A1logo%20-%20Politica.pdf",
                },
                {
                  id: uniqueId(),
                  title: "Copiar Link",
                  icon: IconDeviceFloppy,
                  href: "#",
                  onClick: createCopyLinkHandler("https://eu2.contabostorage.com/266f14ebe17c4c958a0fa24cd49f7719:mkt/Cat%C3%A1logo%20-%20Politica.pdf")
                },
              ]
            },
            {
              id: uniqueId(),
              title: "Times",
              icon: IconSoccerField,
              children: [
                {
                  id: uniqueId(),
                  title: "Visualizar",
                  icon: IconEye,
                  href: "https://eu2.contabostorage.com/266f14ebe17c4c958a0fa24cd49f7719:mkt/Cat%C3%A1logo%20-%20TIMES.pdf",
                },
                {
                  id: uniqueId(),
                  title: "Copiar Link",
                  icon: IconDeviceFloppy,
                  href: "#",
                  onClick: createCopyLinkHandler("https://eu2.contabostorage.com/266f14ebe17c4c958a0fa24cd49f7719:mkt/Cat%C3%A1logo%20-%20TIMES.pdf")
                },
              ]
            },
          ]
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
          icon: IconBrandTrello,
          href: "/apps/vendas/crm",
        },
        {
          id: uniqueId(),
          title: "Relatórios de Vendas",
          icon: IconChartBar,
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
          href: "/apps/producao/arte-final",
        },
        {
          id: uniqueId(),
          title: "Impressão",
          icon: IconPrinter,
          href: "/apps/producao/impressao",
        },
        {
          id: uniqueId(),
          title: "Confecção",
          icon: IconNeedleThread,
          href: "/apps/producao/confeccao",
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
    {
      id: uniqueId(),
      title: "OctaDesk",
      icon: IconOctahedron,
      href: "/apps/octadesk",
    },
  ];

  return menuItems;
};

// Exporta a função ao invés de um objeto fixo
export default getMenuItems;

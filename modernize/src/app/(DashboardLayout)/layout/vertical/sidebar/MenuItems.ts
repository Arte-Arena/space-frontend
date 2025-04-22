import { uniqueId } from "lodash";
import {
  IconBrandProducthunt,
  IconBrandCashapp,
  IconFlag,
  IconReportMoney,
  IconPrinter,
  IconNeedleThread,
  IconBrush,
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
  IconChartBar,
  IconBrandTrello,
  IconShirt,
  IconShoppingBagEdit,
  IconListLetters,
  IconSchool,
  IconBuildingBank,
  IconSoccerField,
  IconEye,
  IconDeviceFloppy,
  IconBusinessplan,
  IconReportAnalytics,
  IconMoneybag,
  IconFolder,
  IconTools,
  IconCalendarTime,
  IconRoad,
  IconIroning,
  IconCut,
  IconPalette,
  IconCards
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
      subheader: "Menu",
    },
    {
      id: uniqueId(),
      title: "Comercial",
      icon: IconBuildingStore,
      children: [
        {
          id: uniqueId(),
          title: "CRM",
          icon: IconBrandTrello,
          href: "/apps/vendas/crm",
        },
        {
          id: uniqueId(),
          title: "Relatórios",
          icon: IconChartBar,
          href: "/apps/vendas/relatorios",
        },
        {
          id: uniqueId(),
          title: "Chat",
          icon: IconMessage2,
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
              href: "/apps/chats/chat-externo",
            },
          ],
        },
        {
          id: uniqueId(),
          title: "Gerar Orçamento",
          icon: IconReportMoney,
          href: "/apps/orcamento/gerar",
        },
        {
          id: uniqueId(),
          title: "Buscar Orçamento",
          icon: IconZoomMoney,
          href: "/apps/orcamento/buscar",
        },
        {
          id: uniqueId(),
          title: "Recursos",
          icon: IconTools,
          children: [
            {
              id: uniqueId(),
              title: "Preço de Bandeira",
              icon: IconFlag,
              href: "/apps/orcamento/preco-bandeira",
            },
            {
              id: uniqueId(),
              title: "Encurtador de Link",
              icon: IconLink,
              href: "/apps/encurtador-link",
            },
            {
              id: uniqueId(),
              title: "Contagem Dias Úteis",
              icon: IconCalendarTime,
              href: "/apps/dias-uteis",
            },
          ],
        },
        {
          id: uniqueId(),
          title: "Documentos",
          icon: IconFolder,
          href: "/apps/documentos",
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
      ],
    },
    {
      id: uniqueId(),
      title: "BackOffice",
      icon: IconBuilding,
      href: "/apps/orcamento/backoffice",
    },
    {
      id: uniqueId(),
      title: "Design",
      icon: IconPalette,
      children: [
        {
          id: uniqueId(),
          title: "Arte Final",
          icon: IconBrush,
          href: "/apps/producao/arte-final",

        },
        {
          id: uniqueId(),
          title: "Recursos",
          icon: IconCards,
          children: [
            {
              id: uniqueId(),
              title: "Esboço",
              icon: IconEye,
              href: "/apps/recursos/esboco",
            },
            // {
            //   id: uniqueId(),
            //   title: "",
            //   icon: IconDeviceFloppy,
            //   href: "#",
            //   onClick: createCopyLinkHandler("/apps/recursos/esboco")
            // },
          ]
        }
      ]
    },
    {
      id: uniqueId(),
      title: "Produção",
      icon: IconBuildingFactory,
      children: [
        {
          id: uniqueId(),
          title: "Impressão",
          icon: IconPrinter,
          href: "/apps/producao/impressao",
        },
        {
          id: uniqueId(),
          title: "Sublimação",
          icon: IconIroning,
          href: "/apps/producao/confeccao/sublimacao",
        },
        {
          id: uniqueId(),
          title: "Corte & Conferência",
          icon: IconCut,
          href: "/apps/producao/confeccao/corte-conferencia",
        },
        {
          id: uniqueId(),
          title: "Costura",
          icon: IconNeedleThread,
          href: "/apps/producao/confeccao/costura",
        },
        {
          id: uniqueId(),
          title: "Relatórios",
          icon: IconChartBar,
          href: "/apps/producao/relatorios",
        },
      ],
    },
    {
      id: uniqueId(),
      title: "Expedição",
      icon: IconRoad,
      href: "/apps/expedicao",
    },
    {
      id: uniqueId(),
      title: "Gerência",
      icon: IconBusinessplan,
      children: [
        ...(isSuperUser ? [{
          id: uniqueId(),
          title: "Custo de Bandeira",
          icon: IconFlag,
          href: "/apps/orcamento/custo-bandeira",
        }] : []),
        {
          id: uniqueId(),
          title: "Relatórios",
          icon: IconReportAnalytics,
          href: "/apps/gerencia/relatorios",
        },
        {
          id: uniqueId(),
          title: "Estoque",
          icon: IconStack3,
          href: "/apps/estoque",
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
              title: "Produtos Personalizados",
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
              title: "Pagamentos",
              icon: IconMoneybag,
              href: "/apps/contas-pagar-receber/pagamentos",
            },
            {
              id: uniqueId(),
              title: "Relatórios de Contas",
              icon: IconChartBar,
              href: "/apps/contas-pagar-receber/relatorios",
            },
          ],
        },
      ],
    },
    {
      id: uniqueId(),
      title: "Calendário",
      icon: IconCalendar,
      href: "/apps/calendar",
    },
  ];

  return menuItems;
};

// Exporta a função ao invés de um objeto fixo
export default getMenuItems;

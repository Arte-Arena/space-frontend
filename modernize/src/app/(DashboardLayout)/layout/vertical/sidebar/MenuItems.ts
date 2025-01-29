import { uniqueId } from "lodash";

interface MenuitemsType {
  [x: string]: any;
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
import {
  IconBrandProducthunt,
  IconBrandCashapp,
  IconFlag,
  IconReportMoney,
  IconPrinter,
  IconNeedleThread,
  IconBrush,
  IconReplace,
  IconClipboardList,
  IconBuildingStore,
  IconBuildingFactory,
  IconZoomMoney,
  IconStack3,
  IconAward,
  IconBoxMultiple,
  IconPoint,
  IconAlertCircle,
  IconNotes,
  IconCalendar,
  IconBuilding,
  IconMail,
  IconTicket,
  IconEdit,
  IconGitMerge,
  IconCurrencyDollar,
  IconApps,
  IconFileDescription,
  IconFileDots,
  IconFiles,
  IconBan,
  IconStar,
  IconMoodSmile,
  IconBorderAll,
  IconBorderHorizontal,
  IconBorderInner,
  IconBorderVertical,
  IconBorderTop,
  IconUserCircle,
  IconPackage,
  IconMessage2,
  IconBasket,
  IconChartLine,
  IconChartArcs,
  IconChartCandle,
  IconChartArea,
  IconChartDots,
  IconChartDonut3,
  IconChartRadar,
  IconLogin,
  IconUserPlus,
  IconRotate,
  IconBox,
  IconShoppingCart,
  IconAperture,
  IconLayout,
  IconSettings,
  IconHelp,
  IconZoomCode,
  IconBoxAlignBottom,
  IconBoxAlignLeft,
  IconBorderStyle2,
  IconLockAccess,
  IconAppWindow,
  IconNotebook,
  IconFileCheck,
  IconReportAnalytics,
  IconMessage,
  IconMessage2Dollar,
  IconBrandSlack,
  IconBusinessplan,
  IconLink,
} from "@tabler/icons-react";

const Menuitems: MenuitemsType[] = [
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
        title: "Buscar Orçamento",
        icon: IconZoomMoney,
        href: "/apps/orcamento/buscar",
      },
      {
        id: uniqueId(),
        title: "Backoffice",
        icon: IconBuilding,
        href: "/apps/orcamento/backoffice",
      },
      {
        id: uniqueId(),
        title: "Custo de Bandeira",
        icon: IconFlag,
        href: "/apps/custo-bandeira",
      },
    ]
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
    ]
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
    ]
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
    ]
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

export default Menuitems;

import { usePathname } from "next/navigation";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch, useSelector } from '@/store/hooks';
import { AppState } from '@/store/store';
import { toggleMobileSidebar } from '@/store/customizer/CustomizerSlice';
import { 
  IconSettings,
  IconShirt,
  IconFileInvoice
} from '@tabler/icons-react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';

const SidebarItems = () => {
  const pathname = usePathname();
  const customizer = useSelector((state: AppState) => state.customizer);
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg'));
  const hideMenu: any = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';
  const dispatch = useDispatch();

  const menuItems = [
    {
      id: 'budget',
      title: 'Gerar Orçamento',
      icon: IconFileInvoice,
      href: '/client/budget'
    },
    {
      id: 'uniforms',
      title: 'Uniformes',
      icon: IconShirt,
      href: '/client/uniforms'
    },
    {
      id: 'settings',
      title: 'Configurações',
      icon: IconSettings,
      href: '/client/settings'
    }
  ];

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        {menuItems.map((item) => (
          <ListItem
            button
            component={Link}
            href={item.href}
            key={item.id}
            onClick={() => dispatch(toggleMobileSidebar())}
            sx={{
              mb: 1,
              py: 1.5,
              px: 2,
              borderRadius: '8px',
              backgroundColor: pathname === item.href ? 'primary.light' : 'transparent',
              color: pathname === item.href ? 'primary.main' : 'inherit',
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'primary.main',
              },
              ...(hideMenu && {
                justifyContent: 'center',
              }),
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: '36px',
                color: pathname === item.href ? 'primary.main' : 'inherit',
                ...(hideMenu && {
                  minWidth: '0',
                  mr: 0,
                }),
              }}
            >
              <item.icon size="20" />
            </ListItemIcon>
            {!hideMenu && (
              <ListItemText 
                primary={item.title}
                primaryTypographyProps={{
                  variant: 'body1',
                  fontWeight: pathname === item.href ? 'bold' : 'normal',
                }}
              />
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SidebarItems; 
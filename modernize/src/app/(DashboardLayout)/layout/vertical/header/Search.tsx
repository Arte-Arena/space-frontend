import { useState } from 'react';
import {
  IconButton,
  Dialog,
  DialogContent,
  Stack,
  Divider,
  Box,
  List,
  ListItemText,
  Typography,
  TextField,
  ListItemButton,
} from '@mui/material';
import { IconSearch, IconX } from '@tabler/icons-react';
import getMenuItems from '../sidebar/MenuItems';
import Link from 'next/link';

interface MenuType {
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: any;
  href?: string;
  children?: MenuType[];
  chip?: string;
  chipColor?: string;
  variant?: string;
  external?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

const Menuitems = getMenuItems();

const Search = () => {
  // drawer top
  const [showDrawer2, setShowDrawer2] = useState(false);
  const [search, setSearch] = useState('');

  const handleDrawerClose2 = () => {
    setShowDrawer2(false);
  };

  const filterRoutes = (routes: MenuType[], searchText: string): MenuType[] => {
    if (!searchText) return routes;

    return routes.filter((item) => {
      // Se o item tem título e href, verifica se o href contém o texto de busca
      if (item.title && item.href) {
        return item.href.toLowerCase().includes(searchText.toLowerCase()) ||
               item.title.toLowerCase().includes(searchText.toLowerCase());
      }

      // Se tem filhos, busca recursivamente
      if (item.children && item.children.length > 0) {
        const filteredChildren = filterRoutes(item.children, searchText);
        if (filteredChildren.length > 0) {
          return {
            ...item,
            children: filteredChildren
          };
        }
      }

      return false;
    });
  };

  const searchData = filterRoutes(Menuitems, search);

  const renderMenuItem = (menu: MenuType) => {
    // Se for um item de navegação com label, não renderiza
    if (menu.navlabel) return null;

    // Se for um item sem filhos
    if (menu.title && !menu.children) {
      return (
        <ListItemButton 
          sx={{ py: 0.5, px: 1 }} 
          component={Link}
          href={menu.href || '#'}
          onClick={menu.onClick}
        >
          <ListItemText
            primary={menu.title}
            secondary={menu.href}
            sx={{ my: 0, py: 0.5 }}
          />
        </ListItemButton>
      );
    }

    // Se tiver filhos, renderiza recursivamente
    if (menu.children) {
      return (
        <>
          {menu.title && (
            <ListItemText
              primary={menu.title}
              sx={{ my: 0.5, py: 0.5, px: 1, fontWeight: 'bold' }}
            />
          )}
          {menu.children.map((child) => (
            <Box key={child.id || child.title} sx={{ pl: 2 }}>
              {renderMenuItem(child)}
            </Box>
          ))}
        </>
      );
    }

    return null;
  };

  return (
    <>
      <IconButton
        aria-label="search"
        color="inherit"
        aria-controls="search-menu"
        aria-haspopup="true"
        onClick={() => setShowDrawer2(true)}
        size="large"
      >
        <IconSearch size="16" />
      </IconButton>
      <Dialog
        open={showDrawer2}
        onClose={() => setShowDrawer2(false)}
        fullWidth
        maxWidth={'sm'}
        aria-labelledby="search-dialog"
        PaperProps={{ sx: { position: 'fixed', top: 30, m: 0 } }}
      >
        <DialogContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              id="search-input"
              placeholder="Pesquisar..."
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              inputProps={{ 'aria-label': 'campo de pesquisa' }}
              autoFocus
            />
            <IconButton size="small" onClick={handleDrawerClose2}>
              <IconX size="18" />
            </IconButton>
          </Stack>
        </DialogContent>
        <Divider />
        <Box p={2} sx={{ maxHeight: '60vh', overflow: 'auto' }}>
          <Typography variant="h5" p={1}>
            Links Rápidos
          </Typography>
          <List component="nav">
            {searchData.map((menu) => (
              <Box key={menu.id || menu.title || menu.subheader}>
                {renderMenuItem(menu)}
              </Box>
            ))}
          </List>
        </Box>
      </Dialog>
    </>
  );
};

export default Search;

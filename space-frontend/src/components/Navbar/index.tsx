'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Image from 'next/image';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function NavBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleClick}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{
              '& .MuiMenu-paper': {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
              },
            }}
          >
            <MenuItem onClick={handleClose}>Option 1</MenuItem>
            <MenuItem onClick={handleClose}>Option 2</MenuItem>
            <MenuItem onClick={handleClose}>Option 3</MenuItem>
          </Menu>

          <Image
            src="/logo-arte-arena.webp"
            alt="Descrição da imagem"
            width={80}
            height={28.75}
          />

          <Typography component="div" sx={{ mr: 2, px: 2 }}>
            Space
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Button
            startIcon={<AccountCircleIcon />}
            color="inherit"
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

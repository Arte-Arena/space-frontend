'use client';
import React from 'react';
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import NoteList from './NoteList';

const drawerWidth = 260;

const NoteSidebar = ({ isMobileSidebarOpen, onSidebarClose }) => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        zIndex: lgUp ? 0 : 1,
        [`& .MuiDrawer-paper`]: { position: 'relative' },
      }}
      open={isMobileSidebarOpen}
      onClose={onSidebarClose}
      variant={lgUp ? 'persistent' : 'temporary'}
    >
      <NoteList />
    </Drawer>
  );
};

export default NoteSidebar;

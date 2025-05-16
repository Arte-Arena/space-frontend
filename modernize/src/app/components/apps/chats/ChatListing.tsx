// components/apps/chats/ChatListing.tsx
'use client'

import React, { useState } from 'react'
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  InputAdornment,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Typography,
  Divider,
  Collapse,
} from '@mui/material'
import { IconChevronDown, IconSearch } from '@tabler/icons-react'
import { useSelector, useDispatch } from '@/store/hooks'
import Scrollbar from '../../custom-scroll/Scrollbar'
import {
  SelectChat,
  SearchChat,
} from '@/store/apps/chat/ChatSlice'
import type { ChatsType } from '../../../(DashboardLayout)/types/apps/chat'
import { last } from 'lodash'
import { formatDistanceToNowStrict } from 'date-fns'
import { ExpandLess, ExpandMore } from '@mui/icons-material'

const ChatListing = () => {
  const dispatch = useDispatch()

  const activeChat = useSelector((state) => state.chatReducer.chatContent)
  const chatSearch = useSelector((state) => state.chatReducer.chatSearch)
  const chatsStatus = useSelector((state) => state.chatReducer.chatsStatus)

  const chats = useSelector((state) =>
    state.chatReducer.chats.filter((t: ChatsType) =>
      t.name.toLocaleLowerCase().includes(chatSearch.toLocaleLowerCase())
    )
  )

  const getDetails = (conversation: ChatsType) => {
    const lastMsg = last(conversation.messages)
    return lastMsg?.msg || ''
  }

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(e.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const [openFilters, setOpenFilters] = useState(true)

  return (
    <Box display="flex" width={520}>
      {/* Inside Sidebar de Filtros */}
      <Box
        width={180}
        borderRight={(theme) => `1px solid ${theme.palette.divider}`}
        sx={{ backgroundColor: 'background.paper', height: '100%', overflowY: 'auto' }}
        p={2}
      >
        <Typography variant="h6" mb={2}>Filtros</Typography>
        <List>
          <ListItemButton>
            <ListItemText primary="Todas as conversas" />
          </ListItemButton>
          <ListItemButton>
            <ListItemText primary="Minhas conversas" />
          </ListItemButton>
          <ListItemButton>
            <ListItemText primary="Não respondidas" />
          </ListItemButton>
          <Divider sx={{ my: 1 }} />
          <ListItemButton onClick={() => setOpenFilters(!openFilters)}>
            <ListItemText primary="Por setor" />
            {openFilters ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openFilters} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemText primary="Comercial" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemText primary="Suporte" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemText primary="Financeiro" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Box>

      {/* Lista de Contatos */}
      <Box width={340}>
        {/* Profile */}
        <Box display="flex" alignItems="center" gap="10px" p={3}>
          <Badge
            variant="dot"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            overlap="circular"
            color="success"
          >
            <Avatar
              alt="Remy Sharp"
              src="/images/profile/user-1.jpg"
              sx={{ width: 54, height: 54 }}
            />
          </Badge>
          <Box>
            <Typography variant="body1" fontWeight={600}>
              {localStorage.getItem('name')}
            </Typography>
            <Typography variant="body2">{localStorage.getItem('email')}</Typography>
          </Box>
        </Box>

        {/* Search */}
        <Box px={3} py={1}>
          <TextField
            placeholder="Search contacts"
            size="small"
            type="search"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconSearch size={16} />
                </InputAdornment>
              ),
            }}
            onChange={(e) => dispatch(SearchChat(e.target.value))}
          />
        </Box>

        {/* Contact List */}
        <List sx={{ px: 0 }}>
          <Box px={2.5} pb={1}>
            <Button onClick={handleClick} color="inherit">
              Recent Chats <IconChevronDown size={16} />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{ 'aria-labelledby': 'basic-button' }}
            >
              <MenuItem onClick={handleClose}>Sort By Time</MenuItem>
              <MenuItem onClick={handleClose}>Sort By Unread</MenuItem>
              <MenuItem onClick={handleClose}>Mark all Read</MenuItem>
            </Menu>
          </Box>

          <Scrollbar
            sx={{
              height: { lg: 'calc(100vh - 100px)', md: '100vh' },
              maxHeight: '600px',
            }}
          >
            {chatsStatus === 'loading' ? (
              <Box m={2}>
                <Alert severity="info" variant="filled">
                  Carregando contatos...
                </Alert>
              </Box>
            ) : chats.length > 0 ? (
              chats.map((chat) => (
                <ListItemButton
                  key={chat.id}
                  selected={activeChat === chat.id}
                  onClick={() => dispatch(SelectChat(String(chat.id)))}
                  sx={{ mb: 0.5, py: 2, px: 3, alignItems: 'start' }}
                >
                  <ListItemAvatar>
                    <Badge
                      color={
                        chat.status === 'online'
                          ? 'success'
                          : chat.status === 'busy'
                          ? 'error'
                          : chat.status === 'away'
                          ? 'warning'
                          : 'secondary'
                      }
                      variant="dot"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      overlap="circular"
                    >
                      <Avatar
                        alt={chat.name}
                        src={chat.thumb}
                        sx={{ width: 42, height: 42 }}
                      />
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" fontWeight={600} mb={0.5}>
                        {chat.name}
                      </Typography>
                    }
                    secondary={getDetails(chat)}
                    secondaryTypographyProps={{ noWrap: true }}
                    sx={{ my: 0 }}
                  />
                  {chat.createdAt && (
                    <Box flexShrink={0} mt={0.5}>
                      <Typography variant="body2">
                        {formatDistanceToNowStrict(new Date(chat.createdAt), {
                          addSuffix: false,
                        })}
                      </Typography>
                    </Box>
                  )}
                </ListItemButton>
              ))
            ) : (
              <Box m={2}>
                <Alert severity="warning" variant="filled">
                  Nenhum contato encontrado!
                </Alert>
              </Box>
            )}
          </Scrollbar>
        </List>
      </Box>
    </Box>
  )
}

export default ChatListing

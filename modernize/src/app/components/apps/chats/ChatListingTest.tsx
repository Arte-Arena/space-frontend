'use client';
import React, { useEffect, useState } from "react";
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Scrollbar from "../../custom-scroll/Scrollbar";
import { formatDistanceToNowStrict } from "date-fns";
import { IconChevronDown, IconSearch } from "@tabler/icons-react";

interface OctaChat {
  id: string;
  number: number;
  channel: string;
  status: string;
  lastMessageDate: string;
  contact: {
    name: string;
    phoneContacts: {
      number: string;
    }[];
    organization: {
      name: string;
    };
  };
  unreadMessages: boolean;
}

const ChatListingTest = () => {
  const [chats, setChats] = useState<OctaChat[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeChat, setActiveChat] = useState<string | null>(null);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const accessToken = localStorage.getItem("accessToken");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/chats-octa`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },

        });
        const data = await res.json();
        setChats(data);
        console.log(data);
      } catch (error) {
        console.error('Erro ao buscar chats:', error);
      }
    };

    fetchData();
  }, []);

  const filteredChats = chats.filter((chat) =>
    chat.contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Perfil */}
      <Box display={"flex"} alignItems="center" gap="10px" p={3}>
        <Badge
          variant="dot"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          overlap="circular"
          color="success"
        >
          <Avatar
            alt="Usuário"
            src="/images/profile/user-1.jpg"
            sx={{ width: 54, height: 54 }}
          />
        </Badge>
        <Box>
          <Typography variant="body1" fontWeight={600}>
            Mathew Anderson
          </Typography>
          <Typography variant="body2">Designer</Typography>
        </Box>
      </Box>

      {/* Campo de busca */}
      <Box px={3} py={1}>
        <TextField
          id="outlined-search"
          placeholder="Buscar contatos"
          size="small"
          type="search"
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconSearch size={"16"} />
              </InputAdornment>
            ),
          }}
          fullWidth
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      {/* Lista de contatos */}
      <List sx={{ px: 0 }}>
        <Box px={2.5} pb={1}>
          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            color="inherit"
          >
            Recentes <IconChevronDown size="16" />
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{ "aria-labelledby": "basic-button" }}
          >
            <MenuItem onClick={handleClose}>Ordenar por tempo</MenuItem>
            <MenuItem onClick={handleClose}>Ordenar por não lidas</MenuItem>
            <MenuItem onClick={handleClose}>Marcar todas como lidas</MenuItem>
          </Menu>
        </Box>

        <Scrollbar
          sx={{
            height: { lg: "calc(100vh - 100px)", md: "100vh" },
            maxHeight: "600px",
          }}
        >
          {filteredChats.length ? (
            filteredChats.map((chat) => (
              <ListItemButton
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                sx={{
                  mb: 0.5,
                  py: 2,
                  px: 3,
                  alignItems: "start",
                }}
                selected={activeChat === chat.id}
              >
                <ListItemAvatar>
                  <Badge
                    color={
                      chat.status === "started"
                        ? "success"
                        : chat.status === "waiting"
                          ? "warning"
                          : "secondary"
                    }
                    variant="dot"
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    overlap="circular"
                  >
                    <Avatar
                      alt={chat.contact.name}
                      src={`/images/profile/user-${Math.floor(Math.random() * 5 + 1)}.jpg`}
                      sx={{ width: 42, height: 42 }}
                    />
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" fontWeight={600} mb={0.5}>
                      {chat.contact.name}
                    </Typography>
                  }
                  secondary={`(${chat.contact.organization.name}) • ${chat.unreadMessages ? "Mensagem não lida" : "Sem mensagens novas"
                    }`}
                  secondaryTypographyProps={{ noWrap: true }}
                  sx={{ my: 0 }}
                />
                <Box sx={{ flexShrink: "0" }} mt={0.5}>
                  <Typography variant="body2">
                    {formatDistanceToNowStrict(new Date(chat.lastMessageDate))}
                  </Typography>
                </Box>
              </ListItemButton>
            ))
          ) : (
            <Box m={2}>
              <Alert severity="info" variant="filled">
                Nenhum chat encontrado.
              </Alert>
            </Box>
          )}
        </Scrollbar>
      </List>
    </div>
  );
};

export default ChatListingTest;

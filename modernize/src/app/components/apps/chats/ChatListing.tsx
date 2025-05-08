import React, { useState } from "react";
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
import { useSelector, useDispatch } from "@/store/hooks";
import Scrollbar from "../../custom-scroll/Scrollbar";
import { SelectChat, SearchChat } from "@/store/apps/chat/ChatSlice";
import type { ChatsType } from '../../../(DashboardLayout)/types/apps/chat';
import { last } from "lodash";
import { formatDistanceToNowStrict } from "date-fns";
import { IconChevronDown, IconSearch } from "@tabler/icons-react";

const ChatListing = () => {
  const dispatch = useDispatch();
  const activeChat = useSelector((state) => state.chatReducer.chatContent);
  const chatSearch = useSelector((state) => state.chatReducer.chatSearch);
  const chats = useSelector((state) =>
    // filtra já o estado atualizado pelo WS
    state.chatReducer.chats.filter((t: ChatsType) =>
      t.name.toLocaleLowerCase().includes(chatSearch.toLocaleLowerCase())
    )
  );

  const filterChats = (chats: ChatsType[], cSearch: string) => {
    if (chats) {
      return chats.filter((t) =>
        t.name.toLocaleLowerCase().includes(cSearch.toLocaleLowerCase())
      );
    }
    return chats;
  };

  const getDetails = (conversation: ChatsType) => {
    const lastMsg = last(conversation.messages);
    return lastMsg?.msg || "";
  };

  // estado do menu de ordenação
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <div>
      {/* Profile */}
      <Box display="flex" alignItems="center" gap="10px" p={3}>
        <Badge
          variant="dot"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
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
            Mathew Anderson
          </Typography>
          <Typography variant="body2">Designer</Typography>
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
            MenuListProps={{ "aria-labelledby": "basic-button" }}
          >
            <MenuItem onClick={handleClose}>Sort By Time</MenuItem>
            <MenuItem onClick={handleClose}>Sort By Unread</MenuItem>
            <MenuItem onClick={handleClose}>Mark all Read</MenuItem>
          </Menu>
        </Box>

        <Scrollbar
          sx={{
            height: { lg: "calc(100vh - 100px)", md: "100vh" },
            maxHeight: "600px",
          }}
        >
          {chats.length > 0 ? (
            chats.map((chat) => (
              <ListItemButton
                key={chat.id}
                selected={activeChat === chat.id}
                onClick={() => dispatch(SelectChat(String(chat.id)))}
                sx={{ mb: 0.5, py: 2, px: 3, alignItems: "start" }}
              >
                <ListItemAvatar>
                  <Badge
                    color={
                      chat.status === "online"
                        ? "success"
                        : chat.status === "busy"
                          ? "error"
                          : chat.status === "away"
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
                      {formatDistanceToNowStrict(
                        new Date(chat.createdAt),
                        { addSuffix: false }
                      )}
                    </Typography>
                  </Box>
                )}
              </ListItemButton>
            ))
          ) : (
            <Box m={2}>
              <Alert severity="error" variant="filled">
                No Contacts Found!
              </Alert>
            </Box>
          )}
        </Scrollbar>
      </List>
    </div>
  );
};

export default ChatListing;

import React, { useState } from "react";
import {
  Stack,
  Collapse,
  Typography,
  Box,
  Paper,
  Grid,
  Alert,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import { styled, Theme } from "@mui/material/styles";
import { ChatsType } from "../../../(DashboardLayout)/types/apps/chat";
import { uniq, flatten } from "lodash";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface chatType {
  isInSidebar?: boolean;
  chat?: ChatsType;
}

const drawerWidth = 320;

const sectionKeys = [
  "detalhes",
  "conversa",
  "contato",
  "classificacao",
  "historico",
] as const;

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  background: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

const StyledStack = styled(Stack)(() => ({
  ".showOnHover": {
    display: "none",
  },
  "&:hover .showOnHover": {
    display: "block",
  },
}));

const ChatInsideSidebar = ({ isInSidebar, chat }: chatType) => {
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));
  const [openSections, setOpenSections] = useState<string[]>([...sectionKeys]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const renderSection = (key: string, title: string, content: React.ReactNode) => {
    const isOpen = openSections.includes(key);
    return (
      <Box key={key}>
        <Item onClick={() => toggleSection(key)} role="button" tabIndex={0}>
          <Typography>{title}</Typography>
          <KeyboardArrowDownIcon
            sx={{
              transition: "transform 0.2s ease",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </Item>
        <Collapse in={isOpen}>
          <Box pt={2}>{content}</Box>
        </Collapse>
      </Box>
    );
  };

  return isInSidebar ? (
    <Box
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        borderLeft: "1px solid",
        right: 0,
        height: "100%",
        background: (theme) => theme.palette.background.paper,
        boxShadow: lgUp ? null : (theme) => theme.shadows[9],
        position: lgUp ? "relative" : "absolute",
        borderColor: (theme) => theme.palette.divider,
      }}
      p={3}
    >
      <StyledStack width="100%" direction="column" spacing={2}>
        {renderSection("detalhes", "Detalhes", <>Detalhes... 1, 2, 3</>)}
        {renderSection("conversa", "Conversa", <>Conversa... 1, 2, 3</>)}
        {renderSection("contato", "Contato", <>Lead ou Cliente... Nome, email, telefone, responsável, número, nickname</>)}
        {renderSection("classificacao", "Classificação", <>Grupo... Segmentação...</>)}
        {renderSection("historico", "Histórico", <>Histórico... orçamentos, pedidos etc</>)}
      </StyledStack>
    </Box>
  ) : null;
};

export default ChatInsideSidebar;

import CodeDialog from "@/app/components/shared/CodeDialog";
import React from "react";
const SimpleListCode = () => {
    return (
        <>
            <CodeDialog>
                {`
"use client";
import BlankCard from '../../shared/BlankCard';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';

import { IconInbox, IconMailOpened } from '@tabler/icons-react';

<BlankCard>
    <List>
        <ListItem disablePadding>
            <ListItemButton>
                <ListItemIcon>
                    <IconInbox width={20} height={20} />
                </ListItemIcon>
                <ListItemText primary="Inbox" />
            </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
            <ListItemButton>
                <ListItemIcon>
                    <IconMailOpened width={20} height={20} />
                </ListItemIcon>
                <ListItemText primary="Drafts" />
            </ListItemButton>
        </ListItem>
    </List>
    <Divider />
    <List>
        <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Trash" />
            </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
            <ListItemButton component="a" href="#simple-list">
              <ListItemText primary="Spam" />
            </ListItemButton>
        </ListItem>
    </List>
</BlankCard>`}
            </CodeDialog>
        </>
    );
};

export default SimpleListCode;
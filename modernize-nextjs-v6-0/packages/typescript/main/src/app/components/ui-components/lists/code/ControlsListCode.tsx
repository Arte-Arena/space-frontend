import CodeDialog from "@/app/components/shared/CodeDialog";
import React from "react";
const ControlsListCode = () => {
    return (
        <>
            <CodeDialog>
                {`
"use client";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Checkbox,
} from '@mui/material';

import { IconMessage } from '@tabler/icons-react';
import BlankCard from '../../shared/BlankCard';

const [checked, setChecked] = React.useState([0]);

const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
};

<BlankCard>
    <List>
        {[0, 1, 2, 3].map((value) => {
            const labelId = 'checkbox-list-label-{value}';

            return (
                <ListItem
                    key={value}
                    secondaryAction={
                        <IconButton edge="end" aria-label="comments">
                            <IconMessage width={20} height={20} />
                        </IconButton>
                    }
                    disablePadding
                >
                    <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                        <ListItemIcon>
                            <Checkbox
                                checked={checked.indexOf(value) !== -1}
                                tabIndex={-1}
                                disableRipple
                                inputProps={{ 'aria-labelledby': labelId }}
                                edge="start"
                            />
                        </ListItemIcon>
                        <ListItemText id={labelId} primary={'Line item {value + 1}'} />
                    </ListItemButton>
                </ListItem>
            );
        })}
    </List>
</BlankCard > `}
            </CodeDialog>
        </>
    );
};

export default ControlsListCode;
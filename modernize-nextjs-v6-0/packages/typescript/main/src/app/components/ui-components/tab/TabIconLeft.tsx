"use client";

import * as React from "react";
import { Box } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import ChildCard from "@/app/components/shared/ChildCard";
import { IconHeart, IconPhone, IconUser } from "@tabler/icons-react";

import IconLeftCode from "@/app/components/ui-components/tab/code/IconLeftCode";

const COMMON_TAB = [
  {
    value: "1",
    icon: <IconPhone width={20} height={20} />,
    label: "Item One",
    disabled: false,
  },
  {
    value: "2",
    icon: <IconHeart width={20} height={20} />,
    label: "Item Two",
    disabled: false,
  },
  {
    value: "3",
    icon: <IconUser width={20} height={20} />,
    label: "Item Three",
    disabled: true,
  },
];

const TabIconLeft = () => {
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <ChildCard title="Icon Left" codeModel={<IconLeftCode />}>
      <TabContext value={value}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="icon tabs example"
        >
          {COMMON_TAB.map((tab) => (
            <Tab
              key={tab.value}
              icon={tab.icon}
              label={tab.label}
              iconPosition="start"
              value={tab.value}
              disabled={tab.disabled}
            />
          ))}
        </Tabs>
        <Box bgcolor="grey.200" mt={2}>
          {COMMON_TAB.map((panel) => (
            <TabPanel key={panel.value} value={panel.value}>
              {panel.label}
            </TabPanel>
          ))}
        </Box>
      </TabContext>
    </ChildCard>
  );
};
export default TabIconLeft;

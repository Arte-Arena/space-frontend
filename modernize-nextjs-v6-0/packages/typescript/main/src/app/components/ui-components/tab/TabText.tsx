"use client";

import * as React from "react";
import { Box, Divider } from "@mui/material";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ChildCard from "@/app/components/shared/ChildCard";
import { IconHeart, IconPhone, IconUser } from "@tabler/icons-react";

import TextCode from "@/app/components/ui-components/tab/code/TextCode";

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

const TabText = () => {
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <ChildCard title="Text" codeModel={<TextCode />}>
      <TabContext value={value}>
        <Box>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            {COMMON_TAB.map((tab, index) => (
              <Tab
                key={tab.value}
                label={tab.label}
                value={String(index + 1)}
              />
            ))}
          </TabList>
        </Box>
        <Divider />
        <Box bgcolor="grey.200" mt={2}>
          {COMMON_TAB.map((panel, index) => (
            <TabPanel key={panel.value} value={String(index + 1)}>
              {panel.label}
            </TabPanel>
          ))}
        </Box>
      </TabContext>
    </ChildCard>
  );
};
export default TabText;

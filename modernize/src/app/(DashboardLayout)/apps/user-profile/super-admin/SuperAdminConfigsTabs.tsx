"use client";

import * as React from "react";
import { Box } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import ChildCard from "@/app/components/shared/ChildCard";
import { IconUser } from "@tabler/icons-react";
import { IconShieldHalfFilled } from "@tabler/icons-react";
import { IconCoins } from "@tabler/icons-react";
import SuperAdminUsersTab from "./SuperAdminUsersTab";
import SuperAdminPermissionsTab from "./SuperAdminPermissionsTab";
import SuperAdminCostsTab from "./SuperAdminCostsTab";

const SUPERADMIN_TAB = [
  { value: "1", icon: <IconUser width={20} height={20} />, label: "Gerenciar Usuários" },
  { value: "2", icon: <IconShieldHalfFilled width={20} height={20} />, label: "Gerenciar Permissões" },
  { value: "3", icon: <IconCoins width={20} height={20} />, label: "Configurações de Custos" },
];

const SuperAdminConfigsTabs = () => {
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      <ChildCard>

        <TabContext value={value}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="Arte Arena Super Admin Config"
            variant="scrollable"
            scrollButtons="auto"
          >
            {SUPERADMIN_TAB.map((tab) => (
              <Tab
                key={tab.value}
                icon={tab.icon}
                label={tab.label}
                iconPosition="top"
                value={tab.value}
              />
            ))}
          </Tabs>
          <Box mt={2}>
            {SUPERADMIN_TAB.map((panel) => (
              <TabPanel key={panel.value} value={panel.value}>
                {panel.label}
                <div style={{ marginBottom: '20px' }}>

                {panel.value === "1" && <div><SuperAdminUsersTab /></div>}
                {panel.value === "2" && <div><SuperAdminPermissionsTab /></div>}
                {panel.value === "3" && <div><SuperAdminCostsTab /></div>}
               </div>
              </TabPanel>
            ))}
          </Box>

        </TabContext>
      </ChildCard>
    </>
  );
};
export default SuperAdminConfigsTabs;

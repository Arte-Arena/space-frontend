"use client";

import * as React from "react";
import { Box } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import ChildCard from "@/app/components/shared/ChildCard";
import { IconUserCircle, IconUserShield, IconShieldCheckeredFilled, IconApps } from "@tabler/icons-react";
import SuperAdminPermissionsTabSubTabsPapeis from "./SuperAdminPermissionsTabSubTabsPapeis";
import SuperAdminPermissionsTabSubTabsModulos from "./SuperAdminPermissionsTabSubTabsModulos";
import SuperAdminPermissionsTabSubTabsPapeisUsuarios from "./SuperAdminPermissionsTabSubTabsPapeisUsuarios";
import SuperAdminPermissionsTabSubTabsModulosPapeis from "./SuperAdminPermissionsTabSubTabsModulosPapeis";

const SUPERADMIN_TAB = [
  { value: "1", icon: <IconUserCircle width={20} height={20} />, label: "Papéis" },
  { value: "2", icon: <IconApps width={20} height={20} />, label: "Módulos" },
  { value: "3", icon: <IconUserShield width={20} height={20} />, label: "Papéis de Usuários" },
  { value: "4", icon: <IconShieldCheckeredFilled width={20} height={20} />, label: "Módulos de Papéis" },
];

const SuperAdminPermissionsTabSubTabs = () => {
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
                <div style={{ marginBottom: '20px' }}>

                {panel.value === "1" && <div><SuperAdminPermissionsTabSubTabsPapeis /></div>}
                {panel.value === "2" && <div><SuperAdminPermissionsTabSubTabsModulos /></div>}
                {panel.value === "3" && <div><SuperAdminPermissionsTabSubTabsPapeisUsuarios /></div>}
                {panel.value === "4" && <div><SuperAdminPermissionsTabSubTabsModulosPapeis /></div>}
               </div>
              </TabPanel>
            ))}
          </Box>

        </TabContext>
      </ChildCard>
    </>
  );
};
export default SuperAdminPermissionsTabSubTabs;

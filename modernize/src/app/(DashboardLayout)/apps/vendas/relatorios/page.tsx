"use client";
import { useState } from "react";
import {
  Box,
  Tab,
  Card,
  CardContent,
  Typography,
  Tabs,
  CircularProgress,
} from "@mui/material";
import { IconUsers, IconReceipt } from "@tabler/icons-react";

import PageContainer from "@/app/components/container/PageContainer";
import ClientesDashboard from "./ClientesDashboard";
import OrcamentosDashboard from "./OrcamentosDashboard";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `dashboard-tab-${index}`,
    "aria-controls": `dashboard-tabpanel-${index}`,
  };
}

export default function RelatoriosPage() {
  const [isLoading, setLoading] = useState(false);
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <PageContainer
      title="Relatórios de Vendas"
      description="Análise de Vendas e Clientes"
    >
      <Box sx={{ width: "100%" }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" color="textPrimary" mb={1}>
            Relatórios de Vendas
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Visualize indicadores de desempenho sobre clientes e orçamentos
          </Typography>
        </Box>

        <Card sx={{ width: "100%" }}>
          <CardContent sx={{ p: 0 }}>
            <Box>
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="dashboard tabs"
                sx={{
                  px: 3,
                  pt: 2,
                  "& .MuiTab-root": {
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    "& svg": {
                      marginRight: 1,
                      marginBottom: "0 !important",
                    },
                  },
                }}
              >
                <Tab icon={<IconUsers />} label="Clientes" {...a11yProps(0)} />
                <Tab
                  icon={<IconReceipt />}
                  label="Orçamentos"
                  {...a11yProps(1)}
                />
              </Tabs>

              {isLoading ? (
                <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <TabPanel value={value} index={0}>
                    <Box sx={{ p: 3 }}>
                      <ClientesDashboard isLoading={isLoading} />
                    </Box>
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <Box sx={{ p: 3 }}>
                      <OrcamentosDashboard isLoading={isLoading} />
                    </Box>
                  </TabPanel>
                </>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </PageContainer>
  );
}

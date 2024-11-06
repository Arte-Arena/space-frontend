"use client";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import PageContainer from "@/app/components/container/PageContainer";
// components
import SalesOverview from "@/app/components/dashboard/SalesOverview";
import YearlyBreakup from "@/app/components/dashboard/YearlyBreakup";
import RecentTransactions from "@/app/components/dashboard/RecentTransactions";
import ProductPerformance from "@/app/components/dashboard/ProductPerformance";
import Blog from "@/app/components/dashboard/Blog";
import MonthlyEarnings from "@/app/components/dashboard/MonthlyEarnings";

export default function Dashboard() {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box mt={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <SalesOverview />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <YearlyBreakup />
              </Grid>
              <Grid item xs={12}>
                <MonthlyEarnings />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={4}>
            <RecentTransactions />
          </Grid>
          <Grid item xs={12} lg={8}>
            <ProductPerformance />
          </Grid>
          <Grid item xs={12}>
            <Blog />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}

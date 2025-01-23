'use client'
import React, { useEffect, useState } from "react";
import { Box, Skeleton, Typography } from "@mui/material";
import DashboardCard from "../../shared/DashboardCard";
import Link from "next/link";

export interface SalesReportCardProps {
  icon: React.ReactNode;
  title: string;
  link: string;
}

const SalesReportCard: React.FC<SalesReportCardProps> = (props: SalesReportCardProps) => {
  const { icon, title, link } = props;
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTitle(true);
    }, 1000); // 3 segundos

    return () => clearTimeout(timer);
  }, []);

  return (
    <Link href={link} passHref>
      <DashboardCard>
        <Box display="flex" alignItems="center" mb={1}>
        {showTitle ? icon : <Skeleton variant="rounded" width={22} height={21} />}
          <Typography variant="h4" sx={{ ml: 1 }}>
            {showTitle ? title : <Skeleton variant="rounded" width={212} height={21} />}
          </Typography>
        </Box>
      </DashboardCard>
    </Link>
  );
};

export default SalesReportCard;
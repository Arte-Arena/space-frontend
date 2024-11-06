"use client";

import React from "react";
import Box from "@mui/material/Box";
import ProductList from "@/app/components/apps/ecommerce/productGrid/ProductList";
import ProductSidebar from "@/app/components/apps/ecommerce/productGrid/ProductSidebar";

const ProductShop = () => {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = React.useState(true);

  return (
    <>
      {/* ------------------------------------------- */}
      {/* Left part */}
      {/* ------------------------------------------- */}
      <ProductSidebar
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
      />
      {/* ------------------------------------------- */}
      {/* Right part */}
      {/* ------------------------------------------- */}
      <Box p={3} flexGrow={1}>
        <ProductList
          onClick={() => setMobileSidebarOpen(!isMobileSidebarOpen)}
        />
      </Box>
    </>
  );
};

export default ProductShop;

"use client";
import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import { NavLinks } from "./Navigations";
import { Chip } from "@mui/material";

const MobileSidebar = () => {
  return (
    <>
      <Box px={3}>
        <Logo />
      </Box>
      <Box p={3}>
        <Stack direction="column" spacing={2}>
          {NavLinks.map((navlink, i) => (
            <Button
              color="inherit"
              href={navlink.href}
              key={i}
              sx={{
                justifyContent: "start",
              }}
            >
              {navlink.title}{" "}
              {navlink.new ? (
                <Chip
                  label="New"
                  size="small"
                  sx={{
                    ml: "6px",
                    borderRadius: "8px",
                    color: "primary.main",
                    backgroundColor: "rgba(93, 135, 255, 0.15)",
                  }}
                />
              ) : null}
            </Button>
          ))}

          <Button
            color="inherit"
            href="#"
            sx={{
              justifyContent: "start",
            }}
          >
            Support
          </Button>
          <Button color="primary" variant="contained" href="/auth/auth1/login">
            Get Started
          </Button>
        </Stack>
      </Box>
    </>
  );
};

export default MobileSidebar;

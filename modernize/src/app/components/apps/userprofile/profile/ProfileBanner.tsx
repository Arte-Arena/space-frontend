'use client'
import React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import BlankCard from "../../../shared/BlankCard";
import SuperAdminConfigs from "./SuperAdminConfigs";

const ProfileBanner = () => {
  const ProfileImage = styled(Box)(() => ({
    backgroundImage: "linear-gradient(#50b2fc,#f44c66)",
    borderRadius: "50%",
    width: "110px",
    height: "110px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto"
  }));

  return (
    <>
      <BlankCard>
        <CardMedia
          component="img"
          image={"/images/backgrounds/profilebg.jpg"}
          alt={"profilecover"}
          width="100%"
          height="330px"
        />
        <Grid container spacing={0} justifyContent="center" alignItems="center">

          {/* about profile */}
          <Grid
            item
            lg={4}
            sm={12}
            xs={12}
            sx={{
              order: {
                xs: "1",
                sm: "1",
                lg: "2",
              },
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              textAlign="center"
              justifyContent="center"
              sx={{
                mt: "-85px",
              }}
            >
              <Box>
                <ProfileImage>
                  <Avatar
                    src={"/images/profile/user-1.jpg"}
                    alt="profileImage"
                    sx={{
                      borderRadius: "50%",
                      width: "100px",
                      height: "100px",
                      border: "4px solid #fff",
                    }}
                  />
                </ProfileImage>
                <Box mt={1}>
                  <Typography fontWeight={600} variant="h5">
                  {localStorage.getItem('name')}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    fontWeight={400}
                  >
                    {localStorage.getItem('cargos')}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
        {/**TabbingPart**/}
        {/* <ProfileTab /> */}
      </BlankCard>
      <SuperAdminConfigs />
    </>
  );
};

export default ProfileBanner;

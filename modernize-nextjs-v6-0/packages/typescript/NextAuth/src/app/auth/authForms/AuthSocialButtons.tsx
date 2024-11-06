"use client"
import CustomSocialButton from "@/app/components/forms/theme-elements/CustomSocialButton";
import { Stack } from "@mui/system";
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { signInType } from "@/app/(DashboardLayout)/types/auth/auth";
import { signIn } from 'next-auth/react';

const AuthSocialButtons = ({ title }: signInType) => {
  const handleGoogleSignIn = async () => {
    await signIn('google');
  };
  const handleGithubSignIn = async () => {
    await signIn('github');
  };
  return (
  <>
    <Stack direction="row" justifyContent="center" spacing={2} mt={3}>
      <CustomSocialButton onClick={handleGoogleSignIn}>
        <Avatar
          src={"/images/svgs/google-icon.svg"}
          alt={"icon1"}
          sx={{
            width: 16,
            height: 16,
            borderRadius: 0,
            mr: 1,
          }}
        />
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            whiteSpace: "nowrap",
            mr: { sm: "3px" },
          }}
        >
          {title}{" "}
        </Box>{" "}
        Google
      </CustomSocialButton>
      <CustomSocialButton onClick={handleGithubSignIn}>
        <Avatar
          src={"/images/svgs/git-icon.svg"}
          alt={"icon2"}
          sx={{
            width: 16,
            height: 16,
            borderRadius: 0,
            mr: 1,
          }}
        />
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            whiteSpace: "nowrap",
            mr: { sm: "3px" },
          }}
        >
          {title}{" "}
        </Box>{" "}
        Git
      </CustomSocialButton>
    </Stack>
  </>
);}

export default AuthSocialButtons;

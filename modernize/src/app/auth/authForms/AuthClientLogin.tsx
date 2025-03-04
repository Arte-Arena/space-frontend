'use client'

import React from 'react';
import { Box, Typography, Button, Stack, CircularProgress } from "@mui/material";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { useFormik } from 'formik';
import * as yup from 'yup';

import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";

interface LoginType {
  title?: string;
  subtitle?: JSX.Element;
  subtext?: JSX.Element;
}

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Digite um email válido')
    .required('Email é obrigatório'),
  password: yup
    .string()
    .required('Senha é obrigatória'),
});

const AuthClientLogin = ({ title, subtitle, subtext }: LoginType) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        router.push('/client/dashboard');
      } catch (error) {
        console.error('Erro no login:', error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        {title && (
          <Typography fontWeight="700" variant="h3" mb={1}>
            {title}
          </Typography>
        )}

        {subtext}

        <Stack>
          <Box>
            <CustomFormLabel htmlFor="email">Email</CustomFormLabel>
            <CustomTextField
              fullWidth
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Box>
          <Box>
            <CustomFormLabel htmlFor="password">Senha</CustomFormLabel>
            <CustomTextField
              fullWidth
              type="password"
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Box>
          <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
            <Typography
              component={Link}
              href="/auth/auth3/forgot-password"
              fontWeight="500"
              sx={{
                textDecoration: "none",
                color: "primary.main",
              }}
            >
              Esqueceu sua senha?
            </Typography>
          </Stack>
        </Stack>
        <Box>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            Entrar
          </Button>
        </Box>
        {subtitle}
      </form>
    </>
  );
};

export default AuthClientLogin;
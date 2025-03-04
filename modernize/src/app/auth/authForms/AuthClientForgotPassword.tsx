'use client'

import React from 'react';
import { Box, Typography, Button, Stack, CircularProgress } from "@mui/material";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { useFormik } from 'formik';
import * as yup from 'yup';

import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Digite um email válido')
    .required('Email é obrigatório'),
});

const AuthClientForgotPassword = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (_) => {
      setIsLoading(true);
      try {
        router.push('/auth/auth3/login');
      } catch (error) {
        console.error('Erro ao recuperar senha:', error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <>
      <Stack mb={4}>
        <Typography variant="h3" fontWeight={700}>
          Recuperar Senha
        </Typography>
        <Typography color="textSecondary" variant="subtitle2" mt={1}>
          Digite seu email e enviaremos instruções para redefinir sua senha
        </Typography>
      </Stack>

      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={3}>
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

          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            Enviar Link de Recuperação
          </Button>

          <Button
            color="primary"
            size="large"
            fullWidth
            component={Link}
            href="/auth/auth3/login"
          >
            Voltar ao Login
          </Button>
        </Stack>
      </form>
    </>
  );
};

export default AuthClientForgotPassword;
'use client'
import React, { useState } from "react";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import Button from "@mui/material/Button";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Encurtador de Links",
  },
];

const EncurtadorLink = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");

  const handleFetchShortUrl = async (url: string) => {
    try {
      const response = await fetch("/api/encurtador-de-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Erro ao encurtar a URL");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err);
      setError("Não foi possível encurtar a URL. Tente novamente.");
      return null;
    }
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Limpa erros anteriores

    if (url) {
      const data = await handleFetchShortUrl(url);
      if (data?.shortUrl) {
        setShortUrl(data.shortUrl);
      }
    }
  };

  return (
    <PageContainer>
      <Breadcrumb title="Encurtador de Links" items={BCrumb} />
      <Typography variant="h5" gutterBottom>
        Encurtador de Link
      </Typography>
      <form onSubmit={handleOnSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <CustomTextField
              label="URL"
              value={url}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
              variant="outlined"
              fullWidth
            />
          </Grid>
          {error && (
            <Grid item xs={12}>
              <Typography color="error">{error}</Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Encurtar
            </Button>
          </Grid>
        </Grid>
      </form>
    </PageContainer>
  );
};

export default EncurtadorLink;

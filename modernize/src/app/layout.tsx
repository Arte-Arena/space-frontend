import React from "react";
import { Providers } from "@/store/providers";
import MyApp from "./app";
import "./global.css";
import BackgroundUpdater from "@/utils/BackgroundUpdater";


export const metadata = {
  title: "Arte Arena - Space",
  description: "Space é o espaço de trabalho colaborativo da Arte Arena",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <BackgroundUpdater />
        <Providers>
          <MyApp>{children}</MyApp>
        </Providers>
      </body>
    </html>
  );
}

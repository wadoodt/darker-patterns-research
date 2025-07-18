import React from "react";
import { Theme, ThemePanel } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import Navbar from "../components/public/Navbar";
import Footer from "../components/public/Footer";
import GoToTopButton from "../components/public/GoToTopButton";
import { useApp } from "@hooks/useApp";
import { themeConfigs } from "@styles/themes";
import { AppProvider } from "@contexts/AppContext";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <PublicLayoutContent>{children}</PublicLayoutContent>
    </AppProvider>
  );
}

const PublicLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { settings } = useApp();
  const theme = themeConfigs[settings.theme] || themeConfigs.light;

  return (
    <Theme {...theme}>
      <div
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Navbar />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
        <GoToTopButton />
      </div>
      <ThemePanel />
    </Theme>
  );
};

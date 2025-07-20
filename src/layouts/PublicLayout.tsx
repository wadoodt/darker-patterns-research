import React from "react";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import "../styles/global.css";
import Navbar from "../components/public/Navbar";
import Footer from "../components/public/Footer";
import GoToTopButton from "../components/public/GoToTopButton";

// Public layout uses a default, non-changeable theme.
const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Theme appearance="light">
      <div
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Navbar />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
        <GoToTopButton />
      </div>
    </Theme>
  );
};

export default PublicLayout;

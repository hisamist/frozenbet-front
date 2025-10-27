"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/NavBar";
import { AuthModal } from "@/components/AuthModal";
import { useState } from "react";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [openAuthModal, setOpenAuthModal] = useState(false);

  const handleLoginClick = () => setOpenAuthModal(true);

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        {/* Navbar avec callback pour ouvrir modal */}
        <Navbar onLoginClick={handleLoginClick} />

        {/* Auth modal global */}
        <AuthModal
          open={openAuthModal}
          onClose={() => setOpenAuthModal(false)}
          onSuccess={() => setOpenAuthModal(false)}
        />

        {/* Main prend tout l’espace restant */}
        <main className="flex-1">{children}</main>

        {/* Footer toujours en bas */}
        <Footer />
      </body>
    </html>
  );
}

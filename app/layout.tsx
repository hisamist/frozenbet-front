"use client";

import { AuthModal } from "@/components/AuthModal";
import Footer from "@/components/Footer";
import Navbar from "@/components/NavBar";
import { AuthProvider } from "@/context/AuthContext";
import { useState } from "react";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [openAuthModal, setOpenAuthModal] = useState(false);

  const handleLoginClick = () => setOpenAuthModal(true);

  return (
    <html lang="en">
      <head>
        <title>FrozenBet - Pronostics sportifs entre amis</title>
        <link rel="icon" href="/logo-frozenbet.ico" sizes="any" />
      </head>
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          {/* Navbar avec callback pour ouvrir modal */}
          <Navbar onLoginClick={handleLoginClick} />

          {/* Auth modal global */}
          <AuthModal
            open={openAuthModal}
            onClose={() => setOpenAuthModal(false)}
            onSuccess={() => setOpenAuthModal(false)}
          />

          {/* Main prend tout l'espace restant */}
          <main className="flex-1">{children}</main>

          {/* Footer toujours en bas */}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

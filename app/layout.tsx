"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/NavBar";
import { AuthProvider } from "@/context/AuthContext"; // ton AuthProvider
import { useState } from "react";
import "./globals.css";
import { AuthModal } from "@/components/AuthModal";
import { Notification } from "@/types";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [openAuthModal, setOpenAuthModal] = useState(false);

  const notifications: Notification[] = [
    { resultId: 1, message: "Match terminé : Team A vs Team B" },
    { resultId: 2, message: "Nouveau pronostic disponible" },
    { resultId: 3, message: "Votre groupe a été mis à jour" },
  ];

  const handleLoginClick = () => setOpenAuthModal(true);

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          {/* Navbar avec callback pour ouvrir modal */}
          <Navbar onLoginClick={handleLoginClick} notifications={notifications} />

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
        </AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        {/* Navbar toujours en haut */}
        <Navbar />
        {/* Main prend tout l’espace restant */}
        <main className="flex-1">
          {children}
        </main>
        {/* Footer toujours en bas */}
        <Footer />
      </body>
    </html>
  );
}


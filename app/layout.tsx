import Footer from "@/components/Footer";
import Navbar from "@/components/NavBar";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        {/* Navbar toujours en haut */}
        <Navbar />
        {/* Main prend tout l’espace restant */}
        <main className="flex-1">{children}</main>
        {/* Footer toujours en bas */}
        <Footer />
      </body>
    </html>
  );
}

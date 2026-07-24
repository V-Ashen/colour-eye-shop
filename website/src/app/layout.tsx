import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import AuthModal from "@/components/AuthModal";
import CartDrawer from "@/components/CartDrawer";
import MarketingPixels from "@/components/MarketingPixels";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Colour Eye",
  description: "Trendy aesthetic accessories in Sri Lanka.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <AuthProvider>
          <Navbar />
          {children}
          <AuthModal />
          <CartDrawer />
          <Toaster position="bottom-right" />
        </AuthProvider>
        <Footer />
        <MarketingPixels />
      </body>
    </html>
  );
}
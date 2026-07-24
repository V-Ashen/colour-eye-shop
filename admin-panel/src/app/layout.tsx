import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AdminGuard from "@/components/AdminGuard";
import AdminLayoutContent from "@/components/AdminLayoutContent";
import OrderNotifier from "@/components/OrderNotifier";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Panel | Colour Eye",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50`}>
        <AdminGuard>
          <OrderNotifier />
          <AdminLayoutContent>
            {children}
          </AdminLayoutContent>
          <Toaster position="top-center" />
        </AdminGuard>
      </body>
    </html>
  );
}
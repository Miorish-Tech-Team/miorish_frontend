'use client'

import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { AuthModalProvider } from "@/contexts/AuthModalContext";
import AuthModals from "@/components/modals/AuthModals";
import { Toaster } from "react-hot-toast";
import AuthToastHandler from "@/components/AuthToastHandler";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.jpg" type="image/jpeg" />
        <title>Miorish</title>
      </head>
      <body
        className={`${cinzel.variable} ${inter.variable} antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            <AuthModalProvider>
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
              <AuthToastHandler />
              <AuthModals />
              <Navbar />
              {children}
              <Footer />
            </AuthModalProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout/Layout";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "Latihan",
  description: "Personal fitness & body tracker",
};

export const viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  // Locked to prevent the zoom-on-input-focus jump while logging sets one-handed.
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={jakarta.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}

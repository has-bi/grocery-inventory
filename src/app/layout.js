import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout/Layout";
import { HeroUIProvider } from "@heroui/react";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Isi Kulkas",
  description: "Aplikasi pemantau stok kulkas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={jakarta.className}>
        <HeroUIProvider>
          <Layout>{children}</Layout>
        </HeroUIProvider>
      </body>
    </html>
  );
}

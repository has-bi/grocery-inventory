import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout/Layout";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "BarangXLupa",
  description: "Personal household app — grocery & health tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body className={jakarta.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}

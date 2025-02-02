import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Layout from "@/components/head/Head";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Grocery Inventory",
  description: "A simple grocery inventory management systems",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={jakarta.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}

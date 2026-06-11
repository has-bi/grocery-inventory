import Image from "next/image";
import TabNav from "./TabNav";
import LogoutButton from "./LogoutButton";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Image
                src="/images/Logo.png"
                alt="BarangXLupa Logo"
                width={28}
                height={28}
                className="object-contain"
              />
              <h1 className="text-xl font-light text-black">BarangXLupa</h1>
            </div>
            <LogoutButton />
          </div>
          <TabNav />
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-gray-200 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-xs text-gray-400">
          <p>© 2026 BarangXLupa · Household App by Hasbi</p>
        </div>
      </footer>
    </div>
  );
}

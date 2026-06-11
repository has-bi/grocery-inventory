import Image from "next/image";
import TabNav from "./TabNav";
import BottomNav from "./BottomNav";
import LogoutButton from "./LogoutButton";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-2.5">
              <Image
                src="/images/Logo.png"
                alt="BarangXLupa Logo"
                width={26}
                height={26}
                className="object-contain"
              />
              <h1 className="text-lg sm:text-xl font-light text-black">BarangXLupa</h1>
            </div>
            <LogoutButton />
          </div>
          <TabNav />
        </div>
      </header>

      <main className="pb-24 sm:pb-0">{children}</main>

      <footer className="hidden sm:block border-t border-gray-200 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-xs text-gray-500">
          <p>© 2026 BarangXLupa · Household App by Hasbi</p>
        </div>
      </footer>

      <BottomNav />
    </div>
  );
}

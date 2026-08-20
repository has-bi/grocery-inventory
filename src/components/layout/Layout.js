import TabNav from "./TabNav";
import BottomNav from "./BottomNav";
import LogoutButton from "./LogoutButton";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-14">
            <h1 className="text-lg font-semibold tracking-tight text-black">Latihan</h1>
            <LogoutButton />
          </div>
          <TabNav />
        </div>
      </header>

      <main className="pb-24 sm:pb-8">{children}</main>

      <BottomNav />
    </div>
  );
}

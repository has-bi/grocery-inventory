import TabNav from "./TabNav";
import BottomNav from "./BottomNav";
import LogoutButton from "./LogoutButton";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-base-200">
      <header className="navbar bg-base-100 border-b border-base-300 sticky top-0 z-30 min-h-14">
        <div className="max-w-2xl w-full mx-auto px-4 flex items-center justify-between">
          <h1 className="text-base font-semibold tracking-tight">Latihan</h1>
          <div className="flex items-center gap-2">
            <TabNav />
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="pb-24 sm:pb-8">{children}</main>

      <BottomNav />
    </div>
  );
}

import TabNav from "./TabNav";
import BottomNav from "./BottomNav";
import LogoutButton from "./LogoutButton";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-surface-sunken">
      <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur border-b border-line">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <span className="text-sm font-semibold tracking-tight text-ink">Latihan</span>
          <div className="flex items-center gap-1">
            <TabNav />
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Bottom padding clears the mobile nav; the log screen adds more for the rest timer */}
      <main className="pb-20 sm:pb-10">{children}</main>

      <BottomNav />
    </div>
  );
}

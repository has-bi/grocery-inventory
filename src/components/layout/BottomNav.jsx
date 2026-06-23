"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiShoppingCart, FiActivity, FiCheckSquare } from "react-icons/fi";

const TABS = [
  { label: "Grocery", href: "/", icon: FiShoppingCart },
  { label: "Tasks", href: "/tasks", icon: FiCheckSquare },
  { label: "Intermitten", href: "/health", icon: FiActivity },
];

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname === "/login") return null;

  return (
    <nav className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom)]">
      <div className="flex">
        {TABS.map((tab) => {
          const isActive =
            tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors ${
                isActive ? "text-black" : "text-gray-500"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

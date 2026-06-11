"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Grocery", href: "/" },
  { label: "Intermitten", href: "/health" },
];

export default function TabNav() {
  const pathname = usePathname();

  if (pathname === "/login") return null;

  return (
    <div className="hidden sm:flex -mb-px">
      {TABS.map((tab) => {
        const isActive =
          tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              isActive
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-black"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}

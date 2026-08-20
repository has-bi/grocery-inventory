"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Log",     href: "/log" },
  { label: "Body",    href: "/body" },
  { label: "Program", href: "/program" },
  { label: "Summary", href: "/summary" },
];

export default function TabNav() {
  const pathname = usePathname();
  if (pathname === "/login") return null;

  return (
    <div className="hidden sm:flex gap-1">
      {TABS.map((tab) => {
        const isActive = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`btn btn-sm btn-ghost ${isActive ? "btn-active" : ""}`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}

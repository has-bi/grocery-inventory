"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiActivity, FiUser, FiList, FiBarChart2 } from "react-icons/fi";

const TABS = [
  { label: "Log",     href: "/log",     icon: FiActivity },
  { label: "Body",    href: "/body",    icon: FiUser },
  { label: "Program", href: "/program", icon: FiList },
  { label: "Summary", href: "/summary", icon: FiBarChart2 },
];

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname === "/login") return null;

  return (
    <nav className="btm-nav btm-nav-sm sm:hidden z-40 border-t border-base-300 bg-base-100">
      {TABS.map((tab) => {
        const isActive = pathname.startsWith(tab.href);
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={isActive ? "active text-primary" : "text-base-content/40"}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span className="btm-nav-label text-xs">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

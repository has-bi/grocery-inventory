"use client";
import { useRouter, usePathname } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/login") return null;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <button onClick={handleLogout} className="btn btn-ghost btn-xs">
      Keluar
    </button>
  );
}

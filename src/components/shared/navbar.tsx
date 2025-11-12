"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Projects", path: "/projects" },
    { name: "Events", path: "/events" },
    { name: "Sessions", path: "/sessions" },
    { name: "Leaderboard", path: "/leaderboard" },
  ];

  // Only show Admin link for admin and mentor roles
  if (user?.role === "admin" || user?.role === "mentor") {
    navItems.push({ name: "Admin", path: "/admin" });
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="flex items-center justify-between py-4 px-10 bg-black text-white border-b border-white/10">
      <Link href="/" className="tracking-[0.3em] font-semibold text-sm hover:text-cyan-400 transition-colors">
        CODE 4O4 DEV CLUB
      </Link>

      <ul className="flex gap-8">
        {navItems.map((item) => {
          const isActive = pathname === item.path || pathname?.startsWith(item.path + "/");
          
          return (
            <li key={item.name}>
              <Link
                href={item.path}
                className={`transition-colors duration-200 ${
                  isActive 
                    ? "text-cyan-400 font-semibold" 
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center gap-3">
        <button 
          onClick={handleLogout}
          className="hover:text-cyan-400 transition-colors"
        >
          Logout
        </button>
        <Link 
          href="/dashboard/profile"
          className="flex items-center gap-2 border border-white/20 rounded-full px-3 py-1 hover:border-cyan-400/50 transition-colors"
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name || "avatar"}
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-xs font-semibold">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
          <span className="text-sm">{user?.name || "User"}</span>
        </Link>
      </div>
    </nav>
  );
}

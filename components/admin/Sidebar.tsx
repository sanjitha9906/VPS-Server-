"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Home,
  Folder,
  Trash2,
  User,
  Settings,
  Terminal,
  Server,
  LogOut,
  ShieldCheck,
} from "lucide-react";

const isAdmin = true;

const navItems = [
  {
    label: "Home",
    href: "/admin/dashboard",
    icon: Home,
  },

  {
    label: "Files",
    href: "/admin/files",
    icon: Folder,
  },

  {
    label: "Recycle Bin",
    href: "/admin/recycle-bin",
    icon: Trash2,
  },

  {
    label: "User Profile",
    href: "/admin/profile",
    icon: User,
  },

  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

const adminItems = [
  {
    label: "Server Settings",
    href: "/admin/server-settings",
    icon: Server,
  },

  {
    label: "Terminal",
    href: "/admin/terminal",
    icon: Terminal,
  },
];

export default function Sidebar() {

  const pathname = usePathname();

  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-72 bg-[#0b1120] border-r border-slate-800 text-white flex flex-col justify-between">

      {/* Top */}
      <div>

        {/* Logo */}
        <div className="px-8 py-6 border-b border-slate-800">

          <h1 className="text-3xl font-black text-blue-400 tracking-wide">
            SAHA LABS
          </h1>

          <p className="text-xs text-slate-400 uppercase tracking-[0.25em] mt-1">
            VPS SERVER PANEL
          </p>

        </div>

        {/* Main Navigation */}
        <nav className="p-5 space-y-3">

          {navItems.map(({ label, href, icon: Icon }) => {

            const active = pathname === href;

            return (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300

                ${
                  active
                    ? "bg-blue-600/20 border border-blue-500 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }
                `}
              >
                <Icon size={22} />

                <span className="text-lg font-medium">
                  {label}
                </span>

              </Link>
            );
          })}

        </nav>

        {/* Admin Only */}
        {isAdmin && (

          <div className="px-5 mt-6">

            <div className="flex items-center gap-2 text-slate-400 text-sm uppercase tracking-widest mb-4 px-2">

              <ShieldCheck size={16} />

              Admin Access

            </div>

            <div className="space-y-3">

              {adminItems.map(({ label, href, icon: Icon }) => {

                const active = pathname === href;

                return (
                  <Link
                    key={label}
                    href={href}
                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300

                    ${
                      active
                        ? "bg-purple-600/20 border border-purple-500 text-white"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }
                    `}
                  >
                    <Icon size={22} />

                    <span className="text-lg font-medium">
                      {label}
                    </span>

                  </Link>
                );
              })}

            </div>

          </div>

        )}

      </div>

      {/* Bottom */}
      <div className="p-5 border-t border-slate-800">

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-5 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-300 mb-5"
        >
          <LogOut size={20} />

          <span className="font-medium">
            Logout
          </span>

        </button>

        {/* User */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">

          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-lg font-bold">
            A
          </div>

          <div>
            <p className="font-semibold text-white">
              Admin
            </p>

            <p className="text-sm text-slate-400">
              Owner
            </p>
          </div>

        </div>

      </div>

    </aside>
  );
}
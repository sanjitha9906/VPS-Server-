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

    <aside
      className="
        fixed left-0 top-0 z-50
        h-screen w-72
        bg-[#050816]
        border-r border-slate-800
        text-white
        flex flex-col justify-between
        overflow-hidden
      "
    >

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        {/* Blue Glow */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />

        {/* Purple Glow */}
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Moving Lines */}
        <div className="absolute inset-0 overflow-hidden">

          <div className="absolute top-20 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-pulse" />

          <div className="absolute top-60 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-pulse" />

          <div className="absolute top-[500px] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent animate-pulse" />

        </div>

      </div>

      {/* TOP */}
      <div className="relative z-10">

        {/* Logo */}
        <div className="px-8 py-7 border-b border-slate-800 relative">

          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent" />

          <h1 className="text-4xl font-black tracking-wide bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
            SAHA LABS
          </h1>

          <p className="text-xs text-slate-400 uppercase tracking-[0.3em] mt-2">
            VPS SERVER PANEL
          </p>

        </div>

        {/* Navigation */}
        <nav className="p-5 space-y-3">

          {navItems.map(({ label, href, icon: Icon }) => {

            const active = pathname === href;

            return (

              <Link
                key={label}
                href={href}
                className={`
                  group relative overflow-hidden
                  flex items-center gap-4
                  px-5 py-4
                  rounded-2xl
                  transition-all duration-300

                  ${
                    active
                      ? "bg-blue-500/15 border border-blue-500/30 text-white shadow-lg shadow-blue-500/10"
                      : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                  }
                `}
              >

                {/* Hover Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-blue-500/10 to-transparent" />

                {/* Icon */}
                <Icon
                  size={22}
                  className={`
                    relative z-10 transition-all duration-300

                    ${
                      active
                        ? "text-blue-400"
                        : "group-hover:text-blue-300"
                    }
                  `}
                />

                {/* Text */}
                <span className="relative z-10 text-lg font-medium">
                  {label}
                </span>

              </Link>

            );
          })}

        </nav>

        {/* Admin Section */}
        {isAdmin && (

          <div className="px-5 mt-8">

            <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-[0.3em] mb-4 px-2">

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
                    className={`
                      group relative overflow-hidden
                      flex items-center gap-4
                      px-5 py-4
                      rounded-2xl
                      transition-all duration-300

                      ${
                        active
                          ? "bg-purple-500/15 border border-purple-500/30 text-white shadow-lg shadow-purple-500/10"
                          : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                      }
                    `}
                  >

                    {/* Hover Glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-purple-500/10 to-transparent" />

                    {/* Icon */}
                    <Icon
                      size={22}
                      className={`
                        relative z-10 transition-all duration-300

                        ${
                          active
                            ? "text-purple-400"
                            : "group-hover:text-purple-300"
                        }
                      `}
                    />

                    {/* Text */}
                    <span className="relative z-10 text-lg font-medium">
                      {label}
                    </span>

                  </Link>

                );
              })}

            </div>

          </div>

        )}

      </div>

      {/* BOTTOM */}
      <div className="p-5 border-t border-slate-800 relative z-10">

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="
            w-full flex items-center gap-3
            px-5 py-4
            rounded-2xl
            text-red-400 hover:text-white
            bg-red-500/5 hover:bg-red-500/15
            border border-red-500/10 hover:border-red-500/30
            transition-all duration-300
            hover:scale-[1.02]
            group
            relative overflow-hidden
            mb-5
          "
        >

          {/* Glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-red-500/10 via-red-400/5 to-red-500/10" />

          <LogOut
            size={20}
            className="relative z-10 group-hover:translate-x-1 transition-transform"
          />

          <span className="font-semibold text-lg relative z-10">
            Logout
          </span>

        </button>

        {/* User Card */}
        <div
          className="
            relative overflow-hidden
            bg-gradient-to-br from-[#10192f] to-[#0b1120]
            border border-slate-800
            rounded-3xl
            p-5
            flex items-center gap-4
            transition-all duration-500
            hover:border-blue-500/30
            hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]
            hover:-translate-y-1
            group
          "
        >

          {/* Glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_60%)]" />

          {/* Avatar */}
          <div
            className="
              relative z-10
              w-14 h-14 rounded-full
              bg-gradient-to-br from-blue-500 to-indigo-600
              flex items-center justify-center
              text-xl font-bold text-white
              shadow-lg shadow-blue-500/30
              group-hover:scale-110
              transition-transform duration-300
            "
          >
            A
          </div>

          {/* User Details */}
          <div className="relative z-10">

            <p className="font-bold text-white text-lg">
              Admin
            </p>

            <p className="text-sm text-slate-400">
              Owner
            </p>

          </div>

          {/* Online Indicator */}
          <div className="absolute top-5 right-5">

            <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />

          </div>

        </div>

      </div>

    </aside>

  );
}
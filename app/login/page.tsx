"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#020817] flex items-center justify-center px-5">

      <div className="w-full max-w-2xl bg-[#0b1120] border border-slate-800 rounded-3xl p-14">

        {/* Logo */}
        <div className="text-center mb-12">

          <h1 className="text-6xl font-black text-blue-400">
            SAHA Clouding
          </h1>

          <p className="text-slate-400 text-xl mt-4">
            Securely manage your VPS infrastructure
          </p>

        </div>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="space-y-6"
        >

          {/* Email */}
          <div>
            <label className="block text-slate-300 mb-3 text-lg">
              Email
            </label>

            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#020817] border border-slate-700 rounded-2xl px-6 py-5 text-white outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-slate-300 mb-3 text-lg">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#020817] border border-slate-700 rounded-2xl px-6 py-5 text-white outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <Link
              href="/forget-password"
              className="text-blue-400 hover:text-blue-300"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition py-5 rounded-2xl text-xl font-semibold text-white"
          >
            Login
          </button>

        </form>

        {/* Signup */}
        <p className="text-center text-slate-400 mt-8 text-lg">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-blue-400 hover:text-blue-300"
          >
            Create Account
          </Link>
        </p>

      </div>

    </div>
  );
}
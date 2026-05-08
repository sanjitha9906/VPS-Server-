"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#020817] flex items-center justify-center px-5">

      <div className="w-full max-w-2xl bg-[#0b1120] border border-slate-800 rounded-3xl p-14">

        <h1 className="text-6xl font-black text-white text-center">
          SAHA LABS
        </h1>

        <p className="text-center text-slate-400 text-2xl mt-4 mb-12">
          Create your VPS panel account
        </p>

        <form
          onSubmit={handleSignup}
          className="space-y-6"
        >

          <div>
            <label className="block text-slate-300 mb-3 text-lg">
              Full Name
            </label>

            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#020817] border border-slate-700 rounded-2xl px-6 py-5 text-white outline-none focus:border-blue-500"
              required
            />
          </div>

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

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition py-5 rounded-2xl text-xl font-semibold text-white"
          >
            Create Account
          </button>

        </form>

        <p className="text-center text-slate-400 mt-8 text-lg">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-400"
          >
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}
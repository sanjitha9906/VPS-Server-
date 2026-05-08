"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();

    alert("Password reset link sent!");
  };

  return (
    <div className="min-h-screen bg-[#020817] flex items-center justify-center px-5">

      <div className="w-full max-w-2xl bg-[#0b1120] border border-slate-800 rounded-3xl p-14">

        <h1 className="text-5xl font-black text-white text-center">
          Forgot Password
        </h1>

        <p className="text-center text-slate-400 text-xl mt-4 mb-12">
          Enter your email to reset password
        </p>

        <form
          onSubmit={handleReset}
          className="space-y-6"
        >

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

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition py-5 rounded-2xl text-xl font-semibold text-white"
          >
            Send Reset Link
          </button>

        </form>

        <p className="text-center text-slate-400 mt-8 text-lg">
          Back to{" "}
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
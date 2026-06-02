"use client";

import Link from "next/link";
import { useState } from "react";

import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await sendPasswordResetEmail(auth, email);

      alert("Password reset link sent to your email!");
    } catch (error: any) {
      console.log("RESET ERROR:", error);

      if (error.code === "auth/user-not-found") {
        alert("No account found with this email");
      } else if (error.code === "auth/invalid-email") {
        alert("Invalid email address");
      } else {
        alert("Failed to send reset email");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020817] flex items-center justify-center px-6">
      {/* Background */}
      <div className="absolute inset-0 bg-[#020817]" />

      {/* Animated Grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Running Data */}
      <div className="absolute top-[30%] left-[-20%] w-80 h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-dataX" />

      <div className="absolute bottom-[40%] right-[-20%] w-80 h-[3px] bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-dataX2" />

      {/* Glow */}
      <div className="absolute top-[-200px] left-[10%] w-[600px] h-[600px] bg-cyan-500/10 blur-[150px] rounded-full" />

      <div className="absolute bottom-[-200px] right-[10%] w-[600px] h-[600px] bg-purple-500/10 blur-[150px] rounded-full" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-2xl bg-[#071120]/70 border border-white/10 backdrop-blur-3xl rounded-[40px] p-14 shadow-[0_0_80px_rgba(34,211,238,0.12)]">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            RESET PASSWORD
          </h1>

          <p className="text-slate-400 text-xl mt-5">
            Recover your VPS account access
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-7">
          <div>
            <label className="block text-slate-300 mb-3 text-xl">
              Email Address
            </label>

            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/30 border border-slate-700 rounded-2xl px-6 py-5 text-white text-lg outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 py-5 rounded-2xl text-2xl font-bold text-white hover:scale-[1.02] transition disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-8 text-lg">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-cyan-300 hover:text-cyan-200"
          >
            Login
          </Link>
        </p>
      </div>

      <style jsx>{`
        .animate-dataX {
          animation: dataX 6s linear infinite;
        }

        .animate-dataX2 {
          animation: dataX2 7s linear infinite;
        }

        @keyframes dataX {
          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(160vw);
          }
        }

        @keyframes dataX2 {
          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(-160vw);
          }
        }
      `}</style>
    </main>
  );
}
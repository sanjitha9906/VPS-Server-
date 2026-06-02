"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("FIREBASE LOGIN:", userCredential.user);

      alert("Login successful!");

      router.push("/admin/dashboard");
    } catch (error: any) {
      console.log("LOGIN ERROR:", error);

      if (error.code === "auth/user-not-found") {
        alert("User not found");
      } else if (error.code === "auth/wrong-password") {
        alert("Wrong password");
      } else if (error.code === "auth/invalid-email") {
        alert("Invalid email");
      } else if (error.code === "auth/invalid-credential") {
        alert("Invalid email or password");
      } else {
        alert("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-[#020617]" />

      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,255,255,0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[20%] left-0 w-full h-[2px] bg-cyan-500/10" />
        <div className="absolute top-[50%] left-0 w-full h-[2px] bg-blue-500/10" />
        <div className="absolute top-[75%] left-0 w-full h-[2px] bg-purple-500/10" />

        <div className="absolute left-[20%] top-0 w-[2px] h-full bg-cyan-500/10" />
        <div className="absolute left-[50%] top-0 w-[2px] h-full bg-blue-500/10" />
        <div className="absolute right-[20%] top-0 w-[2px] h-full bg-purple-500/10" />

        <div className="absolute top-[20%] left-[-20%] w-52 h-[4px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-dataX" />
        <div className="absolute top-[50%] right-[-20%] w-52 h-[4px] bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-dataX2" />
        <div className="absolute top-[75%] left-[-20%] w-52 h-[4px] bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-dataX" />
      </div>

      <div className="absolute top-24 left-24 w-36 h-36 rounded-3xl border border-cyan-400/20 bg-cyan-500/5 backdrop-blur-xl animate-float shadow-[0_0_60px_rgba(34,211,238,0.12)]">
        <div className="absolute inset-4 border border-cyan-400/20 rounded-2xl" />
        <div className="absolute inset-0 flex items-center justify-center text-cyan-300 font-bold tracking-[6px]">
          VPS
        </div>
      </div>

      <div className="absolute bottom-24 right-24 w-44 h-32 rounded-3xl border border-blue-400/20 bg-blue-500/5 backdrop-blur-xl animate-float2 shadow-[0_0_60px_rgba(59,130,246,0.12)]">
        <div className="absolute inset-4 border border-blue-400/20 rounded-2xl" />
        <div className="absolute inset-0 flex items-center justify-center text-blue-300 font-bold tracking-[6px]">
          SECURE
        </div>
      </div>

      <div className="absolute top-[-300px] left-[5%] w-[700px] h-[700px] bg-cyan-500/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-300px] right-[5%] w-[700px] h-[700px] bg-blue-500/10 blur-[150px] rounded-full" />

      <div className="relative z-10 w-full max-w-2xl bg-[#071120]/70 border border-white/10 backdrop-blur-3xl rounded-[40px] p-14 shadow-[0_0_80px_rgba(34,211,238,0.12)]">
        <div className="text-center mb-12">
          <h1 className="text-7xl font-black bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            SAHA CLOUD
          </h1>

          <p className="text-slate-400 text-2xl mt-5">
            Secure VPS Infrastructure
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-7">
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

          <div>
            <label className="block text-slate-300 mb-3 text-xl">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/30 border border-slate-700 rounded-2xl px-6 py-5 text-white text-lg outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition"
              required
            />
          </div>

          <div className="flex justify-end">
            <Link
              href="/forget-password"
              className="text-cyan-300 hover:text-cyan-200 text-lg"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:scale-[1.02] transition-all duration-300 py-5 rounded-2xl text-2xl font-bold text-white shadow-[0_0_35px_rgba(59,130,246,0.5)] disabled:opacity-60"
          >
            {loading ? "Authenticating..." : "Access Server Panel"}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-8 text-lg">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-cyan-300 hover:text-cyan-200">
            Create Account
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

        .animate-float {
          animation: float 7s ease-in-out infinite;
        }

        .animate-float2 {
          animation: float2 9s ease-in-out infinite;
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

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-18px);
          }
        }

        @keyframes float2 {
          0%,
          100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(18px);
          }
        }
      `}</style>
    </main>
  );
}
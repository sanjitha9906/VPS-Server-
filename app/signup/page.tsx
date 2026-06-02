"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organization, setOrganization] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      await updateProfile(userCredential.user, {
        displayName: name.trim(),
      });

      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: email.trim().toLowerCase(),
        name: name.trim(),
        role: "user",
        organizationId: organization.trim().toLowerCase().replace(/\s+/g, ""),
        createdAt: serverTimestamp(),
      });

      alert("Signup Successful!");
      router.push("/login");
    } catch (error: any) {
      console.log("SIGNUP ERROR:", error);

      if (error.code === "auth/email-already-in-use") {
        alert("Email already exists");
      } else if (error.code === "auth/invalid-email") {
        alert("Invalid email");
      } else if (error.code === "auth/weak-password") {
        alert("Password should be at least 6 characters");
      } else {
        alert("Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-[#020617] pointer-events-none" />

      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,255,255,0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="absolute top-[-300px] left-[5%] w-[700px] h-[700px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-300px] right-[5%] w-[700px] h-[700px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl bg-[#071120]/70 border border-white/10 backdrop-blur-3xl rounded-[40px] p-14 shadow-[0_0_80px_rgba(34,211,238,0.12)]">
        <div className="text-center mb-12">
          <h1 className="text-7xl font-black bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            SAHA CLOUD
          </h1>

          <p className="text-slate-400 text-2xl mt-5">
            Create Your VPS Account
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-7">
          <div>
            <label className="block text-slate-300 mb-3 text-xl">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/30 border border-slate-700 rounded-2xl px-6 py-5 text-white text-lg outline-none focus:border-cyan-400"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-3 text-xl">
              Email Address
            </label>

            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/30 border border-slate-700 rounded-2xl px-6 py-5 text-white text-lg outline-none focus:border-cyan-400"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-3 text-xl">
              Organization
            </label>

            <input
              type="text"
              placeholder="SAHA LABS"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="w-full bg-black/30 border border-slate-700 rounded-2xl px-6 py-5 text-white text-lg outline-none focus:border-cyan-400"
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
              minLength={6}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/30 border border-slate-700 rounded-2xl px-6 py-5 text-white text-lg outline-none focus:border-cyan-400"
              required
            />
          </div>

          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-6 py-4">
            <p className="text-cyan-300 font-semibold">Default Role: User</p>
            <p className="text-slate-400 text-sm mt-1">
              Owner/Admin access can be assigned only from Firestore.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:scale-[1.02] transition-all duration-300 py-5 rounded-2xl text-2xl font-bold text-white shadow-[0_0_35px_rgba(59,130,246,0.5)] disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-8 text-lg">
          Already have an account?{" "}
          <Link href="/login" className="text-cyan-300 hover:text-cyan-200">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}

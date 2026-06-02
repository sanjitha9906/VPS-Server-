"use client";

import { useEffect, useState } from "react";
import {
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

import { doc, getDoc, updateDoc } from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

export default function ProfilePage() {
  const [uid, setUid] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("User");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const [popup, setPopup] = useState("");

  const showPopup = (message: string) => {
    setPopup(message);

    setTimeout(() => {
      setPopup("");
    }, 2500);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      setUid(user.uid);

      const snap = await getDoc(doc(db, "users", user.uid));

      if (snap.exists()) {
        const data = snap.data();

        setName(data.name || "");
        setEmail(data.email || "");
        setRole(data.role || "user");
      }
    });

    return () => unsub();
  }, []);

  const saveProfile = async () => {
    try {
      setLoadingProfile(true);

      await updateDoc(doc(db, "users", uid), {
        name,
      });

      showPopup("Profile updated successfully!");
    } catch (error) {
      console.log(error);

      showPopup("Failed to update profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  const changePassword = async () => {
    try {
      if (!auth.currentUser) return;

      setLoadingPassword(true);

      const credential = EmailAuthProvider.credential(
        auth.currentUser.email || "",
        currentPassword,
      );

      await reauthenticateWithCredential(auth.currentUser, credential);

      await updatePassword(auth.currentUser, newPassword);

      setCurrentPassword("");
      setNewPassword("");

      showPopup("Password updated successfully!");
    } catch (error: any) {
      console.log(error);

      if (error.code === "auth/wrong-password") {
        showPopup("Current password is incorrect");
      } else if (error.code === "auth/weak-password") {
        showPopup("New password must be at least 6 characters");
      } else {
        showPopup("Failed to update password");
      }
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-white p-8">
      {/* POPUP */}
      {popup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#071120] border border-cyan-400/30 rounded-3xl px-10 py-8 shadow-[0_0_60px_rgba(34,211,238,0.25)] text-center">
            <h2 className="text-2xl font-bold text-cyan-300 mb-3">
              Notification
            </h2>

            <p className="text-white text-lg">{popup}</p>
          </div>
        </div>
      )}

      {/* BG */}
      <div className="absolute inset-0 bg-[#020617]" />

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,255,255,0.12) 1px, transparent 1px)",
          backgroundSize: "55px 55px",
        }}
      />

      <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-cyan-500/10 blur-[140px] rounded-full" />

      <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-blue-500/10 blur-[140px] rounded-full" />

      <div className="relative z-10">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-6xl font-black bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            USER PROFILE
          </h1>

          <p className="text-slate-400 text-xl mt-4">
            Manage your account information and security.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* PROFILE */}
          <div className="bg-[#071120]/70 border border-white/10 backdrop-blur-2xl rounded-3xl p-8">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-4xl font-bold">
                {name?.charAt(0)}
              </div>

              <div>
                <h2 className="text-4xl font-bold">{name}</h2>

                <p className="text-slate-400 mt-1">{email}</p>

                <p className="text-cyan-300 mt-2 capitalize">{role}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-slate-300 mb-3">Full Name</label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/30 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-3">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-black/20 border border-slate-800 rounded-2xl px-5 py-4 text-slate-400 cursor-not-allowed"
                />
              </div>

              <button
                onClick={saveProfile}
                disabled={loadingProfile}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 py-4 rounded-2xl text-lg font-bold hover:scale-[1.02] transition disabled:opacity-60"
              >
                {loadingProfile ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {/* SECURITY */}
          <div className="bg-[#071120]/70 border border-white/10 backdrop-blur-2xl rounded-3xl p-8">
            <h2 className="text-4xl font-bold mb-8">Security Settings</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-slate-300 mb-3">
                  Current Password
                </label>

                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-black/30 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-3">
                  New Password
                </label>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-black/30 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
                />
              </div>

              <button
                onClick={changePassword}
                disabled={loadingPassword}
                className="w-full bg-green-500 hover:bg-green-400 py-4 rounded-2xl text-lg font-bold transition disabled:opacity-60"
              >
                {loadingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

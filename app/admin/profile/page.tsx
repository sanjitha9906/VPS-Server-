export default function ProfilePage() {
  return (
    <div className="text-white p-10">

      <h1 className="text-5xl font-bold mb-2">
        User Profile
      </h1>

      <p className="text-slate-400 mb-10">
        Manage your account information.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Profile Card */}
        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-8">

          <div className="flex items-center gap-5 mb-8">

            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold">
              A
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                Admin
              </h2>

              <p className="text-slate-400">
                admin@gmail.com
              </p>
            </div>

          </div>

          <div className="space-y-5">

            <div>
              <label className="text-slate-400 text-sm">
                Full Name
              </label>

              <input
                type="text"
                defaultValue="Admin"
                className="w-full mt-2 bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 text-sm">
                Email
              </label>

              <input
                type="email"
                defaultValue="admin@gmail.com"
                className="w-full mt-2 bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 outline-none"
              />
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-xl font-semibold">
              Save Changes
            </button>

          </div>

        </div>

        {/* Security */}
        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-8">

          <h2 className="text-2xl font-bold mb-6">
            Security
          </h2>

          <div className="space-y-5">

            <div>
              <label className="text-slate-400 text-sm">
                Current Password
              </label>

              <input
                type="password"
                className="w-full mt-2 bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 text-sm">
                New Password
              </label>

              <input
                type="password"
                className="w-full mt-2 bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 outline-none"
              />
            </div>

            <button className="bg-green-600 hover:bg-green-700 transition px-6 py-3 rounded-xl font-semibold">
              Update Password
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
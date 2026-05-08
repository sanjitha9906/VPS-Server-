export default function SettingsPage() {
  return (
    <div className="text-white p-10">

      <h1 className="text-5xl font-bold mb-2">
        Settings
      </h1>

      <p className="text-slate-400 mb-10">
        Configure your VPS panel settings.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* General Settings */}
        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-8">

          <h2 className="text-2xl font-bold mb-6">
            General Settings
          </h2>

          <div className="space-y-5">

            <div>
              <label className="text-slate-400 text-sm">
                Panel Name
              </label>

              <input
                type="text"
                defaultValue="SAHA LABS VPS PANEL"
                className="w-full mt-2 bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 text-sm">
                Server Region
              </label>

              <select className="w-full mt-2 bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 outline-none">

                <option>
                  India
                </option>

                <option>
                  Singapore
                </option>

                <option>
                  Germany
                </option>

              </select>
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-xl font-semibold">
              Save Settings
            </button>

          </div>

        </div>

        {/* Appearance */}
        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-8">

          <h2 className="text-2xl font-bold mb-6">
            Appearance
          </h2>

          <div className="space-y-5">

            <div className="flex items-center justify-between bg-[#0b1120] border border-slate-700 rounded-xl px-5 py-4">

              <div>
                <h3 className="font-semibold">
                  Dark Mode
                </h3>

                <p className="text-sm text-slate-400">
                  Enable dark interface
                </p>
              </div>

              <input type="checkbox" defaultChecked />
            </div>

            <div className="flex items-center justify-between bg-[#0b1120] border border-slate-700 rounded-xl px-5 py-4">

              <div>
                <h3 className="font-semibold">
                  Notifications
                </h3>

                <p className="text-sm text-slate-400">
                  Receive server alerts
                </p>
              </div>

              <input type="checkbox" defaultChecked />
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
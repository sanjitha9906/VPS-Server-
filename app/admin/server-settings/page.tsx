import { currentUser } from "@/lib/user";

export default function ServerSettingsPage() {

  if (currentUser.role !== "admin") {
    return (
      <div className="text-white p-10 text-4xl font-bold">
        Access Denied
      </div>
    );
  }

  return (
    <div className="text-white p-10">

      <h1 className="text-5xl font-bold mb-2">
        Server Settings
      </h1>

      <p className="text-slate-400 mb-10">
        Configure your VPS server settings.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Server Info */}
        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-8">

          <h2 className="text-2xl font-bold mb-6">
            Server Information
          </h2>

          <div className="space-y-5">

            <div>
              <label className="text-slate-400 text-sm">
                Server Name
              </label>

              <input
                type="text"
                defaultValue="SahaLabs VPS"
                className="w-full mt-2 bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 text-sm">
                IP Address
              </label>

              <input
                type="text"
                defaultValue="192.168.1.1"
                className="w-full mt-2 bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 text-sm">
                Port
              </label>

              <input
                type="number"
                defaultValue="22"
                className="w-full mt-2 bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 outline-none"
              />
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-xl font-semibold">
              Save Server Settings
            </button>

          </div>

        </div>

        {/* Security */}
        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-8">

          <h2 className="text-2xl font-bold mb-6">
            Security Settings
          </h2>

          <div className="space-y-5">

            <div className="flex items-center justify-between bg-[#0b1120] border border-slate-700 rounded-xl px-5 py-4">

              <div>
                <h3 className="font-semibold">
                  Firewall
                </h3>

                <p className="text-sm text-slate-400">
                  Protect server from attacks
                </p>
              </div>

              <input type="checkbox" defaultChecked />
            </div>

            <div className="flex items-center justify-between bg-[#0b1120] border border-slate-700 rounded-xl px-5 py-4">

              <div>
                <h3 className="font-semibold">
                  SSH Access
                </h3>

                <p className="text-sm text-slate-400">
                  Allow terminal login
                </p>
              </div>

              <input type="checkbox" defaultChecked />
            </div>

            <div className="flex items-center justify-between bg-[#0b1120] border border-slate-700 rounded-xl px-5 py-4">

              <div>
                <h3 className="font-semibold">
                  Auto Backup
                </h3>

                <p className="text-sm text-slate-400">
                  Daily server backup
                </p>
              </div>

              <input type="checkbox" />
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
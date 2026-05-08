import { currentUser } from "@/lib/user";

export default function TerminalPage() {

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
        Terminal
      </h1>

      <p className="text-slate-400 mb-10">
        Execute server commands securely.
      </p>

      {/* Terminal Window */}
      <div className="bg-black border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800 bg-[#111827]">

          <div className="w-3 h-3 rounded-full bg-red-500"></div>

          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>

          <div className="w-3 h-3 rounded-full bg-green-500"></div>

          <span className="ml-4 text-slate-400 text-sm">
            root@sahalabs-server
          </span>

        </div>

        {/* Terminal Body */}
        <div className="p-6 font-mono text-green-400 min-h-[500px]">

          <p>
            root@sahalabs:~# systemctl status nginx
          </p>

          <p className="mt-4 text-slate-400">
            nginx.service - A high performance web server
          </p>

          <p className="text-green-400 mt-2">
            Active: active (running)
          </p>

          <div className="mt-8 flex items-center">

            <span>
              root@sahalabs:~#
            </span>

            <input
              type="text"
              className="bg-transparent border-none outline-none ml-3 w-full text-green-400"
              placeholder="Enter command..."
            />

          </div>

        </div>

      </div>

    </div>
  );
}
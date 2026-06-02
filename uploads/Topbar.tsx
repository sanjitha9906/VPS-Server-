export default function Topbar() {
  return (
    <div className="w-full flex items-center justify-between mb-10">

      <div>
        <h1 className="text-3xl font-bold text-white">
          SAHA LABS
        </h1>

        <p className="text-slate-400 mt-1">
          VPS Server Management Panel
        </p>
      </div>

      <div className="flex items-center gap-4">

        <input
          type="text"
          placeholder="Search..."
          className="bg-[#0b1120] border border-slate-800 rounded-2xl px-5 py-3 text-white outline-none"
        />

        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-lg font-bold">
          A
        </div>

      </div>

    </div>
  );
}
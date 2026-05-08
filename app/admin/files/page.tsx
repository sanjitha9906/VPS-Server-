import Link from "next/link";
import UploadButton from "@/components/files/UploadButton";
import FileMenu from "@/components/files/FileMenu";
import FileCard from "@/components/files/FileCard";

export default function FilesPage() {
  return (
    <div className="min-h-screen bg-black text-white p-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-10">

        <div>

          <h1 className="text-5xl font-bold">
            Files
          </h1>

          <p className="text-slate-400 mt-2">
            Manage server files and folders.
          </p>

        </div>

        <div className="flex gap-4">

          <button className="bg-blue-600 hover:bg-blue-700 transition px-6 py-4 rounded-2xl text-xl font-semibold">
            Upload File
          </button>

          <button className="bg-blue-600 hover:bg-blue-700 transition px-6 py-4 rounded-2xl text-xl font-semibold">
            Upload Folder
          </button>

        </div>

      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

        {/* Projects */}
        <Link href="/admin/files/projects">

          <div className="bg-zinc-900 border border-zinc-800 hover:border-blue-500 transition rounded-3xl p-8 cursor-pointer">

            <div className="flex items-center justify-between">

              <div className="text-6xl">
                📁
              </div>

              <FileMenu />

            </div>

            <h2 className="text-4xl font-bold mt-10">
              Projects
            </h2>

            <p className="text-zinc-400 text-xl mt-3">
              Folder
            </p>

          </div>

        </Link>

        {/* Backups */}
        <Link href="/admin/files/backups">

          <div className="bg-zinc-900 border border-zinc-800 hover:border-blue-500 transition rounded-3xl p-8 cursor-pointer">

            <div className="flex items-center justify-between">

              <div className="text-6xl">
                📁
              </div>

              <FileMenu />

            </div>

            <h2 className="text-4xl font-bold mt-10">
              Backups
            </h2>

            <p className="text-zinc-400 text-xl mt-3">
              Folder
            </p>

          </div>

        </Link>
    

      </div>

    </div>
  );
}
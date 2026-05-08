import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black text-black dark:text-white p-8">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">

          <div>
            <h1 className="text-4xl font-bold">
              VPS Dashboard
            </h1>

            <p className="text-gray-600 dark:text-zinc-400 mt-2">
              Manage your server and files easily
            </p>
          </div>

          <Link
            href="/admin/files"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition"
          >
            File Manager
          </Link>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">

            <p className="text-gray-600 dark:text-zinc-400 text-sm">
              CPU Usage
            </p>

            <h2 className="text-3xl font-bold mt-2">
              24%
            </h2>

          </div>

          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">

            <p className="text-gray-600 dark:text-zinc-400 text-sm">
              RAM Usage
            </p>

            <h2 className="text-3xl font-bold mt-2">
              6.2 GB
            </h2>

          </div>

          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">

            <p className="text-gray-600 dark:text-zinc-400 text-sm">
              Storage
            </p>

            <h2 className="text-3xl font-bold mt-2">
              128 GB
            </h2>

          </div>

        </div>

        {/* Server Status */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 mb-8 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-semibold">
                Server Status
              </h2>

              <p className="text-gray-600 dark:text-zinc-400 mt-1">
                Current server health and uptime
              </p>

            </div>

            <div className="bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 px-4 py-2 rounded-full">
              Online
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

            <div className="bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-4">

              <p className="text-gray-600 dark:text-zinc-400 text-sm">
                Uptime
              </p>

              <h3 className="text-xl font-bold mt-2">
                12 Days
              </h3>

            </div>

            <div className="bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-4">

              <p className="text-gray-600 dark:text-zinc-400 text-sm">
                Network
              </p>

              <h3 className="text-xl font-bold mt-2">
                Stable
              </h3>

            </div>

            <div className="bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-4">

              <p className="text-gray-600 dark:text-zinc-400 text-sm">
                Response Time
              </p>

              <h3 className="text-xl font-bold mt-2">
                23ms
              </h3>

            </div>

          </div>

        </div>

        {/* Recently Uploaded Files */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">

          <div className="mb-6">

            <h2 className="text-2xl font-semibold">
              Recently Uploaded Files
            </h2>

            <p className="text-gray-600 dark:text-zinc-400 mt-1">
              Latest uploaded files
            </p>

          </div>

          <div className="space-y-4">

            <div className="flex items-center justify-between bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-4">

              <div>

                <h3 className="font-medium">
                  project-backup.zip
                </h3>

                <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1">
                  24 MB
                </p>

              </div>

              <span className="text-sm text-gray-500 dark:text-zinc-500">
                2 mins ago
              </span>

            </div>

            <div className="flex items-center justify-between bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-4">

              <div>

                <h3 className="font-medium">
                  website-files.tar.gz
                </h3>

                <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1">
                  112 MB
                </p>

              </div>

              <span className="text-sm text-gray-500 dark:text-zinc-500">
                10 mins ago
              </span>

            </div>

            <div className="flex items-center justify-between bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-4">

              <div>

                <h3 className="font-medium">
                  database.sql
                </h3>

                <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1">
                  8 MB
                </p>

              </div>

              <span className="text-sm text-gray-500 dark:text-zinc-500">
                25 mins ago
              </span>

            </div>

            <div className="flex items-center justify-between bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-4">

              <div>

                <h3 className="font-medium">
                  node-app.zip
                </h3>

                <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1">
                  52 MB
                </p>

              </div>

              <span className="text-sm text-gray-500 dark:text-zinc-500">
                1 hour ago
              </span>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}
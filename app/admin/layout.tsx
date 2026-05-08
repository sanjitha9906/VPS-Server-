import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-[#020817] min-h-screen">
      <Sidebar />

      <main className="ml-72 flex-1 p-8 text-white">
        {children}
      </main>
    </div>
  );
}
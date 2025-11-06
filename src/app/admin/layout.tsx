import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Sidebar";
import { UserProvider } from "@/contexts/admin/UserContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <div className="h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </UserProvider>
  );
}
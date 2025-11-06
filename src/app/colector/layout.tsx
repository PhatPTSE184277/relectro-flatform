import Header from "@/components/colector/Header";
import Sidebar from "@/components/colector/Sidebar";
import { PostProvider } from "@/contexts/colector/PostContext";

export default function ColectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PostProvider>
      <div className="h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </PostProvider>
  );
}
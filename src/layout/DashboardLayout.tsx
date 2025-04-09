import { ReactNode } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 bg-blue-800 text-white p-4">
          <h2 className="text-xl font-bold mb-6">RoomMart Admin</h2>
          <nav className="flex flex-col gap-2">
            <Link to="/dashboard" className="hover:underline">
              Daftar Produk
            </Link>
            <Link to="/dashboard/add" className="hover:underline">
              Tambah Produk
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;

import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";

const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen px-6 py-8 bg-gray-100">
        <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>
          <p className="mb-6">Selamat datang, {user?.email || "Admin"}!</p>

          {/* Contoh Konten */}
          <div className="space-y-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700">
              + Tambah Produk
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;

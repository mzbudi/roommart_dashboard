import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { logoutApi } from "../services/authService";
import toast from "react-hot-toast";
import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";

const Navbar = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutApi();
      logout();
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat logout");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="w-full bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">RoomMart Admin</h1>
      <button
        onClick={() => {
          setIsModalOpen(true);
        }}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
      >
        {isLoggingOut ? (
          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
        ) : (
          "Logout 🚪"
        )}
      </button>

      {/* Modal konfirmasi logout */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Konfirmasi Logout"
        message="Apakah anda yakin ingin logout?"
        cancelButtonMessage="Batal"
        successButtonMessage="Logout"
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          setIsModalOpen(false);
          handleLogout();
        }}
      />
    </header>
  );
};

export default Navbar;

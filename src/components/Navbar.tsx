import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="w-full bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">RoomMart Admin</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
      >
        Logout 🚪
      </button>
    </header>
  );
};

export default Navbar;

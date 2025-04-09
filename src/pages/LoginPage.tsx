import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = () => {
    login({ email: "admin@example.com" }); // <-- kasih data user
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Login Admin</h2>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;

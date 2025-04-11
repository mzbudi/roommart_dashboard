import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../services/authService";
import { useEffect, useState } from "react";
import { FirebaseError } from "firebase/app";

const LoginPage = () => {
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setErrorMsg(""); // reset saat user mengubah email/password
  }, [email, password]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      if (!email || !password) {
        const error = new Error("Email dan password harus diisi.") as Error & {
          code?: string;
        };
        error.code = "auth/empty-fields";
        throw error;
      }
      const data = await loginApi(email, password);
      login(data);
      navigate("/dashboard");
    } catch (error) {
      const err = error as FirebaseError;
      if (err.code === "auth/user-not-found") {
        setErrorMsg("Email tidak terdaftar.");
      } else if (err.code === "auth/wrong-password") {
        setErrorMsg("Password salah.");
      } else if (err.code === "auth/invalid-email") {
        setErrorMsg("Format email tidak valid.");
      } else if (err.code === "auth/empty-fields") {
        setErrorMsg("Email dan password wajib diisi.");
      } else {
        setErrorMsg("Terjadi kesalahan saat login.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Login Admin</h2>

        {errorMsg && (
          <p className="text-red-500 text-sm mb-2 text-center">{errorMsg}</p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className={`w-full py-2 rounded transition ${
            isLoading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isLoading ? (
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
          ) : (
            "Login"
          )}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;

import { useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { addCategoryApi } from "../../services/CategoryService/addCategoryService";
import toast from "react-hot-toast";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!name.trim()) {
      setErrorMsg("Nama kategori tidak boleh kosong.");
      return;
    }

    setIsLoading(true);
    try {
      await addCategoryApi(name);
      setSuccessMsg("Kategori berhasil ditambahkan!");
      setName("");
      toast.success("Kategori berhasil ditambahkan");
    } catch (error) {
      console.error(error);
      setErrorMsg("Gagal menambahkan kategori.");
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Terjadi kesalahan saat menambahkan kategori.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto mt-8 p-6 bg-white shadow rounded">
        <h2 className="text-xl font-bold mb-4">Tambah Kategori Baru</h2>

        {errorMsg && (
          <p className="text-red-500 text-sm mb-2 text-center">{errorMsg}</p>
        )}
        {successMsg && (
          <p className="text-green-600 text-sm mb-2 text-center">
            {successMsg}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Nama Kategori</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              "Simpan Kategori"
            )}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddCategory;

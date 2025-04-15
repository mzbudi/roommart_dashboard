import { useState, useEffect } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getCategoryByIdApi } from "../../services/CategoryService/getCategoryService";
import { updateCategoryApi } from "../../services/CategoryService/updateCategoryService";
import { Category } from "../../interface/Category";

const AddCategory = () => {
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      console.log(id);

      try {
        if (!id) return;
        const fetched = await getCategoryByIdApi(id);
        if (!fetched) {
          toast.error("Kategori tidak ditemukan");
        }

        setCategory(fetched);
      } catch {
        toast.error("Gagal mengambil data produk");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!category?.name.trim()) {
      setErrorMsg("Nama kategori tidak boleh kosong.");
      return;
    }

    setIsLoading(true);
    try {
      await updateCategoryApi(id!, {
        name: category.name,
        nameLower: category.nameLower,
      });
      setSuccessMsg("Kategori berhasil diubah!");
      toast.success("Kategori berhasil diubah");
    } catch (error) {
      console.error(error);
      setErrorMsg("Gagal mengubah kategori.");
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Terjadi kesalahan saat mengubah kategori.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (field === "name") {
        setCategory((prev) =>
          prev ? { ...prev, name: value, nameLower: value.toLowerCase() } : null
        );
      }
    };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto mt-8 p-6 bg-white shadow rounded">
        <h2 className="text-xl font-bold mb-4">Ubah Kategori</h2>

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
              value={category?.name || ""}
              onChange={handleChange("name")}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              "Simpan Perubahan"
            )}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddCategory;

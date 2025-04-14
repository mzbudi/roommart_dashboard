import { useRef, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { addProductApi } from "../services/addProductService";
import toast from "react-hot-toast";

const AddProductPage = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState("makanan");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(""); // Untuk preview
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price || !category) {
      setErrorMsg("Detail produk harus diisi lengkap!");
      return;
    }

    setIsLoading(true);

    try {
      await addProductApi(imageFile, {
        name,
        nameLower: name.toLowerCase(),
        price,
        category,
      });

      toast.success("Product berhasil ditambahkan");
      handleReset();
    } catch (error) {
      console.error("Gagal menyimpan produk:", error);
      alert("Terjadi kesalahan saat menyimpan produk.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setName("");
    setPrice(0);
    setCategory("makanan");
    setImageFile(null);
    setImagePreview("");
    setErrorMsg("");

    // Reset input file secara langsung
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto mt-8 p-6 bg-white shadow rounded">
        <h2 className="text-xl font-bold mb-4">Tambah Produk Baru</h2>
        {errorMsg && (
          <p className="text-red-500 text-sm mb-2 text-center">{errorMsg}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Nama Produk</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Harga</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="makanan">Makanan</option>
              <option value="minuman">Minuman</option>
            </select>
          </div>
          <div>
            <label className="block font-medium">
              Upload Gambar (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="w-full border p-2 rounded"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 max-h-48 rounded border"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              "Simpan Produk"
            )}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddProductPage;

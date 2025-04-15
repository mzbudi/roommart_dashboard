import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layout/DashboardLayout";
import { getProductById } from "../../services/ProductService/getProductService";
import { updateProduct } from "../../services/ProductService/updateProductService";
import { Product } from "../../interface/Product";
import { toast } from "react-hot-toast";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        const fetched = await getProductById(id);
        if (!fetched) {
          toast.error("Produk tidak ditemukan");
          return navigate("/dashboard");
        }

        setProduct(fetched);
        setPreviewUrl(fetched.imageUrl || "");
      } catch {
        toast.error("Gagal mengambil data produk");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange =
    (field: keyof Product) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = field === "price" ? Number(e.target.value) : e.target.value;
      setProduct((prev) => (prev ? { ...prev, [field]: value } : null));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!id || !product) return;

    try {
      await updateProduct(id, {
        name: product.name,
        nameLower: product.nameLower.toLowerCase(),
        price: product.price,
        category: product.category,
        imageFile,
        existingImageUrl: previewUrl,
      });

      toast.success("Produk berhasil diperbarui");

      // navigate("/dashboard");
    } catch {
      toast.error("Gagal memperbarui produk");
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <div className="p-4">Produk tidak ditemukan.</div>;

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto mt-8 p-6 bg-white shadow rounded">
        <h2 className="text-xl font-bold mb-4">Edit Produk</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Nama Produk</label>
            <input
              type="text"
              value={product.name}
              onChange={handleChange("name")}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Harga</label>
            <input
              type="number"
              value={product.price}
              onChange={handleChange("price")}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Kategori</label>
            <select
              value={product.category}
              onChange={handleChange("category")}
              className="w-full border p-2 rounded"
            >
              <option value="makanan">Makanan</option>
              <option value="minuman">Minuman</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Gambar (opsional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border p-2 rounded"
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-2 h-32 object-contain"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {loading ? (
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

export default EditProductPage;

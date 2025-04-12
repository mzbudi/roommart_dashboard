import { useAuthStore } from "../store/useAuthStore";
import { useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import SearchInput from "../components/SearchInput";
import SortSelect from "../components/SortSelect";
import FilterSelect from "../components/FilterSelect";
import Pagination from "../components/Pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Product } from "../interface/Product";
import { getProductsApi } from "../services/getProductService";
import { timeStampToDate } from "../utils/helper";
import { deleteProduct } from "../services/deleteProductService";
import toast from "react-hot-toast";
import ConfirmationModal from "../components/ConfirmationModal";

const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "name-asc");
  const [categoryFilter, setCategoryFilter] = useState(
    searchParams.get("category") || "all"
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [itemsPerPage, setItemsPerPage] = useState(
    Number(searchParams.get("limit")) || 1
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const categoryOptions = [
    { label: "Semua Kategori", value: "all" },
    { label: "Makanan", value: "makanan" },
    { label: "Minuman", value: "minuman" },
  ];

  // const handleDelete = (id: number) => {
  //   setProducts(products.filter((p) => p.id !== id));
  // };

  // 🔁 Update URL jika ada perubahan filter/sort/page
  useEffect(() => {
    const params: Record<string, string> = {
      search: searchTerm,
      sort: sortBy,
      category: categoryFilter,
      page: String(currentPage),
      limit: String(itemsPerPage),
    };

    // Hapus param kosong
    Object.keys(params).forEach((key) => !params[key] && delete params[key]);

    setSearchParams(params);
    fetchData(currentPage);
  }, [searchTerm, sortBy, categoryFilter, currentPage, itemsPerPage]);

  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [searchTerm, sortBy, categoryFilter]);

  const fetchData = async (page: number) => {
    setLoading(true);

    try {
      const [field, direction] = sortBy.split("-");

      const directionValid = direction === "asc" ? "asc" : "desc";
      const validFields: Array<"name" | "price" | "createdAt"> = [
        "name",
        "price",
        "createdAt",
      ];
      const fieldValid = validFields.includes(
        field as "name" | "price" | "createdAt"
      )
        ? (field as "name" | "price" | "createdAt")
        : "createdAt";

      const { products, totalPages } = await getProductsApi(
        page,
        itemsPerPage,
        searchTerm,
        {
          field: fieldValid,
          direction: directionValid,
        },
        categoryFilter
      );

      setProducts(products);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Gagal memuat produk", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/dashboard/edit/${id}`);
  };

  const handleOpenModal = (id: string) => {
    setDeleteId(id);
    setIsModalOpen(true); // Menampilkan modal
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      await fetchData(currentPage);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message); // Menampilkan pesan error jika error adalah instance dari Error
      } else {
        toast.error("Gagal menghapus produk. Coba lagi.");
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen px-6 py-8 bg-gray-100">
        <div className="max-w-6xl mx-auto bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Dashboard Admin</h1>
            <p className="text-gray-600">
              Selamat datang, {user?.email || "Admin"}!
            </p>
          </div>

          {/* Baris kontrol: Tambah Produk + Search + Sort + Filter */}
          <div className="mb-4 grid grid-cols-12 gap-4 items-center">
            <div className="col-span-12 md:col-span-3">
              <button
                onClick={() => navigate("/dashboard/add")}
                className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
              >
                + Tambah Produk
              </button>
            </div>

            <div className="col-span-12 md:col-span-9">
              <div className="flex flex-wrap gap-2 justify-end">
                <SearchInput
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Cari produk..."
                />
                <SortSelect value={sortBy} onChange={setSortBy} />
                <FilterSelect
                  options={categoryOptions}
                  value={categoryFilter}
                  onChange={setCategoryFilter}
                />
              </div>
            </div>
          </div>

          {/* 📋 Tabel Produk */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="border px-4 py-2">Foto</th>
                  <th className="border px-4 py-2">Nama</th>
                  <th className="border px-4 py-2">Tanggal Dibuat</th>
                  <th className="border px-4 py-2">Harga</th>
                  <th className="border px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td className="border px-4 py-2">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="border px-4 py-2">{product.name}</td>
                      <td className="border px-4 py-2">
                        {timeStampToDate(product.createdAt)}
                      </td>
                      <td className="border px-4 py-2">
                        Rp {product.price.toLocaleString()}
                      </td>
                      <td className="border px-4 py-2 space-x-2">
                        <button
                          onClick={() => handleEdit(product.id!)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleOpenModal(product.id!)}
                          className="text-red-500 hover:underline"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-500 py-4">
                      Tidak ada produk ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(count) => {
                  setItemsPerPage(count);
                  setCurrentPage(1);
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modal konfirmasi logout */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Konfirmasi Hapus"
        message="Apakah anda yakin ingin menghapus product?"
        cancelButtonMessage="Batal"
        successButtonMessage="Hapus"
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          if (deleteId) {
            handleDelete(deleteId); // Menggunakan ID yang disimpan untuk dihapus
          }
          setIsModalOpen(false); // Menutup modal setelah konfirmasi
        }}
      />
    </DashboardLayout>
  );
};

export default DashboardPage;

import { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import SearchInput from "../../components/SearchInput";
import SortSelect from "../../components/SortSelect";
import Pagination from "../../components/Pagination";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import { getCategoriesApi } from "../../services/CategoryService/getCategoryService";
import { deleteCategoryApi } from "../../services/CategoryService/deleteCategoryService";
import toast from "react-hot-toast";
import { timeStampToDate } from "../../utils/helper";
import { Category } from "../../interface/Category";

const CategoryPage = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, sortBy, currentPage, itemsPerPage]);

  const fetchCategories = async (page: number) => {
    setLoading(true);
    const [field, direction] = sortBy.split("-");
    const directionValid = direction === "asc" ? "asc" : "desc";
    const validFields: Array<"name" | "createdAt"> = ["name", "createdAt"];
    const fieldValid = validFields.includes(field as "name" | "createdAt")
      ? (field as "name" | "createdAt")
      : "createdAt";
    try {
      const { categories, totalPages } = await getCategoriesApi(
        page,
        itemsPerPage,
        searchTerm,
        {
          field: fieldValid,
          direction: directionValid,
        }
      );
      setCategories(categories);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Gagal memuat kategori", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/category/edit/${id}`);
  };

  const handleOpenModal = (id: string) => {
    setDeleteId(id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategoryApi(id);
      await fetchCategories(currentPage);
      toast.success("Kategori berhasil dihapus");
    } catch (error) {
      console.error("Gagal menghapus kategori", error);
      toast.error("Gagal menghapus kategori");
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen px-6 py-8 bg-gray-100">
        <div className="max-w-6xl mx-auto bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Daftar Kategori</h1>
          </div>
          {loading && (
            <div className="flex justify-center">
              <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {!loading && (
            <>
              <div className="mb-4 flex flex-col md:flex-row justify-between gap-4">
                <button
                  onClick={() => navigate("/category/add")}
                  className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
                >
                  + Tambah Kategori
                </button>

                <div className="flex gap-2">
                  <SearchInput
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Cari kategori..."
                  />
                  <SortSelect value={sortBy} onChange={setSortBy} />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="border px-4 py-2">Nama</th>
                      <th className="border px-4 py-2">Tanggal Dibuat</th>
                      <th className="border px-4 py-2">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <tr key={category.id}>
                          <td className="border px-4 py-2">{category.name}</td>
                          <td className="border px-4 py-2">
                            {timeStampToDate(category.createdAt)}
                          </td>
                          <td className="border px-4 py-2 space-x-2">
                            <button
                              onClick={() => handleEdit(category.id!)}
                              className="text-blue-600 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleOpenModal(category.id!)}
                              className="text-red-500 hover:underline"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="text-center text-gray-500 py-4"
                        >
                          Tidak ada kategori ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

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
            </>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        title="Konfirmasi Hapus"
        message="Apakah anda yakin ingin menghapus kategori ini?"
        cancelButtonMessage="Batal"
        successButtonMessage="Hapus"
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          if (deleteId) {
            handleDelete(deleteId);
          }
          setIsModalOpen(false);
        }}
      />
    </DashboardLayout>
  );
};

export default CategoryPage;

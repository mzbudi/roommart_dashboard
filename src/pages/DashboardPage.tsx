import { useAuthStore } from "../store/useAuthStore";
import { useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import SearchInput from "../components/SearchInput";
import SortSelect from "../components/SortSelect";
import FilterSelect from "../components/FilterSelect";
import Pagination from "../components/Pagination";
import { useSearchParams } from "react-router-dom";

const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);
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
    Number(searchParams.get("limit")) || 5
  );

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Produk A",
      price: 10000,
      category: "makanan",
      imageUrl: "https://via.placeholder.com/100",
    },
    {
      id: 2,
      name: "Produk B",
      price: 20000,
      category: "minuman",
      imageUrl: "https://via.placeholder.com/100",
    },
    {
      id: 3,
      name: "Air Mineral",
      price: 5000,
      category: "minuman",
      imageUrl: "https://via.placeholder.com/100",
    },
    {
      id: 4,
      name: "Keripik Singkong",
      price: 15000,
      category: "makanan",
      imageUrl: "https://via.placeholder.com/100",
    },
    {
      id: 5,
      name: "Teh Botol",
      price: 8000,
      category: "minuman",
      imageUrl: "https://via.placeholder.com/100",
    },
    {
      id: 6,
      name: "Roti Bakar",
      price: 12000,
      category: "makanan",
      imageUrl: "https://via.placeholder.com/100",
    },
  ]);

  const categoryOptions = [
    { label: "Semua Kategori", value: "all" },
    { label: "Makanan", value: "makanan" },
    { label: "Minuman", value: "minuman" },
  ];

  const handleEdit = (id: number) => {
    console.log("Edit produk dengan ID:", id);
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

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
  }, [searchTerm, sortBy, categoryFilter, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, categoryFilter]);

  // 🔍 Filter berdasarkan search + kategori
  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchCategory =
      categoryFilter === "all" ? true : product.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  // 🔃 Sort setelah filter
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      default:
        return 0;
    }
  });

  // 📄 Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
              <button className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700">
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
                  <th className="border px-4 py-2">Harga</th>
                  <th className="border px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product) => (
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
                        Rp {product.price.toLocaleString()}
                      </td>
                      <td className="border px-4 py-2 space-x-2">
                        <button
                          onClick={() => handleEdit(product.id)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
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
    </DashboardLayout>
  );
};

export default DashboardPage;

import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  getCountFromServer,
  where,
  Query,
  startAt,
  endAt,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { Product } from "../../interface/Product";

export const getProductsApi = async (
  page: number,
  pageSize: number,
  searchQuery: string = "",
  sortBy: {
    field: "createdAt" | "price" | "name";
    direction: "asc" | "desc";
  } = {
    field: "createdAt",
    direction: "asc",
  },
  filterCategory?: string
): Promise<{
  products: Product[];
  totalData: number;
  totalPages: number;
}> => {
  const q = collection(db, "products");

  const constraints: QueryConstraint[] = [];

  // 🔍 Search case-insensitive berdasarkan nameLower
  if (searchQuery) {
    const keyword = searchQuery.toLowerCase();
    constraints.push(orderBy("nameLower"));
    constraints.push(startAt(keyword));
    constraints.push(endAt(keyword + "\uf8ff"));
  } else {
    // Default sort kalau tidak ada search
    constraints.push(orderBy(sortBy.field, sortBy.direction));
  }

  // 🏷 Filter kategori jika ada
  if (filterCategory && filterCategory !== "all") {
    constraints.push(where("category", "==", filterCategory));
  }

  // Buat query dasar dengan constraints
  const baseQuery = query(q, ...constraints);

  const offset = (page - 1) * pageSize;
  let lastDoc: QueryDocumentSnapshot<DocumentData> | null = null;

  // Offset manual
  if (offset > 0) {
    const offsetSnap = await getDocs(query(baseQuery, limit(offset)));
    lastDoc = offsetSnap.docs[offset - 1];
  }

  const pagedQuery = lastDoc
    ? query(baseQuery, startAfter(lastDoc), limit(pageSize))
    : query(baseQuery, limit(pageSize));

  const snapshot = await getDocs(pagedQuery);

  const products = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];

  const { totalData, totalPages } = await getTotalProducts(baseQuery, pageSize);

  return {
    products,
    totalData,
    totalPages,
  };
};

// Fungsi untuk mendapatkan total produk (untuk menghitung total halaman)
// total produk dihitung berdasarkan query yang diterapkan
export const getTotalProducts = async (
  q: Query, // Query yang digunakan (termasuk filter, search, dan sort)
  pageSize: number
) => {
  const snapshot = await getCountFromServer(q);
  const totalDocs = snapshot.data().count;
  const totalPages = Math.ceil(totalDocs / pageSize);
  return { totalData: totalDocs, totalPages };
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Product;
    } else {
      console.warn("Produk tidak ditemukan");
      return null;
    }
  } catch (error) {
    console.error("Gagal mengambil data produk:", error);
    throw error;
  }
};

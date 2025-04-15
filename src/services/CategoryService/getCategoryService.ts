import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  getCountFromServer,
  Query,
  QueryConstraint,
  startAt,
  endAt,
  QueryDocumentSnapshot,
  DocumentData,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { Category } from "../../interface/Category";

export const getCategoriesApi = async (
  page: number,
  pageSize: number,
  searchQuery: string = "",
  sortBy: {
    field: "createdAt" | "name";
    direction: "asc" | "desc";
  } = {
    field: "createdAt",
    direction: "asc",
  }
): Promise<{
  categories: Category[];
  totalData: number;
  totalPages: number;
}> => {
  const q = collection(db, "categories");

  const constraints: QueryConstraint[] = [];

  if (searchQuery) {
    const keyword = searchQuery.toLowerCase();
    constraints.push(orderBy("nameLower")); // Field tambahan: simpan nama kecil semua huruf
    constraints.push(startAt(keyword));
    constraints.push(endAt(keyword + "\uf8ff"));
  } else {
    constraints.push(orderBy(sortBy.field, sortBy.direction));
  }

  const baseQuery = query(q, ...constraints);

  const offset = (page - 1) * pageSize;
  let lastDoc: QueryDocumentSnapshot<DocumentData> | null = null;

  if (offset > 0) {
    const offsetSnap = await getDocs(query(baseQuery, limit(offset)));
    lastDoc = offsetSnap.docs[offset - 1];
  }

  const pagedQuery = lastDoc
    ? query(baseQuery, startAfter(lastDoc), limit(pageSize))
    : query(baseQuery, limit(pageSize));

  const snapshot = await getDocs(pagedQuery);

  const categories = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Category[];

  const { totalData, totalPages } = await getTotalCategories(
    baseQuery,
    pageSize
  );

  return {
    categories,
    totalData,
    totalPages,
  };
};

export const getTotalCategories = async (
  q: Query,
  pageSize: number
): Promise<{ totalData: number; totalPages: number }> => {
  const snapshot = await getCountFromServer(q);
  const totalDocs = snapshot.data().count;
  const totalPages = Math.ceil(totalDocs / pageSize);
  return { totalData: totalDocs, totalPages };
};

export const getCategoryByIdApi = async (
  id: string
): Promise<Category | null> => {
  try {
    const docRef = doc(db, "categories", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Category;
    } else {
      console.warn("Kategori tidak ditemukan");
      return null;
    }
  } catch (error) {
    console.error("Gagal mengambil data Kategori:", error);
    throw error;
  }
};

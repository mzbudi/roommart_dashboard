import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const addCategoryApi = async (name: string): Promise<void> => {
  try {
    const newCategory = {
      name,
      nameLower: name.toLowerCase(), // buat search case-insensitive
      createdAt: serverTimestamp(), // biar bisa disorting berdasarkan waktu
    };

    // check apakah kategori sudah ada
    const categoryRef = collection(db, "categories");
    const categorySnapshot = await getDocs(categoryRef);
    const existingCategory = categorySnapshot.docs.find(
      (doc) => doc.data().nameLower === newCategory.nameLower
    );
    if (existingCategory) {
      console.error("Kategori sudah ada:", name);
      throw new Error("Kategori sudah ada");
    }

    await addDoc(collection(db, "categories"), newCategory);
  } catch (error) {
    console.error("Gagal menambahkan kategori:", error);
    throw error;
  }
};

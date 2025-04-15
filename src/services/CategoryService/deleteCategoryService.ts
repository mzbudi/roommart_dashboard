import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

// Fungsi untuk menghapus kategori berdasarkan ID
export const deleteCategoryApi = async (categoryId: string) => {
  try {
    // Mendapatkan referensi dokumen berdasarkan ID kategori
    const categoryRef = doc(db, "categories", categoryId);

    // Menghapus dokumen
    await deleteDoc(categoryRef);
  } catch (error) {
    console.error("Error menghapus kategori: ", error);
  }
};

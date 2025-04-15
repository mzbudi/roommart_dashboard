// buat update category
import { db } from "../firebase/firebaseConfig";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";

export const updateCategoryApi = async (
  id: string,
  data: {
    name: string;
    nameLower: string;
  }
) => {
  try {
    const categoryRef = doc(db, "categories", id);

    // periksa apakah kategori sudah ada
    const categorySnapshot = await getDocs(collection(db, "categories"));
    const existingCategory = categorySnapshot.docs.find(
      (doc) => doc.data().nameLower === data.nameLower
    );
    if (existingCategory) {
      console.error("Kategori sudah ada:", data.name);
      throw new Error("Kategori sudah ada");
    }

    await updateDoc(categoryRef, {
      name: data.name,
      nameLower: data.nameLower,
    });

    return { success: true };
  } catch (error) {
    console.error("Gagal update category:", error);
    throw error;
  }
};

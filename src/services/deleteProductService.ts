import { doc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase/firebaseConfig";

// Fungsi untuk menghapus produk berdasarkan ID
export const deleteProduct = async (productId: string) => {
  try {
    // Mendapatkan referensi dokumen berdasarkan ID produk
    const productRef = doc(db, "products", productId);

    // Menghapus dokumen
    await deleteDoc(productRef);
  } catch (error) {
    console.error("Error menghapus produk: ", error);
  }
};

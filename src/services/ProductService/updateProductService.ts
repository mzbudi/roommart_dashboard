import { db } from "../firebase/firebaseConfig";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";

export const updateProduct = async (
  id: string,
  data: {
    name: string;
    nameLower: string;
    price: number;
    category: string;
    imageFile?: File | null;
    existingImageUrl?: string;
  }
) => {
  try {
    const storage = getStorage();
    let imageUrl = data.existingImageUrl || "";

    // Jika ada image baru
    if (data.imageFile) {
      // Hapus gambar lama jika ada
      if (data.existingImageUrl) {
        const decodedUrl = decodeURIComponent(data.existingImageUrl);
        const match = decodedUrl.match(/\/o\/(.+)\?/); // ambil setelah "/o/" sebelum "?"
        if (match && match[1]) {
          const filePath = match[1];
          const oldImageRef = ref(storage, filePath);
          await deleteObject(oldImageRef);
        }
      }

      // Upload gambar baru
      const newImageRef = ref(storage, `products/${id}-${data.imageFile.name}`);
      await uploadBytes(newImageRef, data.imageFile);
      imageUrl = await getDownloadURL(newImageRef);
    }

    const productRef = doc(db, "products", id);
    await updateDoc(productRef, {
      name: data.name,
      nameLower: data.nameLower,
      price: data.price,
      category: data.category,
      imageUrl,
    });

    return { success: true };
  } catch (error) {
    console.error("Gagal update product:", error);
    throw error;
  }
};

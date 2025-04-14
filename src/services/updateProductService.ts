import { db } from "./firebase/firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
    let imageUrl = data.existingImageUrl || "";

    // Upload gambar baru jika ada file baru
    if (data.imageFile) {
      const storage = getStorage();
      const imageRef = ref(storage, `products/${id}-${data.imageFile.name}`);
      await uploadBytes(imageRef, data.imageFile);
      imageUrl = await getDownloadURL(imageRef);
    }

    const productRef = doc(db, "products", id);
    await updateDoc(productRef, {
      name: data.name,
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

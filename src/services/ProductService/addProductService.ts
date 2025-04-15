import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../firebase/firebaseConfig"; // pastikan sudah setup
import { Product } from "../../interface/Product";

export const addProductApi = async (
  file: File | null,
  {
    name,
    nameLower,
    price,
    category,
  }: Omit<Product, "imageUrl" | "id" | "createdAt">
) => {
  let imageUrl = "";

  if (file) {
    const imageRef = ref(storage, `products/${Date.now()}-${file.name}`);
    const snapshot = await uploadBytes(imageRef, file);
    imageUrl = await getDownloadURL(snapshot.ref);
  }

  const newProduct = {
    name,
    nameLower,
    price,
    category,
    imageUrl,
    createdAt: serverTimestamp(),
  };

  await addDoc(collection(db, "products"), newProduct);
};

import { Timestamp } from "firebase/firestore";

export type Product = {
  id?: string;
  name: string;
  nameLower: string;
  price: number;
  category: string;
  imageUrl: string;
  createdAt: Timestamp;
};

import { Timestamp } from "firebase/firestore";

export interface Category {
  id: string;
  name: string;
  nameLower: string; // untuk pencarian yang tidak case-sensitive
  createdAt: Timestamp;
}

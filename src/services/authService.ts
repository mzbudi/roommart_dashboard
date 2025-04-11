// src/authService.ts
import {
  // Use this if register is needed
  // createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase/firebaseConfig";
import { User } from "../store/useAuthStore";

// Use this if register is needed
// export const register = async (email: string, password: string) => {
//   const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//   return userCredential.user;
// };

export const loginApi = async (
  email: string,
  password: string
): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const token = await userCredential.user.getIdToken();

  return {
    uid: userCredential.user.uid,
    email: userCredential.user.email!, // karena bisa null
    accessToken: token,
  };
};

export const logoutApi = async () => {
  await signOut(auth);
};

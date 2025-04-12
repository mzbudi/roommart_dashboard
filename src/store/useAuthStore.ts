// useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  uid: string;
  email: string;
  accessToken: string;
}

type AuthStore = {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      login: (user) => set({ user, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false }),
    }),
    {
      name: "auth-storage", // nama key di localStorage
    }
  )
);

import { create } from "zustand";
import { persist } from "zustand/middleware";

// !internal imports
import { mockUser } from "../../../data/data.user.js";

export const useSessionStore = create(
  persist(
    (set) => ({
      user: mockUser,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    { name: "fitique-session" },
  ),
);

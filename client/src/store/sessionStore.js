import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockUser } from "../data/mockData";
export const useSessionStore = create(persist((set) => ({ user: mockUser, setUser: (user) => set({ user }), logout: () => set({ user: null }) }), { name: "fitique-session" }));

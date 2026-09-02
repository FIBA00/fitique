import { create } from "zustand";
import { persist } from "zustand/middleware";

const currentSearch = (filters) => ({ category: filters.category || "", search: filters.search || "", sort: filters.sort || "newest", maxPrice: filters.maxPrice || "", size: filters.size || "", availability: Boolean(filters.availability) });
const searchLabel = (filters) => filters.search ? `“${filters.search}”` : [filters.category, filters.size, filters.maxPrice ? `Under $${filters.maxPrice}` : "", filters.availability ? "Available now" : ""].filter(Boolean).join(" · ") || "Current edit";

export const useDiscoveryStore = create(persist((set) => ({ savedSearches: [], saveSearch: (filters) => set((state) => { const payload = currentSearch(filters); const existing = state.savedSearches.find((item) => JSON.stringify(item.filters) === JSON.stringify(payload)); if (existing) return state; return { savedSearches: [{ id: crypto.randomUUID(), label: searchLabel(payload), filters: payload }, ...state.savedSearches].slice(0, 8) }; }), removeSearch: (id) => set((state) => ({ savedSearches: state.savedSearches.filter((item) => item.id !== id) })) }), { name: "fitique-discovery" }));

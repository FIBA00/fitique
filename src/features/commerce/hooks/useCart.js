import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCart = create(
  persist(
    (set, get) => ({
      items: [],
      promotionCode: "",
      orderNote: "",
      deliveryPreference: "Standard delivery",
      addItem(product, selection = {}) {
        const size = selection.size || product.sizes?.[0] || "One size";
        const color = selection.color || product.colors?.[0] || "Default";
        const quantity = selection.quantity || 1;
        const lineId = `${product.id}-${size}-${color}`;
        const existing = get().items.find((item) => item.lineId === lineId);
        if (existing) {
          set({
            items: get().items.map((item) =>
              item.lineId === lineId
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            ),
          });
          return;
        }
        set({
          items: [
            ...get().items,
            { ...product, lineId, size, color, quantity },
          ],
        });
      },
      updateQuantity(lineId, quantity) {
        if (quantity <= 0) return get().removeItem(lineId);
        set({
          items: get().items.map((item) =>
            item.lineId === lineId ? { ...item, quantity } : item,
          ),
        });
      },
      removeItem(lineId) {
        set({ items: get().items.filter((item) => item.lineId !== lineId) });
      },
      setPromotionCode(promotionCode) {
        set({ promotionCode: promotionCode.trim().toUpperCase() });
      },
      setOrderNote(orderNote) {
        set({ orderNote: orderNote.slice(0, 240) });
      },
      setDeliveryPreference(deliveryPreference) {
        set({ deliveryPreference });
      },
      clearCart() {
        set({
          items: [],
          promotionCode: "",
          orderNote: "",
          deliveryPreference: "Standard delivery",
        });
      },
    }),
    { name: "fitique-cart" },
  ),
);

// ! internal imports
import api, { apiIsConfigured, mockRequest } from "../../../api/api.js";
import { mockOrders } from "../../../data/data.fitResult";

let orders = [...mockOrders];

export const orderService = {
  async list() {
    if (apiIsConfigured) {
      const { data } = await api.get("/orders");
      return data;
    }
    return mockRequest([...orders], 400);
  },

  async getById(id) {
    if (apiIsConfigured) {
      const { data } = await api.get(`/orders/${id}`);
      return data;
    }
    return mockRequest(
      orders.find((order) => order.id === id),
      280,
    );
  },

  async create(payload) {
    if (apiIsConfigured) {
      const { data } = await api.post("/orders", payload);
      return data;
    }
    const order = {
      id: `FTQ-${Math.floor(21000 + Math.random() * 7999)}`,
      date: "Today",
      status: "Confirmed",
      total: payload.total,
      items: payload.items,
      payment: payload.payment || {
        method: "Card payment",
        status: "Your payment confirmation will appear here.",
      },
      delivery: {
        method: payload.deliveryMethod,
        window: "We’ll confirm your delivery window soon.",
        address: payload.address,
      },
    };
    orders = [order, ...orders];
    return mockRequest(order, 800);
  },
};

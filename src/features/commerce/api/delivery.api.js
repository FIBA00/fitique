// ! internal imports
import api, { apiIsConfigured, mockRequest } from "../../../api/api.js";

const defaultPreferences = { email: true, sms: false, push: true };
const readLocalPreferences = (orderId) => {
  try {
    const stored = JSON.parse(
      localStorage.getItem(`fitique-delivery-notifications-${orderId}`) || "{}",
    );
    return {
      email: stored.email ?? defaultPreferences.email,
      sms: stored.sms ?? stored.text ?? defaultPreferences.sms,
      push: stored.push ?? stored.browser ?? defaultPreferences.push,
    };
  } catch {
    return defaultPreferences;
  }
};

export const deliveryService = {
  async getRecord(order) {
    if (apiIsConfigured) {
      const { data } = await api.get(`/deliveries/${order.id}`);
      return data;
    }
    return mockRequest(
      {
        orderId: order.id,
        status: order.status,
        deliveryMethod: order.delivery?.method,
        window: order.delivery?.window,
        address: order.delivery?.address,
        carrier: null,
        trackingId: null,
        trackingUrl: null,
        updatedAt: null,
      },
      140,
    );
  },
  async listEvents(order) {
    if (apiIsConfigured) {
      const { data } = await api.get(`/deliveries/${order.id}/events`);
      return data;
    }
    const stages = ["Confirmed", "Preparing", "Out for Delivery", "Delivered"];
    const progress = Math.max(0, stages.indexOf(order.status));
    return mockRequest(
      stages.map((status, index) => ({
        id: `${order.id}-${status}`,
        status,
        occurredAt: null,
        trackingId: null,
        detail:
          index <= progress
            ? "A timestamp will be added with the delivery update."
            : "The next delivery moment will appear here.",
      })),
      180,
    );
  },
  async getPreferences(orderId) {
    if (apiIsConfigured) {
      const { data } = await api.get(
        `/deliveries/${orderId}/notification-preferences`,
      );
      return data;
    }
    return mockRequest(readLocalPreferences(orderId), 100);
  },
  async savePreferences({ orderId, preferences }) {
    if (apiIsConfigured) {
      const { data } = await api.put(
        `/deliveries/${orderId}/notification-preferences`,
        preferences,
      );
      return data;
    }
    localStorage.setItem(
      `fitique-delivery-notifications-${orderId}`,
      JSON.stringify(preferences),
    );
    return mockRequest(preferences, 160);
  },
};

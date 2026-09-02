// ! internal imports
import api, { apiIsConfigured, mockRequest } from "../../../api/api.js";

const previewMethods = [
	{
		id: "card",
		label: "Card payment",
		detail: "Your secure card step will appear here when payment is available.",
	},
	{
		id: "wallet",
		label: "Express wallet",
		detail: "A quick, device-based payment choice for eligible customers.",
	},
	{
		id: "bank",
		label: "Bank transfer",
		detail: "A considered option for markets that support it.",
	},
];

export const paymentService = {
	async listMethods() {
		if (apiIsConfigured) {
			const { data } = await api.get("/payments/methods");
			return data;
		}
		return mockRequest(previewMethods, 160);
	},
	async createHandoff({ orderId, method, returnUrl }) {
		if (apiIsConfigured) {
			const { data } = await api.post("/payments/sessions", {
				orderId,
				method,
				returnUrl,
			});
			return data;
		}
		const chosen =
			previewMethods.find((item) => item.id === method) ||
			previewMethods[0];
		return mockRequest(
			{
				orderId,
				method: chosen.label,
				methodId: chosen.id,
				status: "Awaiting payment confirmation",
				mode: "hosted",
				checkoutUrl: null,
				expiresAt: null,
				message: "Your secure payment step will appear here.",
			},
			220,
		);
	},
	async getHandoff(orderId) {
		if (apiIsConfigured) {
			const { data } = await api.get(`/payments/sessions/${orderId}`);
			return data;
		}
		return mockRequest(null, 100);
	},
};

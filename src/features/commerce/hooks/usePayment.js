import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ! internal imports
import { cachePolicy, queryKeys } from "../../../api/queryConfig.js";
import { paymentService } from "../api/payment.api.js";

export function usePaymentMethods() {
	return useQuery({
		queryKey: queryKeys.payment.methods(),
		queryFn: paymentService.listMethods,
		...cachePolicy.payment,
	});
}
export function usePaymentHandoff(orderId) {
	return useQuery({
		queryKey: queryKeys.payment.handoff(orderId),
		queryFn: () => paymentService.getHandoff(orderId),
		enabled: Boolean(orderId),
		...cachePolicy.payment,
	});
}
export function useCreatePaymentHandoff() {
	const client = useQueryClient();
	return useMutation({
		mutationFn: paymentService.createHandoff,
		onSuccess: (handoff) =>
			client.setQueryData(
				queryKeys.payment.handoff(handoff.orderId),
				handoff,
			),
	});
}

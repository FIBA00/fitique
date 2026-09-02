import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ! internal imports
import { cachePolicy, queryKeys } from "../../../api/queryConfig.js";
import { deliveryService } from "../api/delivery.api.js";

export function useDeliveryRecord(order) {
	return useQuery({
		queryKey: queryKeys.delivery.detail(order?.id),
		queryFn: () => deliveryService.getRecord(order),
		enabled: Boolean(order?.id),
		...cachePolicy.delivery,
	});
}
export function useDeliveryEvents(order) {
	return useQuery({
		queryKey: queryKeys.delivery.events(order?.id),
		queryFn: () => deliveryService.listEvents(order),
		enabled: Boolean(order?.id),
		...cachePolicy.deliveryEvents,
	});
}
export function useDeliveryPreferences(orderId) {
	return useQuery({
		queryKey: queryKeys.delivery.preferences(orderId),
		queryFn: () => deliveryService.getPreferences(orderId),
		enabled: Boolean(orderId),
		...cachePolicy.delivery,
	});
}
export function useSaveDeliveryPreferences() {
	const client = useQueryClient();
	return useMutation({
		mutationFn: deliveryService.savePreferences,
		onMutate: async ({ orderId, preferences }) => {
			await client.cancelQueries({
				queryKey: queryKeys.delivery.preferences(orderId),
			});
			const previous = client.getQueryData(
				queryKeys.delivery.preferences(orderId),
			);
			client.setQueryData(
				queryKeys.delivery.preferences(orderId),
				preferences,
			);
			return { previous, orderId };
		},
		onError: (_error, _input, context) => {
			if (context?.previous)
				client.setQueryData(
					queryKeys.delivery.preferences(context.orderId),
					context.previous,
				);
		},
		onSettled: (_data, _error, input) =>
			client.invalidateQueries({
				queryKey: queryKeys.delivery.preferences(input.orderId),
			}),
	});
}

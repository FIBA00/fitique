import { useQuery } from "@tanstack/react-query";

// ! internal imports
import { orderService } from "../api/orders.api.js";
import { cachePolicy, queryKeys } from "../../../api/queryConfig.js";
export function useOrders() {
	return useQuery({
		queryKey: queryKeys.orders.list(),
		queryFn: orderService.list,
		...cachePolicy.orders,
	});
}
export function useOrder(orderId) {
	return useQuery({
		queryKey: queryKeys.orders.detail(orderId),
		queryFn: () => orderService.getById(orderId),
		enabled: Boolean(orderId),
		...cachePolicy.orders,
	});
}

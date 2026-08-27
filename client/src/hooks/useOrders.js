import { useQuery } from "@tanstack/react-query";
import { orderService } from "../services/orders";
import { cachePolicy, queryKeys } from "../lib/queryConfig";
export function useOrders() { return useQuery({ queryKey: queryKeys.orders.list(), queryFn: orderService.list, ...cachePolicy.orders }); }
export function useOrder(orderId) { return useQuery({ queryKey: queryKeys.orders.detail(orderId), queryFn: () => orderService.getById(orderId), enabled: Boolean(orderId), ...cachePolicy.orders }); }

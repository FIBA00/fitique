import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cachePolicy, queryKeys } from "../lib/queryConfig";
import { deliveryService } from "../services/delivery";
import { paymentService } from "../services/payment";

export function usePaymentMethods() { return useQuery({ queryKey: queryKeys.payment.methods(), queryFn: paymentService.listMethods, ...cachePolicy.payment }); }
export function usePaymentHandoff(orderId) { return useQuery({ queryKey: queryKeys.payment.handoff(orderId), queryFn: () => paymentService.getHandoff(orderId), enabled: Boolean(orderId), ...cachePolicy.payment }); }
export function useCreatePaymentHandoff() { const client = useQueryClient(); return useMutation({ mutationFn: paymentService.createHandoff, onSuccess: (handoff) => client.setQueryData(queryKeys.payment.handoff(handoff.orderId), handoff) }); }
export function useDeliveryRecord(order) { return useQuery({ queryKey: queryKeys.delivery.detail(order?.id), queryFn: () => deliveryService.getRecord(order), enabled: Boolean(order?.id), ...cachePolicy.delivery }); }
export function useDeliveryEvents(order) { return useQuery({ queryKey: queryKeys.delivery.events(order?.id), queryFn: () => deliveryService.listEvents(order), enabled: Boolean(order?.id), ...cachePolicy.deliveryEvents }); }
export function useDeliveryPreferences(orderId) { return useQuery({ queryKey: queryKeys.delivery.preferences(orderId), queryFn: () => deliveryService.getPreferences(orderId), enabled: Boolean(orderId), ...cachePolicy.delivery }); }
export function useSaveDeliveryPreferences() { const client = useQueryClient(); return useMutation({ mutationFn: deliveryService.savePreferences, onMutate: async ({ orderId, preferences }) => { await client.cancelQueries({ queryKey: queryKeys.delivery.preferences(orderId) }); const previous = client.getQueryData(queryKeys.delivery.preferences(orderId)); client.setQueryData(queryKeys.delivery.preferences(orderId), preferences); return { previous, orderId }; }, onError: (_error, _input, context) => { if (context?.previous) client.setQueryData(queryKeys.delivery.preferences(context.orderId), context.previous); }, onSettled: (_data, _error, input) => client.invalidateQueries({ queryKey: queryKeys.delivery.preferences(input.orderId) }) }); }

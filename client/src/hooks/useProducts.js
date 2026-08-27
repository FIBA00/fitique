import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/products";
import { cachePolicy, queryKeys } from "../lib/queryConfig";
export function useProducts(filters) { return useQuery({ queryKey: queryKeys.catalog.list(filters), queryFn: () => productService.list(filters), ...cachePolicy.catalog }); }
export function useProduct(productId) { return useQuery({ queryKey: queryKeys.catalog.detail(productId), queryFn: () => productService.getById(productId), enabled: Boolean(productId), ...cachePolicy.catalog }); }
export function useCategories() { return useQuery({ queryKey: queryKeys.catalog.categories(), queryFn: productService.listCategories, ...cachePolicy.categories }); }

import { useQuery } from "@tanstack/react-query";

// ! internal imports
import { productService } from "../api/products.api.js";
import { cachePolicy, queryKeys } from "../../../lib/queryConfig.js";

export function useProducts(filters) {
  return useQuery({
    queryKey: queryKeys.catalog.list(filters),
    queryFn: () => productService.list(filters),
    ...cachePolicy.catalog,
  });
}

export function useProduct(productId) {
  return useQuery({
    queryKey: queryKeys.catalog.detail(productId),
    queryFn: () => productService.getById(productId),
    enabled: Boolean(productId),
    ...cachePolicy.catalog,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.catalog.categories(),
    queryFn: productService.listCategories,
    ...cachePolicy.categories,
  });
}

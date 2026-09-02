import { trpc } from "../../../api/trpc.js";
import { cachePolicy } from "../../../api/queryConfig.js";

export function useAuth() {
  const query = trpc.auth.me.useQuery(undefined, cachePolicy.profile);
  return {
    user: query.data || null,
    loading: query.isLoading,
    error: query.error,
    isAuthenticated: Boolean(query.data),
  };
}

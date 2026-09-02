import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ! internal imports

import { cachePolicy, queryKeys } from "../../../api/queryConfig";
import { authService } from "../../auth/api/auth.api";

export function useProfile(enabled = true) {
  return useQuery({
    queryKey: queryKeys.profile.current(),
    queryFn: authService.getProfile,
    enabled,
    ...cachePolicy.profile,
  });
}

export function useUpdateProfile() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (profile) =>
      client.setQueryData(queryKeys.profile.current(), profile),
  });
}

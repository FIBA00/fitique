import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cachePolicy, queryKeys } from "../lib/queryConfig";
import { authService } from "../services/auth";

export function useProfile(enabled = true) { return useQuery({ queryKey: queryKeys.profile.current(), queryFn: authService.getProfile, enabled, ...cachePolicy.profile }); }
export function useUpdateProfile() { const client = useQueryClient(); return useMutation({ mutationFn: authService.updateProfile, onSuccess: (profile) => client.setQueryData(queryKeys.profile.current(), profile) }); }

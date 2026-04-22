"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "@/api/service";

export function useUser(userId: number) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
    
    enabled: !!userId,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
}
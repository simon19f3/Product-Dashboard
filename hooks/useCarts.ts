"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchCarts, CartsResponse } from "@/api/service";

interface UseCartsParams {
  skip?: number;
  limit?: number;
}

export function useCarts({ skip = 0, limit = 10 }: UseCartsParams = {}) {
  return useQuery<CartsResponse>({
    // Include params in the key so it refetches when they change
    queryKey: ["carts", { skip, limit }], 
    
    queryFn: () => fetchCarts(skip, limit),
    
    // ⚡ MAGIC: Keeps the current data on screen while the next page loads
    // This prevents layout shift and flickering spinners during pagination
    placeholderData: keepPreviousData,
    
    // Cache settings
    staleTime: 1000 * 60 * 5, 
  });
}
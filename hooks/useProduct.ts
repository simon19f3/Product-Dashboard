"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProduct } from "@/api/service";

export  function useProduct(productId: number | null) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId!),
    
    // Prevents the query from running if ID is null/undefined
    enabled: !!productId, 
    
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 1, // Only retry once if it fails
  });
}
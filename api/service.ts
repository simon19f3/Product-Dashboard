// api/service.ts

// --- Types ---
export interface Cart {
  id: number;
  products: any[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

export interface CartsResponse {
  carts: Cart[];
  total: number;
  skip: number;
  limit: number;
}

// --- Fetch Functions ---

/**
 * Fetches carts with pagination support.
 * @param skip - Number of items to skip (offset)
 * @param limit - Number of items to return (page size)
 */
export async function fetchCarts(skip = 0, limit = 10): Promise<CartsResponse> {
  const res = await fetch(`https://dummyjson.com/carts?skip=${skip}&limit=${limit}`);

  if (!res.ok) {
    throw new Error("Failed to fetch carts");
  }

  return res.json();
}

export const fetchProduct = async (id: number) => {
  const res = await fetch(`https://dummyjson.com/products/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }
  return res.json();
};

export const fetchUser = async (userId: number) => {
  const res = await fetch(`https://dummyjson.com/users/${userId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }
  return res.json();
};
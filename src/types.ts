export type Product = {
  id: string;
  name: string;
  description: string;
  price: number; // PHP, decimal major units
  category: string;
  available: boolean;
};

export type CartLine = { productId: string; quantity: number };
export type OrderStatus = 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded';
export type OrderLookup = {
  referenceNumber: string;
  status: OrderStatus;
  totalAmount: number;
  currency: 'PHP';
  createdAt: string;
  paidAt: string | null;
};

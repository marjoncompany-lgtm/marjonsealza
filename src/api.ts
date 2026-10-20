import type { OrderLookup, Product } from './types';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'https://marjonsealza-paymongo.emeritabuilder.workers.dev').replace(/\/$/, '');

const FALLBACK_PRODUCTS: Product[] = [
  { id: 'hardbound-engineering-journal', name: 'Hardbound Engineering Journal (SKU::EJ-01)', description: 'Archival-grade grid paper, leather cover with gold-foil seal and serialized production badge.', price: 1850, category: 'Tangibles', available: false },
  { id: 'hardware-dev-merch-pack', name: 'Hardware Dev Merch Pack (SKU::MP-04)', description: 'Custom desk mat, matte black aluminum pen, collector box, and schematic art cards.', price: 3200, category: 'Tangibles', available: false },
  { id: 'systems-architecture-consultation', name: 'Architecture Consultation (SRV::CNS-01)', description: '1-on-1 systems audit, deployment advisory, and cryptographic edge architecture session with Marjon Sealza.', price: 9800, category: 'Services', available: false },
  { id: 'digital-consultation', name: 'Digital Consultation', description: 'A focused session to discuss a digital or software project.', price: 1500, category: 'Services', available: false },
  { id: 'website-planning', name: 'Website Planning Package', description: 'A structured website planning and requirements package.', price: 3500, category: 'Services', available: false },
  { id: 'custom-project-inquiry', name: 'Custom Project Deposit', description: 'Use only after confirming the scope and deposit terms with the customer.', price: 1000, category: 'Projects', available: false }
];

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || 'Request failed. Please try again.');
  return body as T;
}

export const api = {
  products: async (): Promise<{ products: Product[] }> => {
    try {
      const res = await request<{ products: Product[] }>('/api/products');
      if (res && Array.isArray(res.products) && res.products.length > 0) {
        return res;
      }
      return { products: FALLBACK_PRODUCTS };
    } catch {
      return { products: FALLBACK_PRODUCTS };
    }
  },
  createCheckout: (payload: {
    items: { productId: string; quantity: number }[];
    customer: { name: string; email: string; phone?: string };
  }) => request<{ checkoutUrl: string; referenceNumber: string }>('/api/checkout', {
    method: 'POST', body: JSON.stringify(payload)
  }),
  order: (reference: string) => request<{ order: OrderLookup }>(`/api/orders/${encodeURIComponent(reference)}`)
};
